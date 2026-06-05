var worker
var TASKS = []

class Mandelbrot extends Fractal {
	MAX_ITERATION = 20
	real0 = new Complex(-2, 2); 
	imaginary0 = new Complex(-2, 2);
	
	constructor(config) {
		super(config);
	}
	
	init() {
		super.init();
		this.config.canvas.addEventListener('click', (e) => {this.onDblClick(e);});
	}
	
	onDblClick(e) {
	    var canvas = this.config.canvas;
	    var x = e.pageX - canvas.offsetLeft;
	    var y = e.pageY - canvas.offsetTop;
	    
	    this.doZoom(x, y, 1);
	    this.draw();
	}
	
	doZoom(x, y, sign) {
	    var width = this.config.width;
		var height = this.config.height;
	    var zfw = (width * this.config.zoomStep) * sign;
	    var zfh = (height * this.config.zoomStep) * sign;
		log(x + ' ' + y + ' ' + zfw + ' ' + zfh)
		this.real0 =  new Complex(
	        this.getRelativePoint(x - zfw, width, this.real0),
	        this.getRelativePoint(x + zfw, width, this.real0) );
	    this.imaginary0 =  new Complex(
	        this.getRelativePoint(y - zfh, height, this.imaginary0),
	        this.getRelativePoint(y + zfh, height, this.imaginary0) );
	    
	}
	
	getRelativePoint(pixel, length, set) {
	   return set.x + (pixel / length) * (set.y - set.x);
	}
	
	setGraphColor() {
		this.draw();
	}
	
	setBgColor(rgb) {
		this.draw();
	}
	
	redraw() {
		this.draw();	
	}
	
	getControlUI() {
		var t = '<table>';
		t += '<tr>';
		t += '<td>Zoom: <button onclick="Index.zoomIn();" type="button" class="btn btn-outline-info">+</button></td>';
		t += '<td><button onclick="Index.zoomOut();" type="button" class="btn btn-outline-info">-</button></td>';
		t += '<td><button onclick="Index.setRandomColor();" type="button" class="btn btn-outline-info">Random Color</button></td>';
		t += '</tr>';			
		
		t += '</table>';
		return t;
	}
	
	zoomIn() {
		this.zoom += this.config.zoomStep;
	    var x = this.config.width/2;
	    var y = this.config.height/2;
	    
	    this.doZoom(x, y, 1);
		this.draw();
	}
	zoomOut() {
		this.zoom -= this.config.zoomStep;
	    var x = this.config.width/2;
	    var y = this.config.height/2;	    
	    this.doZoom(x, y, -1);
		this.draw();
	}
	setRandomColor() {
		this.config.isRandomColor = !this.config.isRandomColor;
		this.draw();
	}
	
	draw() {
		this.clear();
		this.plot();
	}	
	
	mandelbrot(c) {
	    var z = new Complex(0, 0);
	    var n = 0;
	    var p, d;
	    do {
	    	p = new Complex(Math.pow(z.x, 2) - Math.pow(z.y, 2), 2 * z.x * z.y);
	        z = new Complex(p.x + c.x, p.y + c.y);
	        d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2));
	        n += 1
	    } while (d <= 2 && n < this.MAX_ITERATION)
	    return [n, d <= 2];
	}	

	plot() {
		var colors;
		if ( this.config.isRandomColor ) {
			colors = FractalFactory.getColorPallet().randomColors;
		} else {
			colors = FractalFactory.getColorPallet().rainbowColors;			
		}
		
		var width = this.config.width;
		var height = this.config.height;
		var real0 = this.real0;
		var imaginary0 = this.imaginary0;	
	    for (let i = 0; i < width; i++) {
	        for (let j = 0; j < height; j++) {
	            var complex = new Complex(
	            	real0.x + (i/width) * (real0.y - real0.x),
	                imaginary0.x + (j/height) * (imaginary0.y - imaginary0.x)
	            );

	            var [m, isMandelbrotSet] = this.mandelbrot(complex)
	            if ( this.config.isColor ) {
		            if ( isMandelbrotSet ) {
		            	var c = this.config.foregroundConfig.getColor(i, j);
		            	this.fillOnePixelByColor(i, j, c)
		            } else {
		            	var c = colors[m % (colors.length - 1)];
		            	this.fillOnePixelByColor(i, j, c);
		            }
	            } else {
	            	var c;
	            	if ( isMandelbrotSet ) {
	            		c = this.config.foregroundConfig.getColor();
	            	} else {
	            		c = this.config.backgroundConfig.getColor();
	            	}
	            	this.fillOnePixelByColor(i, j, c);
	            }
	        }
	    }
	}	
}

class Complex {
	x=0;
	y=0;
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
