var _config;
var _fractalIFS;
var _fractalChaosGame;
var _fractalDNA;
var _fractalMandelbrot;
var _colorPallet;
var _animation;

class FractalFactory {

	static getConfig() {
		if ( _config ) {
			return _config;
		}

		_config = new Config('fractal_canvas', 'control_ui', true);
		_config.init();
		return _config;
	}	

	static getIFS() {
		if ( _fractalIFS ) {
			return _fractalIFS;
		}
		_fractalIFS = new IFSFractal(FractalFactory.getConfig());
		_fractalIFS.ifs = _fractalIFS.getIFS(64);
		_fractalIFS.ifs.backupMaps();
		_fractalIFS.init();
		return _fractalIFS;
	}	

	static getChaosGame() {
		if ( _fractalChaosGame ) {
			return _fractalChaosGame;
		}

		_fractalChaosGame = new ChaosGame(FractalFactory.getConfig());
		_fractalChaosGame.init();
		_fractalChaosGame.setNumOfVertices(41);
		return _fractalChaosGame;
	}	

	static getDNA() {
		if ( _fractalDNA ) {
			return _fractalDNA;
		}

		_fractalDNA = new DNA(FractalFactory.getConfig());
		_fractalDNA.init();
		return _fractalDNA;
	}	

	static getMandelbrot() {
		if ( _fractalMandelbrot ) {
			return _fractalMandelbrot;
		}

		_fractalMandelbrot = new Mandelbrot(FractalFactory.getConfig());
		_fractalMandelbrot.init();
		return _fractalMandelbrot;
	}
	
	static getColorPallet() {
		if ( _colorPallet ) {
			return _colorPallet;
		}

		_colorPallet = new ColorPallet();
		_colorPallet.init();
		return _colorPallet;
	}	
	
	static getAnimation() {
		if ( _animation ) {
			return _animation;
		}

		_animation = new Animation();
		return _animation;
	}		
}

class Animation {
	handler;
	cnt = 0;
	
	isRunning() {
		if ( this.handler ) {
			return true;
		}
		return false;
	}
	
	stop() {
		log('stop');
		clearTimeout(this.handler);
		this.handler = null;
	}
	
	start() {
		log('start');
		this.run();
	}
	
	run() {
		this.cnt++;
		var time = 50;
		if ( this.cnt < 11 ) {
			log('add 1');
			Index.updateIFSValue(1);
		} else if ( this.cnt < 20  ) {
			log('minus 1');
			Index.updateIFSValue(-1);
		} else {
			var time = 1000;
			log('reset');			
			this.cnt = 0;
			Index.reset();
		}
		this.handler = setTimeout( () => { this.run(); }, time);
	}
	
}