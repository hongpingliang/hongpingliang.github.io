class IFSFractal extends Fractal {
	matrixs;
	ifs;
	selectedMaps;
	ifcCache = {};
	
	getIFS(index) {
		if ( this.ifcCache[index] ) {
			return this.ifcCache[index];
		}
		var data = _ifs_list[index];
		this.ifcCache[index] = new IFS(data.name, data.maps);
		return this.ifcCache[index];
	}

	
	constructor(config) {
		super(config);
	}
			
	getControlUI() {
		return this.ifs.toUI();
	}
	
	setGraphColor() {
		this.repaint();
	}
	
	setBgColor(rgb) {
		this.repaint();
	}
	
	redraw() {
		this.ifs.updateMap();	
		this.draw();	
	}
		
	reset() {
		var ifs = this.ifs;
		ifs.maps = ifs._originalMap;
		ifs.probs = ifs._originalProbs;
		this.showControlUI();
		this.redraw();
	}
	
	draw() {
		this.clear();
		this.iterate(1000000);
		this.repaint();
	}
	
	iterate(numOfIteration) {
		var width = this.config.width;
		var height = this.config.height;
		var maps = this.ifs.maps;
		this.matrixs = [];
		for (var k=0; k<maps.length; k++) {
			var m = new Matrix(width, height)
			m.init();
			this.matrixs.push(m)
		}

		var x = 0, y = 0;

		var ks = new Array(numOfIteration);
		var xs = new Array(numOfIteration);
		var ys = new Array(numOfIteration);
		var xMin = Number.MAX_VALUE, xMax = Number.MIN_VALUE;
		var yMin = Number.MAX_VALUE, yMax = Number.MIN_VALUE;
		
		for (var i=0 ; i<numOfIteration; i++) {
			var k = this.ifs.getWhichMap();
			var newx = maps[k][0]*x + maps[k][1]*y + maps[k][4];
			var newy = maps[k][2]*x + maps[k][3]*y + maps[k][5];
			x = newx;
			y = newy;
			
			ks[i] = k;
			xs[i] = newx;
			ys[i] = newy;
			xMin = Math.min(xMin, newx);
			xMax = Math.max(xMax, newx);
			yMin = Math.min(yMin, newy);
			yMax = Math.max(yMax, newy);
		}
		
		for (var i=0 ; i<numOfIteration; i++) {
			var k = ks[i];
			x = xs[i];
			y = ys[i];
			
			var col = Math.floor((x-xMin)/(xMax-xMin) * width);
			var row = Math.floor((y-yMin)/(yMax-yMin) * height);
			if ( col < 0 || col >= width || row < 0 || row >= height ) {
				continue;
			}
			row = height - row - 1;
			this.matrixs[k].addOne(col, row);
		}
	} 
	
	repaint() {
		var colors = FractalFactory.getColorPallet().colors;
		for(var k=0; k<this.matrixs.length; k++) {
			var rgb;
			if ( this.config.isSingleColor ) {
				rgb = this.config.foregroundConfig.rgb;
			} else {
				rgb = colors[k%colors.length];				
			}
			if ( this.isInSelectedMap(k) ) {
				this.plotMatrix(this.matrixs[k], rgb);
			}
    	}			
	}	
	
	isInSelectedMap(index) {
		if ( !this.selectedMaps ) {
			return true;
		}
		for (var i=0; i<this.selectedMaps.length; i++) {
			if ( this.selectedMaps[i] == index ) {
				return true;
			}
		}
		return false;
	}
	
	plot() {
		var width = this.config.width;
		var height = this.config.height;
		var maps = this.ifs.maps;
		for(var i=0; i<width; i++) {
		    for(var j=0; j<height; j++) {
		    	var rgb = new RGB(0, 0, 0, 255);
		    	var total = 0;
		    	for(var k=0; k<this.matrixs.length; k++) {
		    		var hit = this.matrixs[k].get(i, j);
		        	total += hit;
		    	}
		    	if ( total == 0 ) {
		    		continue;
			    }
			    for(var k=0; k<this.matrixs.length; k++) {
		        	var hit = this.matrixs[k].get(i, j);
		        	total += hit;
		        	if ( hit == 0) {
		        		continue;
		        	}
		        	
		        	var max = Math.log(this.matrixs[k].max)/255
		        	
		        	var gray = this.toGray(max, hit);
//		        	var gray = 255 - (hit/this.maxHits[q]*255);
//		        	log(c + ' ' + gray)
		        	if ( this.config.isColor ) {
		            	var colorIndex = k % this.rgb_colors.length;
		            	rgb.r += Math.round(gray*this.rgb_colors[colorIndex][0]);
		            	rgb.g += Math.round(gray*this.rgb_colors[colorIndex][1]);
		            	rgb.b += Math.round(gray*this.rgb_colors[colorIndex][2]);        		
		        	} else {
		        		var grayI = Math.round(gray);
		        		rgb.r += grayI;
		        		rgb.g += grayI;
		        		rgb.b += grayI;        		        		
		        	}
		        }
		        this.fillOnePixelByColor(i, j, rgb);
		    }
		}
	}	
	
	grayscale = function(rgb) {
		var avg = (rgb.r + rgb.g + rgb.b) / 3;
		return new RGB(avg, avg, avg);
//		Gray = 0.21R + 0.72G + 0.07B // Luminosity
//		Gray = (R + G + B) ÷ 3 // Average Brightness
//		Gray = 0.299R + 0.587G + 0.114B // rec601 standard
//		Gray = 0.2126R + 0.7152G + 0.0722B // ITU-R BT.709 standard
//		Gray = 0.2627R + 0.6780G + 0.0593B // ITU-R BT.2100 standard
	}

    updateMaxHit(spot) {
		for (var i=0; i<this.ifs.maps.length; i++) {
			if ( this.maxHits[i] <this.hits[i][spot] ) {
				this.maxHits[i] = this.hits[i][spot];
			}
		}
    }
            
    drawFilledCircle (centerX, centerY, radius, color) {
    	this.ctx.beginPath();
    	this.ctx.fillStyle = color;
    	this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    	this.ctx.fill();
    }

	toGrayWhite(cc, hit) {
		var gray;
		if ( hit > 155 ) 
			gray = hit;
		else
			gray = Math.log(hit)/cc;
		gray += (Math.exp(cc*gray) + (gray-1)*(1-cc) - hit)/(Math.exp(cc*gray)*cc + 1 - cc);
		return gray;
	}	
}

//x = r cos(theta) x + s sin(phi) y + h
//y = -r sin(theta) x + s cos(phi) y + k
