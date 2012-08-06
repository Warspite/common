var RenderSettings = function() {
	this.position = {x: 0, y: 0};
	this.size = {width: 0, height: 0};
	
	this.lastPosition = {x: -1, y: -1};
	this.lastSize = {width: -1, height: -1};
	
	this.alpha = 1.0;
	this.color = "#000000";
	this.graphicsType = GraphicsType.NONE;
	this.anchor = {horizontal: Anchor.LEFT, vertical: Anchor.TOP};
	this.origin = {horizontal: Origin.LEFT, vertical: Origin.TOP};
	this.padding = 0;
	this.image = null;
	this.lastUsedImage = null;
	
	this.updateTransform(null);
};

RenderSettings.prototype.updateTransform = function(parent) {
	if( parent == null ) {
		this.transform = new Transform();
		this.transform.translate(this.position.x, this.position.y);
		return;
	}
	
	var newTransform = parent.getChildTransform(this);
	
	var translation = {x: this.position.x, y: this.position.y};
	
	if(this.anchor.horizontal == Anchor.LEFT) {
		
	}
	else if(this.anchor.horizontal == Anchor.CENTER) {
		translation.x += 0.5 * parent.renderSettings.size.width;
	}
	else if(this.anchor.horizontal == Anchor.RIGHT) {
		translation.x += parent.renderSettings.size.width;
	}
	else {
		throw "Unrecognized horizontal anchor setting: " + this.anchor.horizontal;
	}

	if(this.anchor.vertical == Anchor.TOP) {
		
	}
	else if(this.anchor.vertical == Anchor.CENTER) {
		translation.y += 0.5 * parent.renderSettings.size.height;
	}
	else if(this.anchor.vertical == Anchor.BOTTOM) {
		translation.y += parent.renderSettings.size.height;
	}
	else {
		throw "Unrecognized vertical anchor setting: " + this.anchor.vertical;
	}
	
	newTransform.translate(translation.x, translation.y);
	
	this.transform = newTransform;
};

RenderSettings.prototype.alterOrigin = function(horizontal, vertical) {
	if(horizontal) this.origin.horizontal = horizontal;
	if(vertical) this.origin.vertical = vertical;
	
	this.boundaries = null;
};

RenderSettings.prototype.alterAnchor = function(horizontal, vertical) {
	if(horizontal) this.anchor.horizontal = horizontal;
	if(vertical) this.anchor.vertical = vertical;
};

RenderSettings.prototype.getBoundaries = function() {
	if(this.position.x != this.lastPosition.x || this.position.y != this.lastPosition.y || this.size.width != this.lastSize.width || this.size.height != this.lastSize.height)
		this.boundaries = null;
	
	if(this.boundaries == null)
		this.boundaries = this.calculateBoundaries();
	
	return this.boundaries;
};
	
RenderSettings.prototype.calculateBoundaries = function() {
	var bounds = {top: 0, left: 0, right: 0, bottom: 0};
	
	if(this.origin.horizontal == Origin.LEFT) {
		bounds.left = 0;
		bounds.right = this.size.width;
		bounds.centerX = 0.5 * this.width;
	}
	else if(this.origin.horizontal == Origin.RIGHT) {
		bounds.left = - this.size.width;
		bounds.right = 0;
		bounds.centerX = - 0.5 * this.size.width;
	}
	else if(this.origin.horizontal == Origin.CENTER){
		bounds.left = -0.5 * this.size.width;
		bounds.right = 0.5 * this.size.width;
		bounds.centerX = 0;
	}
	else {
		throw "Unrecognized horizontal origin setting: " + this.origin.horizontal.name;
	}
	
	if(this.origin.vertical == Origin.TOP) {
		bounds.top = 0
		bounds.bottom = this.size.height
		bounds.centerY = 0.5 * this.size.height;
	}
	else if(this.origin.vertical == Origin.BOTTOM) {
		bounds.top = - this.size.height
		bounds.bottom = 0
		bounds.centerY = - 0.5 * this.size.height ;
	}
	else if(this.origin.vertical == Origin.CENTER) {
		bounds.top = - 0.5 * this.size.height
		bounds.bottom = 0.5 * this.size.height
		bounds.centerY = 0;
	}
	else {
		throw "Unrecognized vertical origin setting: " + this.origin.vertical.name;
	}
	
	this.lastPosition.x = this.position.x;
	this.lastPosition.y = this.position.y;
	this.lastSize.width = this.size.width;
	this.lastSize.height = this.size.height;
	
	return bounds;
};

RenderSettings.prototype.getChildTransform = function(renderSettingsOfChild) {
	var t = this.transform.clone();
	var translation = {x: 0, y: 0};
	
	if( this.origin.horizontal == Origin.CENTER )
		translation.x -= 0.5 * this.size.width;
	else if(this.origin.horizontal == Origin.RIGHT )
		translation.x -= this.size.width;
	
	if( this.origin.vertical == Origin.CENTER )
		translation.y -= 0.5 * this.size.height;
	else if(this.origin.vertical == Origin.BOTTOM )
		translation.y -= this.size.height;
	
	if( renderSettingsOfChild.origin.horizontal == Origin.LEFT )
		translation.x += this.padding;
	else if( renderSettingsOfChild.origin.horizontal == Origin.RIGHT )
		translation.x -= this.padding;
	
	if( renderSettingsOfChild.origin.vertical == Origin.TOP )
		translation.y += this.padding;
	else if( renderSettingsOfChild.origin.vertical == Origin.BOTTOM )
		translation.y -= this.padding;
	
	t.translate(translation.x, translation.y);
	return t;
};

RenderSettings.prototype.pointIsWithinBoundaries = function(point) {
	var transformedPoint = this.transform.cloneInvert().transformPoint(point);
	return (
		transformedPoint.x >= this.getBoundaries().left && 
		transformedPoint.x <= this.getBoundaries().right && 
		transformedPoint.y >= this.getBoundaries().top && 
		transformedPoint.y <= this.getBoundaries().bottom
	);
};

RenderSettings.prototype.getImage = function() {
	if(this.image != this.lastUsedImage) {
		this.imageObject = new Image(); 
		this.imageObject.src = Paths.IMAGE_ROOT + this.image;
	}
	
	return this.imageObject;
};