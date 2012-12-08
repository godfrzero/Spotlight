/* Javascript Document */
/* Created by redAtom Studios @ 2012 */

// Okay, now starting with the actual EagleEye Object...
function EagleEye(targetClass, loggingFlag) {
	if(targetClass) {
		this.targetClass = '.' + targetClass;
	} else {
		this.targetClass = '.eagleEye';
	}


	this.origin_x = 100;
	this.origin_y = 100;

	// Maximum shadow size in x or y direction
	this.maxOffset = 20;

	this.enableLogging = loggingFlag;

	this.log('Logging enabled');
	this.log(this.origin_x);

	// Get a reference to this object, so as to not
	// have issues with using 'this' in jQuery
	var self = this;
}

EagleEye.prototype.log = function(message) {
	if(this.enableLogging) {
		// Check if console is available. If not, alert the user and disable 
		// logging to prevent a dialog storm due to future calls
		if(console) {
			var alertString = '[EagleEye' + this.targetClass + '] '
			console.log(alertString + message + ';');
		} else {
				alert('Console is unavailable. Autodisabling logging functionality to prevent additional dialogs.');
				this.enableLogging = false;
		}
	}
}

EagleEye.prototype.renderCycle = function(selector) {
	// Used to calculate shadow size along with camera origin
	this.screenHeight = $(document).height();
	this.screenWidth = $(document).width();

	// Origin of the camera, shadow size is proportional to this
	this.origin_z = 50;

	//this.log(this.origin_x);

	var self = this;
	$(selector).each(function(){
		var thisLeft = $(this).offset().left;
		var thisTop = $(this).offset().top;

		var leftShadowOffset = function() {	
			var offset = -(self.origin_x - thisLeft) / self.origin_z;
			if(self.maxOffset > Math.abs(offset)) {
				return offset;
			} else {
				return ( offset > 0 ? self.maxOffset : -self.maxOffset );
			}
		};

		var bottomShadowOffset = function() {
			var offset = -(self.origin_y - thisTop) / self.origin_z;
			if(self.maxOffset > Math.abs(offset)) {
				return offset;
			} else {
				return ( offset > 0 ? self.maxOffset : -self.maxOffset );
			}
		};

		var shadowSpread = function() {
			var offset = Math.sqrt(Math.pow(self.origin_y - thisTop, 2) + Math.pow(self.origin_x - thisLeft, 2)) / 10;
			if(self.maxOffset > offset) {
				return offset;
			} else {
				return self.maxOffset;
			}
		}

		var shadowIntensity = function() {
			var offset = Math.sqrt(Math.pow(self.origin_y - thisTop, 2) + Math.pow(self.origin_x - thisLeft, 2));
			var shadowFalloff = 200;
			return (1 - (offset / shadowFalloff)) * 1;
		}

		if(Math.sqrt(Math.pow(self.origin_y - thisTop, 2) + Math.pow(self.origin_x - thisLeft, 2)) < 300) {
			var styleString = leftShadowOffset() + 'px ' + bottomShadowOffset() + 'px ' + shadowSpread() + 'px rgba(255, 255, 255, ' + shadowIntensity() + ')'
			$(this).css('box-shadow', styleString);
		} else {
			$(this).css('box-shadow', 'none');
		}
	});
}

EagleEye.prototype.startRender = function(timeout, objName) {
	this.renderCycle(this.targetClass);
	this.rendering = setInterval('' + objName + '.renderCycle(' + objName + '.targetClass)', timeout);
}

EagleEye.prototype.stopRenderer = function() {
	clearInterval(this.rendering);
}

jQuery(document).ready(function($){
	Eagle = new EagleEye('building', false);
	Eagle.startRender(100, 'Eagle');
	//Eagle.stopRenderer();

	$(document).mousemove(function(e){
		Eagle.origin_x = e.pageX;
		Eagle.origin_y = e.pageY;
	});
});