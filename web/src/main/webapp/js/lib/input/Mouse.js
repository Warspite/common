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
		this.dispatchEvent({type: EventType.MOUSE_WHEEL, value: this.wheelDelta, elapsedTime: elapsedTime});
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
	
	this.updatePointedAtObject();
	
	this.mousePressed = false;
	this.mouseReleased = false;
};

Mouse.prototype.updatePointedAtObject = function() {
	this.lastPointedAtObject = this.pointedAtObject;
	this.pointedAtObject = this.renderer.findTopmostObjectAtCoordinates(this.current);
	
	if(this.pointedAtObject != this.lastPointedAtObject) {
		if(this.lastPointedAtObject != null && this.lastPointedAtObject.inputSettings != null && this.lastPointedAtObject.inputSettings.mouseExit != null)
			this.lastPointedAtObject.inputSettings.mouseExit(this.current);

		if(this.pointedAtObject != null && this.pointedAtObject.inputSettings != null && this.pointedAtObject.inputSettings.mouseEnter != null)
			this.pointedAtObject.inputSettings.mouseEnter(this.current);
	}
	
	this.handleDragEvents();
	this.handlePointedAtObjectEvents();
};

Mouse.prototype.handleDragEvents = function() {
	if(this.mousePressed) {
		this.draggedObject = this.pointedAtObject;
	}
	else {
		if(this.mouseReleased)
			this.draggedObject = null;
		else if(this.draggedObject != null && this.draggedObject.inputSettings != null && this.draggedObject.inputSettings.mouseDrag != null)
			this.draggedObject.inputSettings.mouseDrag(this.current, this.delta);
	}
};

Mouse.prototype.handlePointedAtObjectEvents = function() {
	if(this.pointedAtObject == null || this.pointedAtObject.inputSettings == null)
		return;
	
	if(this.mousePressed && this.pointedAtObject.inputSettings.mousePressed != null)
		this.pointedAtObject.inputSettings.mousePressed(this.current);
	
	if(this.mouseReleased && this.pointedAtObject.inputSettings.mouseReleased != null)
		this.pointedAtObject.inputSettings.mouseReleased(this.current);
	
	if(this.mouseDown && this.pointedAtObject.inputSettings.mouseDown != null)
		this.pointedAtObject.inputSettings.mouseDown(this.current);
	
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