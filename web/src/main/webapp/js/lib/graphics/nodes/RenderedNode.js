var RenderedNode = function()
{
	mixin(new Parent(), this);
	this.parent = null;
	this.zIndex = 0;
	this.rendered = true;
	this.renderSettings = new RenderSettings(0, 0, 0, 0);
};

RenderedNode.prototype.render = function(surface) {
	if(!this.rendered)
		return;
	
	if( this.preRenderingEffects != null )
		this.preRenderingEffects();

	var renderedSelfYet = false;
	var c = this.children.firstElement;
	while( c != null ) {
		if( this.preChildRenderingEffects != null )
			this.preChildRenderingEffects(c);
		
		if( c.zIndex >= 0 && !renderedSelfYet ) {
			this.renderSelf(surface);
			renderedSelfYet = true;
		}

		c.render(surface);
		
		if( this.postChildRenderingEffects != null )
			this.postChildRenderingEffects(c);
		
		c = c.nextElement;
	}

	if(!renderedSelfYet)
		this.renderSelf(surface);
};

RenderedNode.prototype.renderSelf = function(surface) {
	this.renderSettings.updateTransform(this.parent);
	
	surface.ctx.setTransform(this.renderSettings.transform.m[0], this.renderSettings.transform.m[1], this.renderSettings.transform.m[2], this.renderSettings.transform.m[3], this.renderSettings.transform.m[4], this.renderSettings.transform.m[5]);
	surface.ctx.globalAlpha = this.renderSettings.alpha;

	var b = this.renderSettings.getBoundaries();
	if( this.renderSettings.graphicsType == GraphicsType.RECT ) {
		surface.ctx.fillStyle = this.renderSettings.content;
		surface.ctx.fillRect(b.left, b.top, b.right - b.left, b.bottom - b.top);
	}
	
};

RenderedNode.prototype.getChildTransform = function(renderSettingsOfChild) {
	return this.renderSettings.getChildTransform(renderSettingsOfChild);
};
