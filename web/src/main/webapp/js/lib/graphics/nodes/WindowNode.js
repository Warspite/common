var WindowNode = function(titleText)
{
	mixin(new StackPanelNode(), this);
	mixin(new InputAwareNode(), this);

	this.renderSettings.size = {width: 150, height: 250};
	this.renderSettings.setAnchor(Anchor.CENTER, Anchor.CENTER);
	this.renderSettings.setOrigin(Origin.CENTER, Origin.CENTER);
	this.renderSettings.graphicsType = GraphicsType.RECT;
	this.renderSettings.color = "#808080";
	this.renderSettings.alpha = 0.7;
	this.inputSettings.mouseVisible = true;
	
	this.titleBar = new DraggableNode();
	this.titleBar.renderSettings.size = {width: 0, height: 28};
	this.titleBar.renderSettings.sizing.width = Sizing.PARENT;
	this.titleBar.renderSettings.graphicsType = GraphicsType.RECT;
	this.titleBar.renderSettings.color = "#202060";
	this.titleBar.renderSettings.padding = 2;
	
	var titleText = new TextNode(titleText);
	titleText.renderSettings.setAnchor(Anchor.CENTER, Anchor.CENTER);
	titleText.renderSettings.setOrigin(Origin.CENTER, Origin.CENTER);
	titleText.renderSettings.sizing.width = Sizing.PARENT;
	titleText.renderSettings.relativeSize.width = 0.7;
	titleText.maxNumberOfLines = 2;
	
	var self = this;
	this.closeButton = new ButtonNode(function() { self.close() });
	this.closeButton.renderSettings.size = {width: 21, height: 21};
	this.closeButton.renderSettings.setAnchor(Anchor.RIGHT, Anchor.CENTER);
	this.closeButton.renderSettings.setOrigin(Origin.RIGHT, Origin.CENTER);
	this.closeButton.renderSettings.graphicsType = GraphicsType.IMAGE;
	this.closeButton.renderSettings.image = "closeButton.png";
	this.closeButton.zIndex = 1;
	
	this.titleBar.addChild(titleText);
	this.titleBar.addChild(this.closeButton);
	this.addChild(this.titleBar);
	
	this.setDraggable(false);
	this.setClosable(false);
};

WindowNode.prototype.setDraggable = function(draggable) {
	if(draggable)
		this.titleBar.inputSettings.dragTarget = this;
	else
		this.titleBar.inputSettings.dragTarget = null;
};

WindowNode.prototype.setClosable = function(closable) {
	this.closeButton.rendered = closable;
};

WindowNode.prototype.close = function() {
	this.parent.removeChild(this);
};