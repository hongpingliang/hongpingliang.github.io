class DNA extends ChaosGame {
	sequence;
	matrix;
	constructor(config) {
		super(config);
	}
	
	init() {
		super.init();
		this.sequence = data;
		this.initVertices();
	}
		
	initVertices() {
		this.vertices = [];
		this.vertices.push(new Point(0, 0));
		this.vertices.push(new Point(0, this.config.height));
		this.vertices.push(new Point(this.config.width, this.config.height));
		this.vertices.push(new Point(this.config.width, 0));
	}
	
	setGraphColor() {
		this.plotMatrix(this.matrix, this.config.foregroundConfig.rgb);
	}
	
	setBgColor(rgb) {
		this.plotMatrix(this.matrix, this.config.foregroundConfig.rgb);
	}
	
	redraw() {
		this.initVertices();
		this.sequence = document.getElementById("dna").value;
		this.draw();	
	}
	
	draw() {
		this.clear();
		if ( !this.sequence || this.sequence.length < 1) {
			return;
		}
		this.iterate();
		this.plotMatrix(this.matrix, this.config.foregroundConfig.rgb);
		this.drawLabel();
	}	
	
	iterate() {
		var width = this.config.width;
		var height = this.config.height;
		
		this.matrix = new Matrix(width, height);
		this.matrix.init();
		
		this.sequence = this.sequence.toUpperCase();
		var point = new Point(this.config.width/2, this.config.height/2);
		for (var i=0; i<this.sequence.length; i++) {
			var index = this.toVerticeIndex(this.sequence[i]);
			if ( index < 0 ) {
				continue;
			}
			point = point.midpointTo(this.vertices[index]);
			if ( point.x < width && point.y < height ) {
				this.matrix.addOne(point.x, point.y);
			}
		}
	}
	
	getControlUI() {
		var t = '<table>';
		t += '<tr>';
		t += '<td><input id="dna" value="' + this.sequence + '" type="text" size="30" class="form-control mb-2 mr-sm-2" placeholder="DNA fasta file URL"></td>';
		t += '</tr>';			
		t += '</table>';
		
		return t;
	}
	
	load(url) {
		$.get(url, function(data) {
			this.processData(data);
		});
	}
	
	processData(data) {
		alert(data)
	}
	
	toVerticeIndex(n) {
		switch(n) {
		case 'C':
			return 0;
		case 'G':
			return 1;
		case 'T':
			return 2;
		case 'A':
			return 3;
		default:
			return -1;
		}
	}
	
	drawLabel() {
		this.ctx.fillStyle = '#0000FF'
		this.ctx.font = '30px Arial';
		this.drawText('C', 5, 25);
		this.drawText('G', this.config.width-30, 25);
		this.drawText('A', this.config.width-30, this.config.height-10);
		this.drawText('T', 5, this.config.height-10);
	}
	
	drawText(t, x, y) {
		this.ctx.fillText(t, x, y);		
	}
}