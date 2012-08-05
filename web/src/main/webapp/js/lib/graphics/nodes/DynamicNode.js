var DynamicNode = function()
{
	mixin(new RenderedNode(), this);
	
	this.renderSettings.sizing = {width: Sizing.ABSOLUTE, height: Sizing.ABSOLUTE};
	this.renderSettings.relativeSize = {width: 1.0, height: 1.0};
	this.extraTickEffects.push(this.calculateSize);
};

DynamicNode.prototype.calculateSize = function(self, tickInterval) {
	for(dim in self.renderSettings.sizing) {
		if(self.renderSettings.sizing[dim] == Sizing.CHILDREN)
			self.resizeBasedOnChildren(dim);

		if(self.renderSettings.sizing[dim] == Sizing.PARENT)
			self.resizeBasedOnParent(dim);
	}
};

DynamicNode.prototype.resizeBasedOnChildren = function(dimension) {
	var greatest = 0;
	
	var c = this.children.firstElement;
	while( c != null ) {
		if( c.renderSettings[dimension] > greatest )
			greatest = c.renderSettings[dimension];
		
		c = c.nextElement;
	}
	
	var newSize = this.renderSettings.relativeSize[dimension] * (greatest + this.renderSettings.padding * 2);
	if(newSize != this.renderSettings[dimension]) {
		this.renderSettings[dimension] = newSize;
		this.renderSettings.boundaries = null;
	}
};

DynamicNode.prototype.resizeBasedOnParent = function(dimension) {
	var newSize = this.renderSettings.relativeSize[dimension] * (this.parent.renderSettings[dimension] - this.parent.renderSettings.padding * 2);
	if(newSize != this.renderSettings[dimension]) {
		this.renderSettings[dimension] = newSize;
		this.renderSettings.boundaries = null;
	}
};
