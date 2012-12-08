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
	this.maxOffset = 30;

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

EagleEye.prototype.leftShadowOffset = function(thisLeft) {
	var offset = -(this.origin_x - thisLeft) / this.origin_z;
	if(this.maxOffset > Math.abs(offset)) {
		return offset;
	} else {
		return ( offset > 0 ? this.maxOffset : -this.maxOffset );
	}
}

EagleEye.prototype.bottomShadowOffset = function(thisTop) {
	var offset = -(this.origin_y - thisTop) / this.origin_z;
	if(this.maxOffset > Math.abs(offset)) {
		return offset;
	} else {
		return ( offset > 0 ? this.maxOffset : -this.maxOffset );
	}
}

EagleEye.prototype.shadowIntensity = function(thisTop, thisLeft) {
	var offset = Math.sqrt((this.origin_y - thisTop)*(this.origin_y - thisTop) + (this.origin_x - thisLeft)*(this.origin_x - thisLeft));
	var shadowFalloff = 500;
	return (1 - (offset / shadowFalloff)) * 0.3;
}

EagleEye.prototype.shadowSpread = function(thisTop, thisLeft) {
	var offset = Math.sqrt((this.origin_y - thisTop)*(this.origin_y - thisTop) + (this.origin_x - thisLeft)*(this.origin_x - thisLeft)) / 10;
	if(this.maxOffset > offset) {
		return offset + 1;
	} else {
		return this.maxOffset;
	}
}

EagleEye.prototype.renderCycle = function(selector) {
	// Used to calculate shadow size along with camera origin
	this.screenHeight = $(document).height();
	this.screenWidth = $(document).width();

	// Origin of the camera, shadow size is proportional to this
	this.origin_z = 100;

	//this.log(this.origin_x);

	var self = this;
	$(selector).each(function(){
		var thisLeft = $(this).offset().left;
		var thisTop = $(this).offset().top;

		if(Math.sqrt((self.origin_y - thisTop)*(self.origin_y - thisTop) + (self.origin_x - thisLeft)*(self.origin_x - thisLeft)) < 500) {
			var styleString = self.leftShadowOffset(thisLeft) + 'px ' + self.bottomShadowOffset(thisTop) + 'px ' + self.shadowSpread(thisTop, thisLeft) + 'px rgba(0, 0, 0, ' + self.shadowIntensity(thisTop, thisLeft) + ')'
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

	// Preparing document by adding nodes
	elements = ($(document).height() / 100) * ($(document).width() / 100);
	console.log(elements);
	while(elements > 1) {
		$('body').prepend('<div class="building small"></div>');
		elements--;
	}

	Eagle = new EagleEye('building', false);
	Eagle.startRender(1, 'Eagle');
	//Eagle.stopRenderer();

	$(document).mousemove(function(e){
		Eagle.origin_x = e.pageX;
		Eagle.origin_y = e.pageY;
	});

	$('#PauseBtn').click(function(){
		Eagle.stopRenderer();
	});

	$('#StartBtn').click(function(){
		Eagle.startRender(1, 'Eagle');
	});

});