var TooltipNode = function()
{
	mixin(new TextNode(), this);

	this.renderSettings.graphicsType = GraphicsType.RECT;
	this.renderSettings.color = "#e5e5f0";
	this.renderSettings.textColor = "#303030";
	this.renderSettings.textPadding = 3;
	this.renderSettings.sizing = {width: Sizing.TEXT, height: Sizing.TEXT};
	
	this.rendered = false;
	
	var shadow = new RenderedNode();
	shadow.zIndex = -1;
	shadow.renderSettings.size = this.renderSettings.size;
	shadow.renderSettings.position = {x: 4, y: 3};
	shadow.renderSettings.graphicsType = GraphicsType.RECT;
	shadow.renderSettings.alpha = 0.5;
	
	this.addChild(shadow);
};

TooltipNode.prototype.display = function(text, coordinates) {
	this.renderSettings.position = coordinates;
	this.setText(text);
	this.rendered = true;
};

TooltipNode.prototype.hide = function() {
	this.rendered = false;
};
