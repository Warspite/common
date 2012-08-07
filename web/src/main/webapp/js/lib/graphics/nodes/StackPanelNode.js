var StackPanelNode = function()
{
	mixin(new DynamicNode(), this);
	
	this.orientation = Orientation.VERTICAL;
	this.renderSettings.interChildPadding = 0;
	
	this.preRenderingEffects = function() {
		this.accumulatedChildTranslation = 0;
	};

	this.postChildRenderingEffects = function(child) {
		this.accumulatedChildTranslation += this.renderSettings.interChildPadding;

		if( this.orientation == Orientation.VERTICAL )
			this.accumulatedChildTranslation += child.renderSettings.size.height;
		else if( this.orientation == Orientation.HORIZONTAL )
			this.accumulatedChildTranslation += child.renderSettings.size.width;
		else
			throw "Unrecognized orientation setting: " + this.orientation;
	};

	this.getChildTransform = function(renderSettingsOfChild) {
		var t = this.renderSettings.getChildTransform(renderSettingsOfChild);

		if( this.orientation == Orientation.VERTICAL )
			t.translate(0, this.accumulatedChildTranslation);
		else if( this.orientation == Orientation.HORIZONTAL )
			t.translate(this.accumulatedChildTranslation, 0);
		else
			throw "Unrecognized orientation setting: " + this.orientation;

		return t;
	};

	this.resizeBasedOnChildren = function(dimension) {
		var resultingChildSize = 0;
		
		if((dimension == "width" && this.orientation == Orientation.HORIZONTAL) || (dimension == "height" && this.orientation == Orientation.VERTICAL))
			resultingChildSize = this.findTotalSizeOfStackedChildren(dimension);
		else
			resultingChildSize = this.findSizeOfLargestChild(dimension);
		
		this.renderSettings.size[dimension] = this.renderSettings.relativeSize[dimension] * (resultingChildSize + this.renderSettings.padding * 2);
	};
};

StackPanelNode.prototype.findTotalSizeOfStackedChildren = function(dimension) {
	var totalSize = 0;
	
	var c = this.children.firstElement;
	while( c != null ) {
		if(totalSize > 0)
			totalSize += this.renderSettings.interChildPadding;
		
		totalSize += c.renderSettings.size[dimension];

		c = c.nextElement;
	}
	
	return totalSize;
};