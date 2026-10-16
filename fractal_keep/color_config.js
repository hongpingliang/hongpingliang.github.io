class ColorConfig {
	which;  // 1: rgb,  2: gradient, 3: image
	rgb;
	gradient;
	uploadedImage;

	constructor(which, rgb, imageCavasId) {
		this.which = which;
		this.rgb = rgb;
		this.uploadedImage = new UploadedImage(imageCavasId);
	}
	
	setUploadedImage(img, config) {
		this.which = ColorConfig.USE_IMAGE;
		this.uploadedImage.img = img;
		this.uploadedImage.resize(config.width, config.height);
	}
	
	
	setColor(which, rgb) {
		this.which = which;
		switch (this.which) {
			case ColorConfig.USE_RGB:
				this.rgb = rgb;
				break;
			case ColorConfig.USE_IMAGE:
				break;
			case ColorConfig.USE_GRADIENT:
				break;
			case ColorConfig.USE_RAMDOM:
				break;
		}
	}
	
	isRGB() {
		return this.which == ColorConfig.USE_RGB;
	}
	isImage() {
		return this.which == ColorConfig.USE_IMAGE;
	}
	isGradient() {
		return this.which == ColorConfig.USE_GRADIENT;
	}
	isRandom() {
		return this.which == ColorConfig.USE_RAMDOM;
	}
	
	getColor(x, y) {
		switch (this.which) {
			case ColorConfig.USE_RGB:
				return this.rgb;
			case ColorConfig.USE_IMAGE:
				return this.getImageColor(x, y);
			case ColorConfig.USE_GRADIENT:
				return this.getGradientColor(x, y);
			case ColorConfig.USE_RAMDOM:
				return this.getRandomColor(x);
		}
	}
	
	getImageColor(x, y) {
		return this.uploadedImage.getColor(x, y);
	}
	getGradientColor(x, y) {
		return this.rgb;
	}
	getRandomColor(x) {
		return this.rgb;
	}
}

ColorConfig.USE_RGB = 1;
ColorConfig.USE_IMAGE = 2;
ColorConfig.USE_GRADIENT = 3;
ColorConfig.USE_RAMDOM = 4;

class ColorPallet {
	colors;
	randomColors;
	rainbowColors;
	
	init() {
		this.colors = [new RGB(255, 0, 0, 1), new RGB(51, 255, 51, 1), new RGB(102, 102, 255, 1), new RGB(255, 255, 0, 1)];
		this.randomColors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`)
		this.initRainbowColors();
	}
	
	lagrange ([X1, Y1], [X2, Y2], x) {
		return (((Y1 * (x - X2)) / (X1 - X2)) + ((Y2 * (x - X1)) / (X2 - X1)));
	}

	makeRGB = (r, g, b, k) => {
	    if (isNaN(r)) r = this.calculate(r, k)
	    if (isNaN(g)) g = this.calculate(g, k)
	    if (isNaN(b)) b = this.calculate(b, k)
	    return new RGB(r, g, b, 1);
	}
	
	calculate(pair, k) {
		return parseInt(this.lagrange(pair[0], pair[1], k))
	}

	initRainbowColors(size = 250) {
		this.rainbowColors = [];
	    var range = parseInt(size / 6)
	    var c
	    for (var k=0; k<size; k++) {
	        if (k <= range)//red to yellow
	            c = this.makeRGB(255, [[0, 0], [range, 255]], 0, k)
	        else if (k <= range * 2)//yellow to green
	            c = this.makeRGB([[range + 1, 255], [range * 2, 0]], 255, 0, k)
	        else if (k <= range * 3)//green to cyan
	            c = this.makeRGB(0, 255, [[range * 2 + 1, 0], [range * 3, 255]], k)
	        else if (k <= range * 4)//cyan to blue
	            c = this.makeRGB(0, [[range * 3 + 1, 255], [range * 4, 0]], 255, k)
	        else if (k <= range * 5)//blue to purple
	            c = this.makeRGB([[range * 4 + 1, 0], [range * 5, 255]], 0, 255, k)
	        else//purple to red
	            c = this.makeRGB(255, 0, [[range * 5 + 1, 255], [size - 1, 0]], k)

	        this.rainbowColors.push(c)
	    }
	}
}

class UploadedImage {
	img
	canvasId
	canvas
	width;
	imageData;
	data;
	
	constructor(canvasId) {
		this.canvasId = canvasId;
		this.canvas = Util.get(canvasId);
		
	}
		
	resize(w, h) {
		if ( this.img == null ) {
			return;
		}
		var canvas = this.canvas;
		canvas.width = w;
		canvas.height = h;
		var img = this.img;
		var scaleX = canvas.width / img.width;
		var scaleY = canvas.height / img.height;
		var x = (canvas.width / 2) - (img.width / 2) * scaleX;
		var y = (canvas.height / 2) - (img.height / 2) * scaleY;
		canvas.getContext("2d").drawImage(img, x, y, img.width * scaleX, img.height * scaleY);
				
		Util.setValue('width', w);
		Util.setValue('height', h);
		this.width = canvas.width;
		this.imageData = canvas.getContext("2d").getImageData(0, 0,
				canvas.width, canvas.height);
		this.data = this.imageData.data;
	}
	
	getColor(x, y) {
		var rgb = new RGB();
		var start = (y*this.width+x)*4; 
		rgb.r = this.data[start];
		rgb.g = this.data[start + 1];
		rgb.b = this.data[start + 2];
		rgb.a = this.data[start + 3];
		return rgb;
	}
	
}
