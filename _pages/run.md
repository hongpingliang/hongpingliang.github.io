---
layout: archive
title: "🏃 Run"
permalink: /run/
author_profile: true
---

{% include base_path %}


<style>
#run-map{height:550px;margin:24px 0;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 8px 24px rgba(0,0,0,.12);}
.leaflet-control-zoom a{border-radius:8px!important;}
.leaflet-control-attribution{border-radius:8px 0 0 0!important;background:rgba(255,255,255,.85)!important;}
.leaflet-control-layers{border-radius:10px!important;box-shadow:0 2px 12px rgba(0,0,0,.2)!important;font-size:12px!important;line-height:1.2;}
.leaflet-control-layers-base label,.leaflet-control-layers-overlays label{display:block!important;white-space:nowrap;margin:2px 0;font-size:12px!important;font-weight:400;}
.leaflet-control-layers input,.leaflet-control-layers input[type=radio]{display:inline-block!important;vertical-align:middle;margin:0 4px 0 0!important;position:static!important;float:none!important;}
.leaflet-control-layers span{display:inline!important;vertical-align:middle;}
.leaflet-control-layers-list{padding:2px 0;}

.run-map-title,.run-map-footer{position:absolute;left:50%;transform:translateX(-50%);z-index:1000;text-align:center;font-weight:800;color:white;-webkit-text-stroke:1px #1976D2;text-shadow:2px 2px 4px black;pointer-events:none;white-space:nowrap}
.run-map-title{top:20px;font-size:36px}
.run-map-footer{bottom:25px;font-size:22px}
@media(max-width:600px){.run-map-title{top:15px;font-size:24px;max-width:90%;white-space:normal}.run-map-footer{bottom:15px;font-size:16px}}
</style>

<br/>
<h2 id="run-title" style="margin:0 0 12px;font-size:1.4rem;font-weight:600;"></h2>
<h2 id="run-subtitle" style="margin:0 0 12px;font-size:1.2rem;font-weight:400;"></h2>


<div id="run-map"></div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/leaflet-gpx@2.2.0/gpx.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

<script>
window.addEventListener("load",function(){
    const activityId=new URLSearchParams(window.location.search).get("id");
    if(!activityId){
        document.getElementById("run-detail").innerHTML="<h2>No activity selected.</h2>";
        return;
    }

    fetch("/files/runs/activities.csv")
    .then(r=>r.text())
    .then(csv=>{
        Papa.parse(csv,{
            header:true,
            skipEmptyLines:true,
            complete:function(results){

                const run=results.data.find(r=>r["Activity ID"]===activityId);

                if(!run){
                    document.getElementById("run-detail").innerHTML="<h2>Run not found.</h2>";
                    return;
                }

                const runName = run["Activity Name"];
                const miles=(parseFloat(run["Distance"])*0.621371).toFixed(1);
                const date=run["Activity Date"].split(" ").slice(0,3).join(" ");

                if (!run["Filename"]) {
                    document.getElementById("run-title").innerHTML=runName;
                    document.getElementById("run-subtitle").innerHTML=
                        "<span'>"+miles+" miles</span>"+
                        "<span style='margin-left:80px;'> "+date+"</span>";
                    document.getElementById("run-map").innerHTML =
                        '<img src="/files/runs/png/' + activityId +
                        '.png" alt="Route Map" ' +
                        'style="width:100%;height:auto;border-radius:12px;display:block;">';
                } else {
                    showMap(activityId, runName, miles, date);
                }
            }
        });
    });

});

function showMap(id, runName, miles, date) {
    const map = L.map("run-map").setView([0, 0], 2);

    const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: "&copy;"
    });

    const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "&copy;" }
    ).addTo(map);

    new L.GPX("/files/runs/activities/" + id + ".gpx", {
        async: true,
        polyline_options: { color: "#fff", weight: 10, opacity: 0.8 },
        marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
    }).addTo(map);

    const gpx = new L.GPX("/files/runs/activities/" + id + ".gpx", {
        async: true,
        polyline_options: {
            color: "#1976D2", weight: 6, opacity: 1,
            lineCap: "round", lineJoin: "round"
        },
        marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
    }).addTo(map);

    L.control.layers(
        { "Street": osm, "Satellite": satellite },
        null,
        { collapsed: false }
    ).addTo(map);

    addRunInfoLayer(map, runName, miles, date);

    gpx.on("loaded", e => {
        const b = e.target.getBounds();
        b.isValid() ? map.fitBounds(b, { padding: [20, 20] })
                    : map.setView([41.3083, -72.9279], 13);
    });

    gpx.on("error", e => console.log("GPX error", e));
}

// Custom run information layer
function addRunInfoLayer(map, runName, miles, date) {
    const container = map.getContainer();

    // Ensure absolute positioning works
    container.style.position = "relative";

    // Top center: run name
    const title = L.DomUtil.create(
        "div",
        "run-map-title",
        container
    );

    title.textContent = runName;

    // Bottom center: miles and date
    const footer = L.DomUtil.create(
        "div",
        "run-map-footer",
        container
    );

    footer.textContent = `${miles} miles  |  ${date}`;

    // Prevent map interactions when clicking the overlay
    L.DomEvent.disableClickPropagation(title);
    L.DomEvent.disableClickPropagation(footer);
}
</script>