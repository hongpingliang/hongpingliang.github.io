class IFS {
	name;
	maps;
	x1; y1; x2; y2;

	_originalMap;
	_originalProbs;
	constructor(name, maps) {
		this.name = name;
		this.maps = maps;
	}
			
	getWhichMap() {
		var r = Math.random();
		for (var k=0; k<this.maps.length; k++) {
			r -= this.maps[k][6];
			if ( r < 0 ) {
				return k;
			}
		}
		return 0;
	}
	
	toString() {
		return this.name;
	}
	
	getColor(index) {
		return this.rgb_colors[index%this.rgb_colors.length]
	}
	
	backupMaps() {
		this._originalMap = JSON.parse(JSON.stringify(this.maps));
	}
	
	toUI() {
		var t = '<table>';
		for (var i=0; i<this.maps.length; i++) {
			var m = this.maps[i];
			t += '<tr>';
			
			t += '<td>';
			t += '<label class="checkbox-inline">';
			t += '<input type="checkbox" value="' + i + '" checked="checked" name="ifcMap" onclick="Index.selectMap()"></label>';
			t += '</td>';
			
			for (var j=0; j<m.length; j++) {
				t += '<td>';
				t += '<input type="text" onfocus="Index.setFocused(this);" value="' + m[j] 
					+ '" size="2" class="form-control mb-2 mr-sm-2" id="'
					+ this.getDataId(i, j) + '">';
				t += '</td>';						
			}		
			t += '<td><button onclick="IFS.deleteRow(' + i + ');" type="button" class="btn btn-outline-info">Delete</button></td>';
			t += '</tr>';		
			
			
		}
		t += '<tr>';
		t += '<td><button onclick="IFS.addRow();" type="button" class="btn btn-outline-info">Add</button></td>';
		t += '<td><button onclick="IFS.clear();" type="button" class="btn btn-outline-info">Clear</button></td>';		
		t += '<td><button onclick="Index.reset();" type="button" class="btn btn-outline-info">Reset</button></td>';		
		t += '<td><button onclick="Index.redraw();" type="button" class="btn btn-outline-info">Redraw</button></td>';		
		t += '</tr>';		
		
		t += '</table>';
		
		return t;
	}
	
	static deleteRow(index) {
		var fractal = Index.getCurrentFractal();
		var ifs = fractal.ifs;
		ifs.maps = Util.deleteElement(ifs.maps, index);
		fractal.showControlUI();
		fractal.redraw();
	}
	
	static addRow() {
	}
	static clear() {
	}
	
	getDataId(i, j) {
		return 'data_' + i + '_' + j;
	}
	updateMap() {
		for (var i=0; i<this.maps.length; i++) {
			var m = this.maps[i];
			for (var j=0; j<m.length; j++) {
				m[j] = Util.getFloat(this.getDataId(i, j));
			}
		}
	}
	
	printMap() {
		for (var i=0; i<this.maps.length; i++) {
			var m = this.maps[i];
			var t = '';
			for (var j=0; j<m.length; j++) {
				t += ' ' + m[j]
			}
			log(t)
		}		
	}
}

class RGB {
	r=0; g=0; b=0; a=1.0;
	constructor(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		if ( a != null ) {
			this.a = a;
		}
	}
	
	toString() {
		return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
	}
}
