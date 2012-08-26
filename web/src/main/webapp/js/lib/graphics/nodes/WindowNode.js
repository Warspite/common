var WindowNode = function(titleText, explicitSelf)
{
	var self = explicitSelf || this;
	
	mixin(new StackPanelNode(), self);
	mixin(new InputAwareNode(), self);

	self.renderSettings.size = {width: 150, height: 250};
	self.renderSettings.setAnchor(Direction.CENTER, Direction.CENTER);
	self.renderSettings.setOrigin(Direction.CENTER, Direction.CENTER);
	self.renderSettings.graphicsType = GraphicsType.RECT;
	self.renderSettings.color = "#808080";
	self.renderSettings.alpha = 0.7;
	self.inputSettings.mouseVisible = true;
	
	self.titleBar = new DraggableNode();
	self.titleBar.renderSettings.size = {width: 0, height: 28};
	self.titleBar.renderSettings.sizing.width = Sizing.PARENT;
	self.titleBar.renderSettings.graphicsType = GraphicsType.RECT;
	self.titleBar.renderSettings.color = "#202060";
	self.titleBar.renderSettings.padding = 2;
	
	var titleText = new TextNode(titleText);
	titleText.renderSettings.setAnchor(Direction.CENTER, Direction.CENTER);
	titleText.renderSettings.setOrigin(Direction.CENTER, Direction.CENTER);
	titleText.renderSettings.sizing.width = Sizing.PARENT;
	titleText.renderSettings.relativeSize.width = 0.7;
	titleText.maxNumberOfLines = 2;
	
	self.closeButton = new ButtonNode(function() { self.close() });
	self.closeButton.renderSettings.size = {width: 21, height: 21};
	self.closeButton.renderSettings.setAnchor(Direction.RIGHT, Direction.CENTER);
	self.closeButton.renderSettings.setOrigin(Direction.RIGHT, Direction.CENTER);
	self.closeButton.renderSettings.graphicsType = GraphicsType.IMAGE;
	self.closeButton.renderSettings.image = "closeButton.png";
	self.closeButton.zIndex = 1;
	self.closeButton.rendered = false;
	
	self.titleBar.addChild(titleText);
	self.titleBar.addChild(self.closeButton);
	self.addChild(self.titleBar);
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