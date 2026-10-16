var _fractal;
class Index {
	static getCurrentFractal() {
		return _fractal;
	}
	static setCurrentFractal(fractal) {
		_fractal = fractal;
		_fractal.showControlUI();
	}	
	
	static init() {		
		var fractal = FractalFactory.getIFS();
//		var fractal = FractalFactory.getMandelbrot();
//		var fractal = FractalFactory.getDNA();
//		var fractal = FractalFactory.getChaosGame();
		Index.setCurrentFractal(fractal);
		fractal.draw();
	}	
	
	static setIFS(ifs) {
		Index.setCurrentFractal(FractalFactory.getIFS())
		var fractal = Index.getCurrentFractal();
		fractal.ifs = ifs;
		fractal.ifs.backupMaps();
		fractal.showControlUI();
		fractal.draw();
	}	
	
	static setIFSData(index) {
		Index.setCurrentFractal(FractalFactory.getIFS())
		var fractal = Index.getCurrentFractal();
		fractal.ifs = fractal.getIFS(index);
		fractal.ifs.backupMaps();
		fractal.showControlUI();
		fractal.draw();
	}
	
	static setGraphColor(which, rgb) {
//		var fractal = Index.getCurrentFractal();
//		fractal.config.isColor = !fractal.config.isColor;
//		fractal.clear();
//		fractal.changeColor();
		var fractal = Index.getCurrentFractal();
		fractal.config.foregroundConfig.setColor(which, rgb);
		fractal.config.isSingleColor = true;
		fractal.clear();
		fractal.setGraphColor(rgb);
	}
	
	static setBgColor(which, rgb) {
		var fractal = Index.getCurrentFractal();
		fractal.config.backgroundConfig.setColor(which, rgb);
		fractal.clear();
		fractal.setBgColor(rgb);
	}

	static resize() {
		var w = Util.getInt('width');
		var h = Util.getInt('height');
		var fractal = Index.getCurrentFractal();
		if ( w != fractal.config.canvas.width || h != fractal.config.canvas.height ) {			
			fractal.resize(w, h);
		}
		fractal.redraw();
	}
	
	static redraw() {
		var fractal = Index.getCurrentFractal();
		fractal.redraw();
	}

	
	static reset() {
		var fractal = Index.getCurrentFractal();
		fractal.reset();
	}
	
	static setSingleColor() {
		var fractal = Index.getCurrentFractal();
		fractal.config.isSingleColor = !fractal.config.isSingleColor;
		fractal.repaint();
	}
	
	static drawDNA() {
		var dna = FractalFactory.getDNA();
		Index.setCurrentFractal(dna)
		dna.draw();
	}
		
	static setNumOfVertices(numOfVertices) {
		var chaosGame = FractalFactory.getChaosGame();
		Index.setCurrentFractal(chaosGame)
		chaosGame.numOfVertices = numOfVertices;
		chaosGame.draw();
	}
	
	static drawMandelbrot() {
		var m = FractalFactory.getMandelbrot();
		Index.setCurrentFractal(m)
		m.draw();
	}
	
	static zoomIn() {
		var fractal = Index.getCurrentFractal();
		fractal.zoomIn();
	}
	
	static setRandomColor() {
		var fractal = Index.getCurrentFractal();
		fractal.setRandomColor();
	}
	
	static zoomOut() {
		var fractal = Index.getCurrentFractal();
		fractal.zoomOut();
	}
	
	static selectMap() {
		var selectedMaps = [];
		var cks =  document.getElementsByName("ifcMap");
		for(var i=0; i<cks.length; i++) {
		    if ( cks[i].checked ) {
		    	selectedMaps.push(cks[i].value*1);
		    }
		}
		var fractal = Index.getCurrentFractal();
		fractal.selectedMaps = selectedMaps;
		fractal.clear();
		fractal.repaint();
	}
	
	static setFocused(input) {
		var fractal = Index.getCurrentFractal();
		fractal.focusedInputId = input.id;
	}
	
	static updateIFSValue(sign) {
		var fractal = Index.getCurrentFractal();
		if ( !fractal.focusedInputId ) {
			return;
		} 
		var input = document.getElementById(fractal.focusedInputId);
		input.value = (input.value * 1) + 0.1 * sign;
		fractal.redraw();
	}
	
	static animateIFS() {
		var animation = FractalFactory.getAnimation();
		if ( animation.isRunning() ) {
			animation.stop();
		} else {
			animation.start();
		}
	}
	
	static loadImage(e, cavaseId) {
		var src = e.target.files[0];
		var img = new Image();
		img.onload = function(){ Index.onLoadImageReady(img, cavaseId); };
		img.crossOrigin="anonymous";
		img.src = URL.createObjectURL(src);
	};
	
	static onLoadImageReady(img, cavaseId) {
		var fractal = Index.getCurrentFractal();
		if ( cavaseId == fractal.config.foregroundConfig.uploadedImage.canvasId ) {
			fractal.config.foregroundConfig.setUploadedImage(img, fractal.config);
		} else if ( cavaseId == fractal.config.backgroundConfig.uploadedImage.canvasId ) {
			fractal.config.backgroundConfig.setUploadedImage(img, fractal.config);
		} 
		fractal.draw();
	}
}


function log(s) {
	console.log(s)
}


