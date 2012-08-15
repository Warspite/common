var FoldingNode = function(foldDirection)
{
	mixin(new StackPanelNode(), this);

	this.folded = false;
	this.foldingSpeed = 800;
	this.renderSettings.foldingMargin = 10;
	this.renderSettings.foldingOffset = {x: 0, y: 0};
	
	var self = this;
	this.foldButton = new ButtonNode(function() {
		self.folded = !self.folded;
	});
	this.foldButton.renderSettings.graphicsType = GraphicsType.RECT;
	this.foldButton.renderSettings.size = {width: 24, height: 24};
	this.foldButton.renderSettings.origin = {horizontal: Direction.CENTER, vertical: Direction.CENTER};
	this.setFoldDirection(foldDirection);
	this.addChild(this.foldButton);
	
	this.extraTickEffects.push(this.foldingTick);
};

FoldingNode.prototype.foldingTick = function(self, tickInterval) {
	var targetPosition = self.calculateFoldedTargetPosition(self);
	var maxDeltaThisTick = self.foldingSpeed * tickInterval / 1000;
	
	var delta = {x: targetPosition.x - self.renderSettings.position.x, y: targetPosition.y - self.renderSettings.position.y };
	if(delta.x != 0 && Math.abs(delta.x) > maxDeltaThisTick)
		delta.x = (delta.x / Math.abs(delta.x)) * maxDeltaThisTick; 

	if(delta.y != 0 && Math.abs(delta.y) > maxDeltaThisTick)
		delta.y = (delta.y / Math.abs(delta.y)) * maxDeltaThisTick;
	
	self.renderSettings.foldingOffset.x += delta.x;
	self.renderSettings.foldingOffset.y += delta.y;
	self.renderSettings.position.x += delta.x;
	self.renderSettings.position.y += delta.y;
};

FoldingNode.prototype.calculateFoldedTargetPosition = function(self) {
	var targetPosition = {x: self.renderSettings.position.x - self.renderSettings.foldingOffset.x, y: self.renderSettings.position.y - self.renderSettings.foldingOffset.y};
	
	if(self.folded) {
		if(self.foldDirection == Direction.LEFT)
			targetPosition.x = targetPosition.x - self.renderSettings.size.width + self.renderSettings.foldingMargin;
		else if(self.foldDirection == Direction.RIGHT)
			targetPosition.x = targetPosition.x + self.renderSettings.size.width - self.renderSettings.foldingMargin;
		else if(self.foldDirection == Direction.TOP)
			targetPosition.y = targetPosition.y - self.renderSettings.size.height + self.renderSettings.foldingMargin;
		else if(self.foldDirection == Direction.BOTTOM)
			targetPosition.y = targetPosition.y + self.renderSettings.size.height - self.renderSettings.foldingMargin;
	}
	
	return targetPosition;
};

FoldingNode.prototype.setFoldDirection = function(dir) {
	this.foldDirection = dir;
	
	if(dir == Direction.LEFT)
		this.foldButton.renderSettings.anchor = {horizontal: Direction.RIGHT, vertical: Direction.TOP};
	else if(dir == Direction.RIGHT)
		this.foldButton.renderSettings.anchor = {horizontal: Direction.LEFT, vertical: Direction.TOP};
	else if(dir == Direction.TOP)
		this.foldButton.renderSettings.anchor = {horizontal: Direction.RIGHT, vertical: Direction.BOTTOM};
	else if(dir == Direction.BOTTOM)
		this.foldButton.renderSettings.anchor = {horizontal: Direction.LEFT, vertical: Direction.TOP};
};