var Window = function(titleText)
{
	mixin(new StackPanel(), this);

	this.renderSettings.alterPosition(0, 0, 150, 250);
	this.renderSettings.alterAnchor(Anchor.CENTER, Anchor.CENTER);
	this.renderSettings.alterOrigin(Origin.CENTER, Origin.CENTER);
	this.renderSettings.graphicsType = GraphicsType.RECT;
	this.renderSettings.color = "#808080";
	this.renderSettings.alpha = 0.7;
	
	this.titleBar = new DraggableNode();
	this.titleBar.renderSettings.alterPosition(0, 0, 10, 28);
	this.titleBar.renderSettings.sizing.width = Sizing.PARENT;
	this.titleBar.renderSettings.graphicsType = GraphicsType.RECT;
	this.titleBar.renderSettings.color = "#202060";
	this.titleBar.renderSettings.padding = 2;
	
	var titleText = new TextNode(titleText);
	titleText.renderSettings.alterAnchor(Anchor.CENTER, Anchor.CENTER);
	titleText.renderSettings.alterOrigin(Origin.CENTER, Origin.CENTER);
	titleText.renderSettings.sizing.width = Sizing.PARENT;
	titleText.renderSettings.relativeSize.width = 0.7;
	titleText.maxNumberOfLines = 2;
	
	var self = this;
	this.closeButton = new ButtonNode(function() { self.close() });
	this.closeButton.renderSettings.alterPosition(0, 0, 21, 21);
	this.closeButton.renderSettings.alterAnchor(Anchor.RIGHT, Anchor.CENTER);
	this.closeButton.renderSettings.alterOrigin(Origin.RIGHT, Origin.CENTER);
	this.closeButton.renderSettings.graphicsType = GraphicsType.IMAGE;
	this.closeButton.renderSettings.image = "closeButton.png";
	this.closeButton.zIndex = 1;
	
	this.titleBar.addChild(titleText);
	this.titleBar.addChild(this.closeButton);
	this.addChild(this.titleBar);
	
	this.setDraggable(false);
	this.setClosable(false);
};

Window.prototype.setDraggable = function(draggable) {
	if(draggable)
		this.titleBar.inputSettings.dragTarget = this;
	else
		this.titleBar.inputSettings.dragTarget = null;
};

Window.prototype.setClosable = function(closable) {
	this.closeButton.rendered = closable;
};

Window.prototype.close = function() {
	this.parent.removeChild(this);
};