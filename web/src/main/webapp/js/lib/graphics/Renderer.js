var Renderer = function(surface, voidColor)
{
	mixin(new RenderedNode(null), this);
	this.surface = surface;
	this.viewportParameters = {x: 0, y: 0, scale: 1};
	this.voidColor = voidColor || "#000000";
	
	this.tickSelf = function(tickInterval) {
		this.surface.ctx.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
		this.surface.ctx.fillStyle = this.voidColor;
		this.surface.ctx.globalAlpha = 1.0;
		this.surface.ctx.fillRect(-1, -1, this.surface.width + 1, this.surface.height + 1);
		
		this.render(this.surface);
	};
	
	this.renderSelf = function(surface) {};
	
	this.sceneRoot = new RenderedNode();
	this.guiRoot = new RenderedNode();
	this.tooltipRoot = new RenderedNode();
	
	this.sceneRoot.zIndex = 0;
	this.guiRoot.zIndex = 1;
	this.guiRoot.zIndex = 2;
	
	this.addChild(this.sceneRoot);
	this.addChild(this.guiRoot);
	this.addChild(this.tooltipRoot);

	var self = this;
	this.surface.addResizeListener(function(width, height) {
		self.renderSettings.size.width = width;
		self.renderSettings.size.height = height;
		
		var c = self.children.firstElement;
		while( c != null ) {
			c.renderSettings.size = {width: width, height: height};
			c = c.nextElement;
		}
	});
};
