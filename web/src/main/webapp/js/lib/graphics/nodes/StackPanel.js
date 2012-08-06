var StackPanel = function()
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
		var greatest = 0;
		var totalSize = 0;
		
		var c = this.children.firstElement;
		while( c != null ) {
			if( c.renderSettings.size[dimension] > greatest )
				greatest = c.renderSettings.size[dimension];
			
			if(totalSize > 0)
				totalSize += this.renderSettings.interChildPadding;
			
			totalSize += c.renderSettings.size[dimension];

			c = c.nextElement;
		}
		
		var resultingChildSize = greatest;
		
		if(dimension == "width" && this.orientation == Orientation.HORIZONTAL)
			resultingChildSize = totalSize;
		
		if(dimension == "height" && this.orientation == Orientation.VERTICAL)
			resultingChildSize = totalSize;
		
		this.renderSettings.size[dimension] = this.renderSettings.relativeSize[dimension] * (resultingChildSize + this.renderSettings.padding * 2);
	};
};

