var EventHandlingNode = function()
{
	mixin(new ParentNode(), this);
	
	this.eventHandlers = {};
};

EventHandlingNode.prototype.handleEvent = function(self, source, event) {
	if(self.eventHandlers[event.type.val] != null)
		self.eventHandlers[event.type.val](self, source, event);
	
	var c = self.children.firstElement;
	while( c != null ) {
		if(event.stopped)
			return;
		
		c.handleEvent(c, source, event);

		c = c.nextElement;
	}
};

EventHandlingNode.prototype.addEventHandler = function(eventType, callback) {
	this.eventHandlers[eventType.val] = callback;
};

EventHandlingNode.prototype.removeEventHandler = function(eventType) {
	this.eventHandlers[eventType.val] = null;
};
