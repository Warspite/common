var ButtonNode = function(callback)
{
	mixin(new RenderedNode(), this);
	mixin(new InputAwareNode(), this);

	this.inputSettings.mouseVisible = true;
	this.inputSettings.mouseCursor = "pointer";
	this.inputSettings.mousePressed = callback;
	
	this.addEventHandler(EventType.MOUSE_PRESSED, function(self, mouse, event) {
		new Audio(Paths.SOUND_ROOT + "/click.wav").play();
		callback(self, mouse, event);
	});
};

