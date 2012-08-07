var Mouse = function(canvas, renderer)
{
	mixin(new EventDispatcher(), this);
	
	this.canvas = canvas;
	this.renderer = renderer;

	this.mousePressed = false;
	this.mouseDown = false;
	this.mouseReleased = false;
	this.mouseMoved = false;
	this.mouseScrolled = false;
	this.withinBoundsOfAwareWidget = false;
	
	this.pointedAtObject = null
	this.lastPointedAtObject = null;

	this.lastMouseDownX = 0;
	this.lastMouseDownY = 0;
	this.lastMouseUpX = 0;
	this.lastMouseUpY = 0;
	this.current = {x: 0, y: 0};
	this.lastX = 0;
	this.lastY = 0;
	this.delta = {x: 0, y: 0};
	this.wheelDelta = 0;

	var self = this;
	canvas.addEventListener("mousemove", function(e){ self.mouseEventHandler(e); }, false);
	canvas.addEventListener("mousedown", function(e){ self.mouseEventHandler(e); }, false);
	canvas.addEventListener("mouseup", function(e){ self.mouseEventHandler(e); }, false);
	canvas.addEventListener("DOMMouseScroll", function(e){ self.mouseScrollHandler(e); }, false);
	canvas.addEventListener("mousewheel", function(e){ self.mouseScrollHandler(e); }, false);
};


Mouse.prototype.mouseScrollHandler = function(e) {
	stopEvent(e);
	
	if ("wheelDelta" in e) {
		this.wheelDelta = e.wheelDelta;
	}
	else {  // Firefox
		// The measurement units of the detail and wheelDelta properties are different.
		this.wheelDelta = -40 * e.detail;
	}
	
	this.mouseScrolled = true;
};

Mouse.prototype.mouseEventHandler = function(e)
{
	stopEvent(e);
	var x, y;

	if (e.offsetX || e.offsetX == 0) { // Opera
		x = e.offsetX;
		y = e.offsetY;
	}
	else if (e.layerX || e.layerX == 0) { // Firefox
		x = e.pageX - this.canvas.offsetLeft;
		y = e.pageY - this.canvas.offsetTop;
	} 

	var mouse = this;
	var func = mouse[e.type];
	if( func )
		func(mouse, e, x, y);
};

Mouse.prototype.mousemove = function(self, e, x, y)
{
	self.current.x = x;
	self.current.y = y;
	self.mouseMoved = true;
};

Mouse.prototype.mouseup = function(self, e, x, y)
{
	self.mouseReleased = true;
	self.lastMouseUpX = x;
	self.lastMouseUpY = y;
};

Mouse.prototype.mousedown = function(self, e, x, y)
{
	self.mousePressed = true;
	self.lastMouseDownX = x;
	self.lastMouseDownY = y;
};

Mouse.prototype.tick = function(elapsedTime)
{
	document.body.style.cursor = "default";
	this.withinBoundsOfAwareWidget = false;
		
	if( !this.mouseMoved ) {
		this.current.x = this.lastX;
		this.current.y = this.lastY;
	}

	if( !this.mouseScrolled ) {
		this.wheelDelta = 0;
	}
	else {
		this.dispatchEvent(EventType.MOUSE_WHEEL, this.wheelDelta);
	}
	
	this.delta.x = this.current.x - this.lastX;
	this.delta.y = this.current.y - this.lastY;

	this.lastX = this.current.x;
	this.lastY = this.current.y;

	this.mouseMoved = false;
	this.mouseScrolled = false;

	if( this.mousePressed )
		this.mouseDown = true;
	
	if( this.mouseReleased )
		this.mouseDown = false;
	
	this.updatePointedAtObject(elapsedTime);
	
	this.mousePressed = false;
	this.mouseReleased = false;
};

Mouse.prototype.updatePointedAtObject = function(elapsedTime) {
	this.lastPointedAtObject = this.pointedAtObject;
	this.pointedAtObject = this.renderer.findTopmostObjectAtCoordinates(this.current);
	
	if(this.lastPointedAtObject != null && this.pointedAtObject != this.lastPointedAtObject)
		this.dispatchEvent(EventType.MOUSE_EXIT, null, EventPropagation.NONE, this.lastPointedAtObject);

	if(this.pointedAtObject != null && this.pointedAtObject != this.lastPointedAtObject)
		this.dispatchEvent(EventType.MOUSE_ENTER, null, EventPropagation.NONE, this.pointedAtObject);
	
	this.handleDragEvents(elapsedTime);
	this.handlePointedAtObjectEvents(elapsedTime);
};

Mouse.prototype.handleDragEvents = function(elapsedTime) {
	if(this.mousePressed) {
		this.draggedObject = this.pointedAtObject;
	}
	else {
		if(this.mouseReleased)
			this.draggedObject = null;
		else if(this.draggedObject != null && (this.delta.x != 0 || this.delta.y != 0))
			this.dispatchEvent(EventType.MOUSE_DRAG, {delta: this.delta, elapsedTime: elapsedTime}, EventPropagation.NONE, this.draggedObject);
	}
};

Mouse.prototype.handlePointedAtObjectEvents = function(elapsedTime) {
	if(this.pointedAtObject == null || this.pointedAtObject.inputSettings == null)
		return;
	
	if(this.mousePressed)
		this.dispatchEvent(EventType.MOUSE_PRESSED, {coords: this.current, elapsedTime: elapsedTime}, EventPropagation.NONE, this.pointedAtObject);
	
	if(this.mouseReleased)
		this.dispatchEvent(EventType.MOUSE_RELEASED, {coords: this.current, elapsedTime: elapsedTime}, EventPropagation.NONE, this.pointedAtObject);
	
	if(this.mouseDown)
		this.dispatchEvent(EventType.MOUSE_DOWN, {coords: this.current, elapsedTime: elapsedTime}, EventPropagation.NONE, this.pointedAtObject);
	
	if(this.pointedAtObject.inputSettings.mouseCursor != null)
		document.body.style.cursor = this.pointedAtObject.inputSettings.mouseCursor;
};

Mouse.prototype.isWithinBounds = function(bounds)
{
	return this.current.x > bounds.left && this.current.y > bounds.top && this.current.x < bounds.right && this.current.y < bounds.bottom;
};

Mouse.prototype.getGeometricDistance = function(pos)
{
	return Math.sqrt(Math.pow(pos.x - this.current.x, 2) + Math.pow(pos.y - this.current.y, 2));
};