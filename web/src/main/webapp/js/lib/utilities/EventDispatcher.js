var EventDispatcher = function()
{
	this.eventListeners = new Array(0);
};

EventDispatcher.prototype.addEventListener = function(listener) {
	this.eventListeners.push(listener);
};

EventDispatcher.prototype.dispatchEvent = function(event) {
	for(el in this.eventListeners)
		this.eventListeners[el].handleEvent(this.eventListeners[el], this, event);
};