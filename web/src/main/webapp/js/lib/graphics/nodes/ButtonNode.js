var ButtonNode = function(callback)
{
	mixin(new RenderedNode(), this);
	mixin(new InputAwareNode(), this);

	this.inputSettings.mouseVisible = true;
	this.inputSettings.mouseCursor = "pointer";
	this.inputSettings.mousePressed = callback;
	
	this.addEventHandler(EventType.MOUSE_PRESSED, function(self, mouse, event) { 
		callback(self, mouse, event);
	});
};

