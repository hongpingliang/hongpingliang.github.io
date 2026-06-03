class Util {
	static toFloat(value) {
		try {
			return parseFloat(value);
		} catch(err) {
		}
		return 0;		
	}

	static toInt(value) {
		try {
			return parseInt(value);
		} catch(err) {
		}
		return 0;
	}

	static get(id) {
		return document.getElementById(id);
	}
	
	static getInt(id) {
		return Util.toInt(Util.get(id).value);
	}

	static getFloat(id) {
		return Util.toFloat(Util.get(id).value);
	}

	static setValue(id, value) {
		Util.get(id).value = value;
	}
	
	static deleteElement(array, index) {
		var ret = [];
		var cnt = 0;
		for (var i=0; i<array.length; i++) {
			if ( i != index ) {
				ret[cnt] = array[i];
				cnt++;
			}
		}
		return ret;
	}
	
	static toFix(num) {
		return num.toFixed(2);
	}
}