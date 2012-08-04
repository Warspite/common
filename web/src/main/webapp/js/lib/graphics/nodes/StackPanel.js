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
};
