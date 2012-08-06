var DraggableNode = function()
{
	mixin(new DynamicNode(), this);
	mixin(new InputAwareNode(), this);

	this.inputSettings.mouseVisible = true;
	this.inputSettings.dragTarget = this;
	
	var self = this;
	this.inputSettings.mouseDrag = function(coords, delta) {
		if(self.inputSettings.dragTarget == null)
			return;
		
		self.inputSettings.dragTarget.renderSettings.position.x += delta.x;
		self.inputSettings.dragTarget.renderSettings.position.y += delta.y;
	};
};

