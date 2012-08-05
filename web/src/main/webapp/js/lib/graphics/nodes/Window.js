var Window = function(titleText)
{
	mixin(new StackPanel(), this);

	this.renderSettings.alterPosition(0, 0, 128, 200);
	this.renderSettings.alterAnchor(Anchor.CENTER, Anchor.CENTER);
	this.renderSettings.alterOrigin(Origin.CENTER, Origin.CENTER);
	this.renderSettings.graphicsType = GraphicsType.RECT;
	this.renderSettings.content = "#808080";
	this.renderSettings.alpha = 0.7;
	
	this.titleBar = new DraggableNode();
	this.titleBar.renderSettings.alterPosition(0, 0, this.renderSettings.width, 40);
	this.titleBar.renderSettings.graphicsType = GraphicsType.RECT;
	this.titleBar.renderSettings.content = "#202020";
	
	this.addChild(this.titleBar);
	
	this.setDraggable(false);
};

Window.prototype.setDraggable = function(draggable) {
	if(draggable)
		this.titleBar.inputSettings.dragTarget = this;
	else
		this.titleBar.inputSettings.dragTarget = null;
};

