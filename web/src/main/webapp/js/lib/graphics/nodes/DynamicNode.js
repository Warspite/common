var DynamicNode = function()
{
	mixin(new RenderedNode(), this);
	
	this.renderSettings.sizing = {width: Sizing.ABSOLUTE, height: Sizing.ABSOLUTE};
	this.extraTickEffects.push(this.calculateSize);

	this.extraTickEffects.push(this.calculateSize);
};

DynamicNode.prototype.calculateSize = function(self, tickInterval) {
	if(self.renderSettings.sizing.width == Sizing.CHILDREN)
		self.resizeBasedOnChildren("width");

	if(self.renderSettings.sizing.height == Sizing.CHILDREN)
		self.resizeBasedOnChildren("height");
};

DynamicNode.prototype.resizeBasedOnChildren = function(dimension) {
	var greatest = 0;
	
	var c = this.children.firstElement;
	while( c != null ) {
		if( c.renderSettings[dimension] > greatest )
			greatest = c.renderSettings[dimension];
		
		c = c.nextElement;
	}
	
	this.renderSettings[dimension] = greatest + this.renderSettings.padding * 2;
};
