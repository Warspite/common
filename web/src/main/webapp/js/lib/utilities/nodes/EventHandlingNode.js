var EventHandlingNode = function()
{
	mixin(new ParentNode(), this);
	
	this.eventHandlers = {};
};

EventHandlingNode.prototype.handleEvent = function(self, source, event) {
	var callbacks = self.eventHandlers[event.type.val];
	if( callbacks != null )
		for(cb in callbacks)
			callbacks[cb](self, source, event);
	
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
	if(self.parent != null )
		self.parent.handleEvent(self.parent, source, event);
};

EventHandlingNode.prototype.addEventHandler = function(eventType, callback) {
	if( this.eventHandlers[eventType.val] == null )
		this.eventHandlers[eventType.val] = new Array(0);
	
	this.eventHandlers[eventType.val].push(callback);
};

EventHandlingNode.prototype.removeEventHandler = function(eventType, callback) {
	var callbacks = this.eventHandlers[eventType.val];
	if(callbacks == null)
		return;
	
	var indexOfCallback = callbacks.indexOf(callback);
	
	if(indexOfCallback != -1)
		callbacks.splice(indexOfCallback, 1);	
};
