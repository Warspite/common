var ViewportNode = function()
{
	mixin(new RenderedNode(), this);
	
	this.renderSettings.setAnchor(Anchor.CENTER, Anchor.CENTER);
	this.renderSettings.focus = {x: 0, y: 0};

	this.addEventHandler(EventType.KEY_DOWN, function(self, keyboard, event) { 
		var scalingFactor = 1 + 0.005 * event.elapsedTime; 
		if( event.value == Key.KP_MINUS ) {
			self.renderSettings.scale.x = self.renderSettings.scale.x / scalingFactor;  
			self.renderSettings.scale.y = self.renderSettings.scale.y / scalingFactor;  
		}

		if( event.value == Key.KP_PLUS ) {
			self.renderSettings.scale.x = self.renderSettings.scale.x * scalingFactor;  
			self.renderSettings.scale.y = self.renderSettings.scale.y * scalingFactor;  
		}

		if( event.value == Key.LEFT )
			self.renderSettings.position.x += 1 * event.elapsedTime;  

		if( event.value == Key.RIGHT )
			self.renderSettings.position.x -= 1 * event.elapsedTime;  

		if( event.value == Key.UP )
			self.renderSettings.position.y += 1 * event.elapsedTime;  

		if( event.value == Key.DOWN )
			self.renderSettings.position.y -= 1 * event.elapsedTime;  
	});
};


