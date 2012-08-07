var EventDispatcher = function()
{
	this.eventListeners = new Array(0);
};

EventDispatcher.prototype.addEventListener = function(listener) {
	this.eventListeners.push(listener);
};

EventDispatcher.prototype.dispatchEvent = function(type, value, propagation, target) {
	var event = {type: type, value: value};
	
	if(propagation == null)
		event.propagation = EventPropagation.CHILDREN;
	else
		event.propagation = propagation;
	
	if(target != null)
		target.handleEvent(target, this, event);
	else
		for(el in this.eventListeners)
			this.eventListeners[el].handleEvent(this.eventListeners[el], this, event);
};
