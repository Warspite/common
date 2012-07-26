var Ticker = function(tickInterval) {
	this.tickInterval = tickInterval;
	this.tickListeners = new Array(0);

	var self = this;
	setInterval(function(){ self.tick(self.tickInterval); }, self.tickInterval);
};

Ticker.prototype.tick = function(tickInterval)
{
	for(i in this.tickListeners)
		this.tickListeners[i].tick(tickInterval);
};

Ticker.prototype.addListener = function(listener)
{
	this.tickListeners.push(listener);
};