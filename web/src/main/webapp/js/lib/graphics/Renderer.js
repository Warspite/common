var Renderer = function(surface)
{
//	mixin(new ObjectContainer(0), this);
	this.surface = surface;
	this.viewportParameters = {x: 0, y: 0, scale: 1};
	this.backgroundFillStyle = "#000000";
	
	this.tickSelf = function(tickInterval) {
		this.surface.ctx.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
		this.surface.ctx.fillStyle = this.backgroundFillStyle;
		this.surface.ctx.globalAlpha = 1.0;
		this.surface.ctx.fillRect(-1, -1, this.surface.width + 1, this.surface.height + 1);

		//this.render(this.ctx, this.calculateViewportTransform());
	};
};

Renderer.prototype.tick = function(tickInterval)
{
	this.tickSelf(tickInterval);
};

Renderer.prototype.calculateViewportTransform = function()
{
	var t = new Transform();
	t.translate(this.surface.width * 0.5, this.surface.height * 0.5 );
	t.scale(this.viewportParameters.scale, this.viewportParameters.scale);
	t.translate(-this.this.viewportParameters.x, -this.viewportParameters.y);
	return t;
};
