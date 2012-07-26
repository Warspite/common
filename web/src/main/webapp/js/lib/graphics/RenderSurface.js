var RenderSurface = function(canvas)
{
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.resizeListeners = new Array(0);
	
	var self = this;
	setInterval(function(){ 
		var resized = false;
		
		if(self.width != window.innerWidth)
			resized = true;

		if(self.height != window.innerHeight)
			resized = true;
		
		if(resized)
			self.resize(window.innerWidth, window.innerHeight);
	}, 
	100);
};

RenderSurface.prototype.resize = function(width, height) {
	this.width = width;
	this.height = height;
	this.canvas.width = width;
	this.canvas.height = height;
	
	for(i in this.tickListeners)
		this.tickListeners[i].tick(tickInterval);
};

RenderSurface.prototype.addResizeListener = function(listener)
{
	this.resizeListeners.push(listener);
};