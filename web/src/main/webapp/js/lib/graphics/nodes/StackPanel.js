var StackPanel = function()
{
	mixin(new RenderedNode(), this);
	
	this.orientation = Orientation.VERTICAL;
	this.renderSettings.interChildPadding = 0;
	
	this.preRenderingEffects = function() {
		this.accumulatedChildTranslation = 0;
	};

	this.postChildRenderingEffects = function(child) {
		this.accumulatedChildTranslation += this.renderSettings.interChildPadding;

		if( this.orientation == Orientation.VERTICAL )
			this.accumulatedChildTranslation += child.renderSettings.height;
		else if( this.orientation == Orientation.HORIZONTAL )
			this.accumulatedChildTranslation += child.renderSettings.width;
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

	this.resizeBasedOnChildren = function() {
		var widest = 0;
		var highest = 0;
		var totalWidth = 0;
		var totalHeight = 0;
		var c = this.children.firstElement;
		while( c != null ) {
			if( c.renderSettings.width > widest )
				widest = c.renderSettings.width;

			if( c.renderSettings.height > highest )
				highest = c.renderSettings.height;
			
			if(totalWidth > 0)
				totalWidth += this.renderSettings.interChildPadding;
			
			if(totalHeight > 0)
				totalHeight += this.renderSettings.interChildPadding;
			
			totalWidth += c.renderSettings.width + this.renderSettings.interChildPadding;
			totalHeight += c.renderSettings.height + this.renderSettings.interChildPadding;
			
			c = c.nextElement;
		}
		
		if(this.orientation == Orientation.HORIZONTAL) {
			this.renderSettings.width = totalWidth + this.renderSettings.padding * 2;
			this.renderSettings.height = highest + this.renderSettings.padding * 2;
		}
		else if(this.orientation == Orientation.VERTICAL) {
			this.renderSettings.width = widest + this.renderSettings.padding * 2;
			this.renderSettings.height = totalHeight + this.renderSettings.padding * 2;
		}
		else {
			throw "Unrecognized orientation setting: " + this.orientation;
		}
	};
};

