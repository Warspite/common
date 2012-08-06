var AnimationSettings = function() {
	this.frameTop = 0;
	this.frameInterval = 100;
	this.frameHeight = 16;
	this.running = false;
	this.elapsedTime = 0;
	this.animationEndBehavior = AnimationEndBehavior.FREEZE;
};

