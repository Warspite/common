var RenderSurface = function(canvas, margin)
{
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.margin = margin;
	this.resizeListeners = new Array(0);
	
	var self = this;
	setInterval(function(){ 
		var resized = false;
		
		if(self.width != (window.innerWidth - self.margin.x))
			resized = true;

		if(self.height != (window.innerHeight - self.margin.y))
			resized = true;
		
		if(resized)
			self.resize(window.innerWidth - self.margin.x, window.innerHeight - self.margin.y);
	
	}, 
	100);
};

RenderSurface.prototype.resize = function(width, height) {
	this.width = width;
	this.height = height;
	this.canvas.width = width;
	this.canvas.height = height;
	
	for(i in this.resizeListeners)
		this.resizeListeners[i](width, height);
};

RenderSurface.prototype.addResizeListener = function(listener)
{
	this.resizeListeners.push(listener);
};