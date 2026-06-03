class Fractal {
	config;
	ctx;
	worker;
	
	constructor(config) {
		this.config = config;
	}
	
	init() {
		this.ctx = this.config.canvas.getContext('2d');
	}
	
	resize(w, h) {
		this.config.canvas.width = w;
		this.config.canvas.height = h;
		this.ctx = this.config.canvas.getContext('2d');
		this.config.width = w;
		this.config.height = h;	
		this.config.foregroundConfig.uploadedImage.resize(w, h);
		this.config.backgroundConfig.uploadedImage.resize(w, h);
	}
			
	showControlUI() {
		$('#' + this.config.controlDivId).html(this.getControlUI()); 
		
		var t = '';
		for (var i=0; i<_ifs_list.length; i++) {
			var ifs = _ifs_list[i];
			t += '<button onclick="Index.setIFSData(' + i + ');" type="button" class="btn btn-outline-info">';
			t += ifs.name + '</button>';
			if (i % 8 == 7)
				t += '<br/>'
		}
		
		$('#ifs_list').html(t);
	}
	
	clear() {
		if ( this.config.backgroundConfig.which == ColorConfig.USE_IMAGE ) {
			var imageData = this.config.backgroundConfig.uploadedImage.imageData;
			this.ctx.putImageData(imageData, 0, 0);
		} else {
			this.ctx.fillStyle = this.config.backgroundConfig.getColor().toString();
			this.ctx.fillRect(0,0,this.config.width, this.config.height);	
		}
	}
	
	invert(rgb) {
		return new RGB(255-rgb.r, 255-rgb.g, 255-rgb.b);
	}
	
	toGray(cc, hit) {
		var gray;
		if ( hit < 100 ) 
			gray = hit;
		else
			gray = Math.log(hit)/cc;
		gray -= (Math.exp(cc*gray) + (gray-1)*(1-cc) - hit)/(Math.exp(cc*gray)*cc + 1 - cc);
		return gray;
	}
	
	plotMatrix(matrix, rgb) {
		var width = this.config.width;
		var height = this.config.height;
		if ( this.config.foregroundConfig.isImage() ) {
			this.plotMatrixImage(matrix, width, height);
		} else {
			if ( this.config.isSingleColor ) {
				this.plotMatrixRGB(matrix, width, height, rgb);				
			} else {
				this.plotMatrixRGBScale(matrix, width, height, rgb);				
			}
		}				
	}
	
	plotMatrixRGB(matrix, width, height, rgb) {
		var maxs = 255/matrix.max;
		for(var i=0; i<width; i++) {
		    for(var j=0; j<height; j++) {
		        var hit = matrix.get(i, j);
		        if ( hit == 0) {
		        	continue;
		        }
				this.fillOnePixelByColor(i, j, rgb);
		    }
		}
	}
	
	plotMatrixRGBScale(matrix, width, height, rgb) {
		var max = Math.log(matrix.max)/255
		
		var rRatio = rgb.r/255;
		var gRatio = rgb.g/255;
		var bRatio = rgb.b/255;
		for(var i=0; i<width; i++) {
		    for(var j=0; j<height; j++) {
		        var hit = matrix.get(i, j);
		        if ( hit == 0) {
		        	continue;
		        }
		        var gray = this.toGray(max, hit);
		        var newRgb = new RGB(Math.round(hit * rRatio), 
		        		Math.round(hit * gRatio), 
		        		Math.round(hit * bRatio), 1);
				this.fillOnePixelByColor(i, j, newRgb);
		    }
		}
	}
	
	plotMatrixImage(matrix, width, height) {
		var colorConfig = this.config.foregroundConfig;
		for(var i=0; i<width; i++) {
		    for(var j=0; j<height; j++) {
		    	var hit = matrix.get(i, j);
		        if ( hit == 0) {
		        	continue;
		        }
		        this.fillOnePixelByColor(i, j, colorConfig.getImageColor(i,j))
		    }
		}
	}
		
	fillOnePixelByColor(x, y, rgb) {
        this.ctx.fillStyle = rgb.toString();
		this.ctx.fillRect(x, y, 1, 1);		
	}
	
	rgb_colors = [
	      [ 1.0, 0.0, 0.0, 1.0],
	      [ 0.2, 1.0, 0.2, 1.0],
	      [ 0.4, 0.4, 1.0, 1.0],
			[ 1.0, 1.0, 0.0, 1.0],
		    [ 1.0, 0.0, 1.0, 1.0],
	      [ 0.0, 1.0, 1.0, 1.0],
	   [ 1.0, 0.5, 0.0, 1.0],[ 0.6, 0.6, 0.6, 1.0],[ 0.3, 0.3, 0.3, 1.0],
	   [ 0.3, 0.8, 1.0, 1.0],[ 0.5, 1.0, 0.5, 1.0],[ 0.5, 1.0, 1.0, 1.0],
	   [ 1.0, 0.5, 0.5, 1.0],[ 1.0, 0.5, 1.0, 1.0],
	   [ 1.0, 1.0, 1.0, 1.0]];	
	
}
