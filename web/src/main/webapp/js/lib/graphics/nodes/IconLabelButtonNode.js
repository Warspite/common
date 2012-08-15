var IconLabelButtonNode = function(callback, img, text)
{
	mixin(new ButtonNode(callback), this);
	
	this.renderSettings.size = {width: 160, height: 40};
	
	var iconNode = new RenderedNode();
	iconNode.renderSettings.graphicsType = GraphicsType.IMAGE;
	iconNode.renderSettings.size = {width: 40, height: 40};
	iconNode.renderSettings.image = img;
	
	var textNode = new TextNode(text);
	textNode.renderSettings.position.x = 40;
	textNode.renderSettings.size.width = 120;
	
	
	this.addChild(iconNode);
	this.addChild(textNode);
};

