class ChaosGame extends Fractal {
	vertices;
	numOfVertices
	
	constructor(config) {
		super(config);
	}
	
	init() {
		super.init();
		this.vertices = new Array(); 
		this.config.canvas.addEventListener('click', (e) => {this.onClick(e);});
	}
	
	setBgColor(rgb) {
		this.draw();
	}
	setGraphColor() {
		this.plotMatrix(this.matrix, this.config.foregroundConfig.rgb);
	}
		
	setNumOfVertices(numOfVertices) {
		var v = [];
		var w = this.config.width;
		var h = this.config.height;
		
		switch(numOfVertices) {
		case 3:
			v.push(new Point(0, 0));
			v.push(new Point(w/2, h));
			v.push(new Point(w, 0));			
			break;
		case 4:
			v.push(new Point(0, 0));
			v.push(new Point(0, h));
			v.push(new Point(w, h));
			v.push(new Point(w, 0));			
			break;
		case 41:
			v.push(new Point(0, h/2));
			v.push(new Point(w/2, h));
			v.push(new Point(w, h/2));
			v.push(new Point(w/2, 0));			
			break;
		default:
			v = this.calculateVertice(numOfVertices, w, h);
			break;
		}
		this.numOfVertices = numOfVertices;
		this.vertices = v;
	}
	
	calculateVertice(numOfVertices, w, h) {
		var r = Math.min(w, h)/2;
		var x0 = w / 2;
		var y0 = h / 2;
		var v = [];
		for (var i=0; i<numOfVertices; i++) {
			var theta = (2 * i * Math.PI) / numOfVertices;
			var x = r * Math.cos(theta) + x0;
			var y = r * Math.sin(theta) + y0;
			v.push(new Point(x, y));
		}
		return v;
	}
	
	redraw() {
		this.draw();	
	}
	
	getControlUI() {
		var t = '';
		return t;
	}
	
	onClick(e) {
		var x = e.clientX;
		var y = e.clientY;
		this.vertices.push(new Point(x, y));
		this.ctx.clearRect(0, 0, this.config.width, this.config.height);
		this.draw();
	}
	
	draw() {
		this.clear();
		this.setNumOfVertices(this.numOfVertices);
		if ( this.vertices.length < 2 ) {
			return;
		}
		this.iterate();
		this.plotMatrix(this.matrix, this.config.foregroundConfig.rgb);
	}	
	
	iterate() {
		var width = this.config.width;
		var height = this.config.height;
		
		this.matrix = new Matrix(width, height);
		this.matrix.init();
		
		var point = this.pickVertex();
		for (var i=0; i<1000000; i++) {
			point = point.midpointTo(this.pickVertex());
			if ( point.x < width && point.y < height ) {
				this.matrix.addOne(point.x, point.y);
			}			
		}	
	}
		
	pickVertex() {
		return this.vertices[Math.floor(Math.random() * (this.vertices.length))];
	}
}



class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
    }
	
	midpointTo(a) {
		return new Point(Math.round((a.x + this.x) / 2),
				Math.round((a.y + this.y) / 2));
	}
}