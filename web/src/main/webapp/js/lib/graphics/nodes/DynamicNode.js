var DynamicNode = function()
{
	mixin(new RenderedNode(), this);
	
	this.renderSettings.sizing = Sizing.ABSOLUTE;
	this.extraTickEffects.push(this.calculateSize);

	this.extraTickEffects.push(this.calculateSize);
};

DynamicNode.prototype.calculateSize = function(self, tickInterval) {
	if(self.renderSettings.sizing == Sizing.CHILDREN)
		self.resizeBasedOnChildren();
};

DynamicNode.prototype.resizeBasedOnChildren = function() {
	var widest = 0;
	var highest = 0;
	var c = this.children.firstElement;
	while( c != null ) {
		if( c.renderSettings.width > widest )
			widest = c.renderSettings.width;

		if( c.renderSettings.height > highest )
			highest = c.renderSettings.height;
		
		c = c.nextElement;
	}
	
	this.renderSettings.width = widest + this.renderSettings.padding * 2;
	this.renderSettings.height = highest + this.renderSettings.padding * 2;
};
