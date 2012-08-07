var EventHandlingNode = function()
{
	mixin(new ParentNode(), this);
	
	this.eventHandlers = {};
};

EventHandlingNode.prototype.handleEvent = function(self, source, event) {
	if(self.eventHandlers[event.type.val] != null)
		self.eventHandlers[event.type.val](self, source, event);
	
	if(event.propagation == EventPropagation.CHILDREN)
		self.propagateEventToChildren(self, source, event);
	else if(event.propagation == EventPropagation.PARENT)
		self.propagateEventToParent(self, source, event);
	else if(event.propagation == EventPropagation.NONE) {
		
	}
	else {
		throw "Unrecognized EventPropgataion: " + event.propagation;
	}
};

EventHandlingNode.prototype.propagateEventToChildren = function(self, source, event) {
	var c = self.children.firstElement;
	while( c != null ) {
		if(event.propagation != EventPropagation.CHILDREN)
			return;
		
		c.handleEvent(c, source, event);

		c = c.nextElement;
	}
};

EventHandlingNode.prototype.propagateEventToParent = function(self, source, event) {
	self.parent.handleEvent(self.parent, source, event);
};

EventHandlingNode.prototype.addEventHandler = function(eventType, callback) {
	this.eventHandlers[eventType.val] = callback;
};

EventHandlingNode.prototype.removeEventHandler = function(eventType) {
	this.eventHandlers[eventType.val] = null;
};
