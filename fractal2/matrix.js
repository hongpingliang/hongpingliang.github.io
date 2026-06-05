class Matrix {	
	data;
	max = 0;
	constructor(numOfRow, numOfCol) {
		this.numOfRow = numOfRow;
		this.numOfCol = numOfCol;
	}
	
	init() {
		this.data = [];
		for(var i=0; i<this.numOfRow; i++) {
			this.data[i] = [];
		    for(var j=0; j<this.numOfCol; j++) {
		    	this.data[i][j] = 0;
		    }
		}
	}

	addOne(row, col) {
		var value = this.get(row, col) + 1;
		this.set(row, col,value);
		if ( value > this.max ) {
			this.max = value;
		}
	}

	get(row, col) {
		return this.data[row][col];
	}
	
	set(row, col, value) {
		this.data[row][col] = value;
	}
	
	print() {
		var t = '';
		for(var i=0; i<this.numOfRow; i++) {
		    for(var j=0; j<this.numOfCol; j++) {
			    t += this.data[i][j] + ',';			    	
		    }
		    t += '\n';
		}
		log(t);
	}
}
