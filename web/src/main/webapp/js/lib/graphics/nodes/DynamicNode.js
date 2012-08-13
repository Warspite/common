var DynamicNode = function()
{
	mixin(new RenderedNode(), this);
	
	this.renderSettings.sizing = {width: Sizing.ABSOLUTE, height: Sizing.ABSOLUTE};
	this.renderSettings.sizeRatio = null;
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
	
	if(self.renderSettings.sizeRatio != null)
		self.resizeToFitRatio();
};

DynamicNode.prototype.resizeBasedOnChildren = function(dimension) {
	this.renderSettings.size[dimension] = this.renderSettings.relativeSize[dimension] * (this.findSizeOfLargestChild(dimension) + this.renderSettings.padding * 2);
};

DynamicNode.prototype.resizeBasedOnParent = function(dimension) {
	this.renderSettings.size[dimension] = this.renderSettings.relativeSize[dimension] * (this.parent.renderSettings.size[dimension] - this.parent.renderSettings.padding * 2);
};

DynamicNode.prototype.findSizeOfLargestChild = function(dimension) {
	var greatest = 0;
	
	var c = this.children.firstElement;
	while( c != null ) {
		if( c.renderSettings.size[dimension] > greatest )
			greatest = c.renderSettings.size[dimension];
		
		c = c.nextElement;
	}
	
	return greatest;
};

DynamicNode.prototype.resizeToFitRatio = function() {
	var currentRatio = this.renderSettings.size.width / this.renderSettings.size.height;
	
	if(currentRatio > this.renderSettings.sizeRatio.ratio) {
		if(this.renderSettings.sizeRatio.behavior == SizeRatioBehavior.SHRINK)
			this.renderSettings.size.width = this.renderSettings.size.height * this.renderSettings.sizeRatio.ratio; 
		else
			this.renderSettings.size.height = this.renderSettings.size.width / this.renderSettings.sizeRatio.ratio; 
	}
	else {
		if(this.renderSettings.sizeRatio.behavior == SizeRatioBehavior.SHRINK)
			this.renderSettings.size.height = this.renderSettings.size.width / this.renderSettings.sizeRatio.ratio; 
		else
			this.renderSettings.size.width = this.renderSettings.size.height * this.renderSettings.sizeRatio.ratio; 
	}
};
