var DraggableNode = function()
{
	mixin(new DynamicNode(), this);
	mixin(new InputAwareNode(), this);

	this.inputSettings.mouseVisible = true;
	this.inputSettings.dragTarget = this;
	
	var self = this;
	
	this.addEventHandler(EventType.MOUSE_DRAG, function(self, mouse, event) { 
		if(self.inputSettings.dragTarget == null)
			return;
		
		self.inputSettings.dragTarget.renderSettings.position.x += event.value.x;
		self.inputSettings.dragTarget.renderSettings.position.y += event.value.y;
	});
};

