class Config {
	canvasId;
	canvas;
	controlDivId;
	isSingleColor = false;
	isColor = true;
	isRandomColor = true;
	foregroundConfig;
	backgroundConfig;
	width;
	height;
	
	zoomStep = 0.3;
	constructor(canvasId, controlDivId, isColor) {
		this.canvasId = canvasId;
		this.controlDivId = controlDivId;
		this.isColor = isColor;
		var colors = FractalFactory.getColorPallet().colors;
		this.foregroundConfig = new ColorConfig(ColorConfig.USE_RGB, 
				colors[0], 'foregroundImage');
		this.backgroundConfig = new ColorConfig(ColorConfig.USE_RGB, 
				new RGB(255, 255, 255, 1.0), 'backgroundImage');
	}
		
	init() {
		this.canvas = Util.get(this.canvasId);
	    this.width = this.canvas.width;
		this.height = this.canvas.height;
	}
}

