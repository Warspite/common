var AnimationSettings = function() {
	this.frameTop = 0;
	this.frameInterval = 100;
	this.frameHeight = 16;
	
	this.imgRunning = false;
	this.imgElapsedTime = 0;
	this.imgAnimationEndBehavior = AnimationEndBehavior.FREEZE;

	this.rotationSpeed = 0;
	this.alphaSpeed = 0;
	this.sizingSpeed = {width: 0, height: 0};
	this.scalingSpeed = {x: 0, y: 0};
	this.translationSpeed = {x: 0, y: 0};

	this.spatialRunning = false;
};

