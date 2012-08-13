var Tooltipper = {
	tooltipify: function(node, text) {
		if(!node.inputSettings)
			mixin(new InputAwareNode(), node);
		
		if(!node.eventListeners)
			mixin(new EventDispatcher(), node);
		
		node.inputSettings.mouseVisible = true;
		
		node.addEventHandler(EventType.MOUSE_ENTER, function(self, source, event) {
			self.displayTooltipInMilliseconds = 750;
			self.mouse = source;
		});

		node.addEventHandler(EventType.MOUSE_EXIT, function(self, source, event) {
			self.displayTooltipInMilliseconds = null;
			self.mouse = null;
			self.dispatchEvent(EventType.TOOLTIP_REMOVAL_REQUESTED, null, EventPropagation.PARENT, self.parent);
		});
		
		node.extraTickEffects.push(function(self, tickInterval) {
			if(self.displayTooltipInMilliseconds == null)
				return;
			
			self.displayTooltipInMilliseconds -= tickInterval;
			
			if(self.displayTooltipInMilliseconds < 0) {
				self.displayTooltipInMilliseconds = null;
				self.dispatchEvent(EventType.TOOLTIP_DISPLAY_REQUESTED, {text: text, x: self.mouse.current.x, y: self.mouse.current.y}, EventPropagation.PARENT, self.parent);
			}
		});
	}
}
