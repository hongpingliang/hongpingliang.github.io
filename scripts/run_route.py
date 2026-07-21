import gzip, os
import contextily as ctx
import fitdecode, gpxpy
import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd
import shutil
from shapely.geometry import LineString
import gzip
import fitdecode
import json
import xml.etree.ElementTree as ET

class GpxRouteImage:

    def __init__(self, input_dir, out_dir):
        self.input_dir = input_dir
        self.out_dir = out_dir

    def deg(self, v):
        return v * 180.0 / 2147483648.0

    def read_gpx(self, fn):
        lats, lons = [], []
        with open(fn, encoding="utf-8") as f:
            gpx = gpxpy.parse(f)
        for t in gpx.tracks:
            for s in t.segments:
                for p in s.points:
                    lats.append(p.latitude); lons.append(p.longitude)
        return lats, lons

    def read_fit(self, fn):
        lats, lons = [], []
        with (gzip.open(fn, "rb") if fn.endswith(".gz") else open(fn, "rb")) as fp:
            with fitdecode.FitReader(fp) as fit:
                for fr in fit:
                    if not isinstance(fr, fitdecode.FitDataMessage) or fr.name != "record":
                        continue
                    d = {f.name: f.value for f in fr.fields}
                    lat, lon = d.get("position_lat"), d.get("position_long")
                    if lat is not None and lon is not None:
                        lats.append(self.deg(lat)); lons.append(self.deg(lon))
        return lats, lons

    def read_route(self, fn):
        return self.read_gpx(fn) if fn.lower().endswith(".gpx") else self.read_fit(fn)

    # source=ctx.providers.Esri.WorldImagery,
    # source=ctx.providers.OpenStreetMap.Mapnik,
    def draw_route(self, activity_file, png_file, activity_name, activity_date, distance):
        lats, lons = self.read_route(activity_file)
        if len(lats) < 2:
            print(f"No GPS points: {activity_file}")
            return

        gdf = gpd.GeoDataFrame(
            geometry=[LineString(zip(lons, lats))], crs="EPSG:4326"
        ).to_crs(epsg=3857)

        x, y = gdf.geometry.iloc[0].xy

        fig, ax = plt.subplots(figsize=(3, 3), dpi=200)
        fig.subplots_adjust(0, 0, 1, 1)
        ax.set_position([0, 0, 1, 1])

        pad = max(max(x) - min(x), max(y) - min(y)) * 0.08 or 100
        ax.set_xlim(min(x) - pad, max(x) + pad)
        ax.set_ylim(min(y) - pad, max(y) + pad)

        ctx.add_basemap(
            ax,
            crs=gdf.crs,
            source=ctx.providers.OpenStreetMap.Mapnik,
            zoom="auto",
            reset_extent=False,
        )

        ax.plot(x, y, color="white", linewidth=5, solid_capstyle="round", solid_joinstyle="round", zorder=3)
        ax.plot(x, y, color="#1976D2", linewidth=3, solid_capstyle="round", solid_joinstyle="round", zorder=4)

        ax.scatter(x[0], y[0], s=36, c="#34C759", edgecolors="white", linewidth=1.5, zorder=5)
        ax.scatter(x[-1], y[-1], s=36, c="#FF3B30", edgecolors="white", linewidth=1.5, zorder=5)

        ax.set_axis_off()
        fig.savefig(png_file, dpi=200, bbox_inches=None, pad_inches=0)
        plt.close(fig)

        print(f"Created {png_file}")

    def run(self):
        csv_file = os.path.join(self.out_dir, "activities.csv")
        df = pd.read_csv(csv_file)
        for _, row in df.iterrows():
            tt = row["Is_Favorite"]
            if not row["Is_Favorite"] == 1:
                continue

            fn = os.path.normpath(str(row["Filename"]).strip())
            inputActivity = os.path.join(self.input_dir, fn)
            if not os.path.exists(inputActivity):
                print(f"Missing: {inputActivity}")
                continue

            if inputActivity.endswith(".gz"):
                jsonfile = os.path.join(self.out_dir, "activities", f'{row["Activity ID"]}.json')
                gpxFile = os.path.join(self.out_dir, "activities", f'{row["Activity ID"]}.gpx')
                if not os.path.exists(jsonfile):
                    self.fit_to_json(inputActivity, jsonfile)
                if not os.path.exists(gpxFile):
                    self.fit_to_gpx(inputActivity, gpxFile)
            elif inputActivity.endswith(".gpx"):
                if not os.path.exists(inputActivity):
                    os.makedirs(os.path.dirname(inputActivity), exist_ok=True)
                    shutil.copy2(inputActivity, inputActivity)
                    print(f"Copied: {inputActivity} -> {inputActivity}")

            # png = os.path.join(self.out_dir, "png",  f'{row["Activity ID"]}.png')
            # self.draw_route(inputActivity, png, row["Activity Name"], str(row["Activity Date"]).split()[0], float(row["Distance"]) * 0.621371 )

    def fit_to_json(self, gz_file, json_file):
        recs=[];hr=[];cad=[];spd=[];alt=[];pwr=[]

        with gzip.open(gz_file,"rb") as f, fitdecode.FitReader(f) as fit:
            for frame in fit:
                if not isinstance(frame, fitdecode.FitDataMessage) or frame.name!="record":
                    continue

                r={}
                for fld in frame.fields:
                    if fld.name in (
                        "timestamp",
                        "position_lat","position_long",
                        "distance",
                        "heart_rate",
                        "cadence",
                        "enhanced_speed","speed",
                        "enhanced_altitude","altitude",
                        "power"
                    ):
                        r[fld.name]=fld.value

                # Convert Garmin semicircles to latitude/longitude
                if "position_lat" in r:
                    r["lat"]=r.pop("position_lat")*180/2**31
                if "position_long" in r:
                    r["lon"]=r.pop("position_long")*180/2**31

                s=r.get("enhanced_speed",r.get("speed"))
                if s:
                    r["pace_min_mi"]=round(26.8224/s,2)
                    spd.append(s)

                if "heart_rate" in r: hr.append(r["heart_rate"])
                if "cadence" in r: cad.append(r["cadence"])
                if "power" in r: pwr.append(r["power"])

                elev=r.get("enhanced_altitude",r.get("altitude"))
                if elev is not None:
                    alt.append(elev)
                    r["elevation"]=elev

                recs.append(r)

        out={
            "summary":{
                "avg_hr":round(sum(hr)/len(hr),1) if hr else None,
                "max_hr":max(hr) if hr else None,
                "avg_cadence":round(sum(cad)/len(cad),1) if cad else None,
                "max_cadence":max(cad) if cad else None,
                "avg_speed_mps":round(sum(spd)/len(spd),2) if spd else None,
                "max_speed_mps":round(max(spd),2) if spd else None,
                "avg_pace_min_mi":round(26.8224/(sum(spd)/len(spd)),2) if spd else None,
                "best_pace_min_mi":round(26.8224/max(spd),2) if spd else None,
                "min_elevation":round(min(alt),1) if alt else None,
                "max_elevation":round(max(alt),1) if alt else None,
                "gain":round(sum(max(0,b-a) for a,b in zip(alt,alt[1:])),1) if len(alt)>1 else 0,
                "loss":round(sum(max(0,a-b) for a,b in zip(alt,alt[1:])),1) if len(alt)>1 else 0,
                "avg_power":round(sum(pwr)/len(pwr),1) if pwr else None,
                "max_power":max(pwr) if pwr else None
            },
            "records":recs
        }

        with open(json_file,"w") as f:
            json.dump(out,f,indent=2,default=str)

        print(f"Wrote {json_file}")

    def fit_to_gpx(self, fit_gz_file, gpx_file):
        SEMICIRCLE_TO_DEG = 180.0 / 2147483648.0

        with gzip.open(fit_gz_file, "rb") as f:
            gpx = ET.Element(
                "gpx",
                version="1.1",
                creator="fitdecode",
                xmlns="http://www.topografix.com/GPX/1/1"
            )

            trk = ET.SubElement(gpx, "trk")
            ET.SubElement(trk, "name").text = fit_gz_file
            seg = ET.SubElement(trk, "trkseg")

            with fitdecode.FitReader(f) as fit:
                for frame in fit:
                    if not isinstance(frame, fitdecode.FitDataMessage):
                        continue
                    if frame.name != "record":
                        continue

                    lat = lon = ele = t = None

                    for field in frame.fields:
                        if field.name == "position_lat" and field.value is not None:
                            lat = field.value * SEMICIRCLE_TO_DEG
                        elif field.name == "position_long" and field.value is not None:
                            lon = field.value * SEMICIRCLE_TO_DEG
                        elif field.name == "altitude":
                            ele = field.value
                        elif field.name == "timestamp":
                            t = field.value

                    if lat is None or lon is None:
                        continue

                    pt = ET.SubElement(
                        seg,
                        "trkpt",
                        lat=f"{lat:.8f}",
                        lon=f"{lon:.8f}"
                    )

                    if ele is not None:
                        ET.SubElement(pt, "ele").text = f"{ele:.2f}"

                    if t is not None:
                        ET.SubElement(pt, "time").text = t.isoformat() + "Z"

        ET.indent(gpx, space="  ")

        ET.ElementTree(gpx).write(
            gpx_file,
            encoding="utf-8",
            xml_declaration=True
        )

        print(f"Created {gpx_file}")

if __name__ == "__main__":
    GpxRouteImage(r"C:\Users\liangh\Desktop\New folder\run_route", r"C:\Users\liangh\Desktop\git\hongpingliang.github.io\files\runs").run()
    # import contextily as ctx
    # import matplotlib.pyplot as plt

    # fig, ax = plt.subplots(figsize=(6,6))
    # ax.set_xlim(-8570000,-8560000)
    # ax.set_ylim(4700000,4710000)

    # ctx.add_basemap(ax, source=ctx.providers.OpenStreetMap.Mapnik)

    # plt.show()