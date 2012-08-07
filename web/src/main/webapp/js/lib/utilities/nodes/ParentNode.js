var ParentNode = function()
{
	this.children = new SortedList("zIndex");
	this.extraTickEffects = new Array(0);
};

ParentNode.prototype.tick = function(tickInterval) {
	var c = this.children.firstElement;
	while( c != null ) {
		c.tick(tickInterval);
		c = c.nextElement;
	}

	for(i in this.extraTickEffects)
		this.extraTickEffects[i](this, tickInterval);
	
	this.tickSelf(tickInterval);
};

ParentNode.prototype.tickSelf = function(tickInterval) {
	
};

ParentNode.prototype.addChild = function(child)
{
	this.children.add(child);
	child.parent = this;
};

ParentNode.prototype.removeChild = function(child)
{
	this.children.remove(child);
	child.parent = null;
};

ParentNode.prototype.clearChildren = function()
{
	var c = this.children.firstElement;
	while( c != null ) {
		c.parent = null;
		c = c.nextElement;
	}
	
	this.children = new SortedList("zIndex");
};
