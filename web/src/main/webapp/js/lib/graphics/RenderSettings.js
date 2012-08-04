function RenderSettings(x, y, width, height, parentTransform) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.alpha = 1.0;
	this.content = null;
	this.graphicsType = GraphicsType.NONE;
	this.sizing = Sizing.ABSOLUTE;
	this.anchor = {horizontal: Anchor.LEFT, vertical: Anchor.TOP};
	this.origin = {horizontal: Origin.LEFT, vertical: Origin.TOP};
	this.padding = 0;
	
	this.updateTransform(parentTransform);
}

RenderSettings.prototype.updateTransform = function(parent) {
	if( parent == null ) {
		this.transform = new Transform();
		this.transform.translate(this.x, this.y);
		return;
	}
	
	var newTransform = parent.getChildTransform(this);
	
	var translation = {x: this.x, y: this.y};
	
	if(this.anchor.horizontal == Anchor.LEFT) {
		
	}
	else if(this.anchor.horizontal == Anchor.CENTER) {
		translation.x += 0.5 * parent.renderSettings.width;
	}
	else if(this.anchor.horizontal == Anchor.RIGHT) {
		translation.x += parent.renderSettings.width;
	}
	else {
		throw "Unrecognized horizontal anchor setting: " + this.anchor.horizontal;
	}

	if(this.anchor.vertical == Anchor.TOP) {
		
	}
	else if(this.anchor.vertical == Anchor.CENTER) {
		translation.y += 0.5 * parent.renderSettings.height;
	}
	else if(this.anchor.vertical == Anchor.BOTTOM) {
		translation.y += parent.renderSettings.height;
	}
	else {
		throw "Unrecognized vertical anchor setting: " + this.anchor.vertical;
	}
	
	newTransform.translate(translation.x, translation.y);
	
	this.transform = newTransform;
};

RenderSettings.prototype.alterPosition = function(x, y, width, height) {
	if(x) this.x = x;
	if(y) this.y = y;
	if(width) this.width = width;
	if(height) this.height = height;
	
	this.boundaries = null;
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
	if(this.boundaries == null)
		this.boundaries = this.calculateBoundaries();
	
	return this.boundaries;
};
	
RenderSettings.prototype.calculateBoundaries = function() {
	var bounds = {top: 0, left: 0, right: 0, bottom: 0};
	
	if(this.origin.horizontal == Origin.LEFT) {
		bounds.left = 0;
		bounds.right = this.width;
		bounds.centerX = 0.5 * this.width;
	}
	else if(this.origin.horizontal == Origin.RIGHT) {
		bounds.left = - this.width;
		bounds.right = 0;
		bounds.centerX = - 0.5 * this.width;
	}
	else if(this.origin.horizontal == Origin.CENTER){
		bounds.left = -0.5 * this.width;
		bounds.right = 0.5 * this.width;
		bounds.centerX = 0;
	}
	else {
		throw "Unrecognized horizontal origin setting: " + this.origin.horizontal;
	}
	
	if(this.origin.vertical == Origin.TOP) {
		bounds.top = 0
		bounds.bottom = this.height
		bounds.centerY = 0.5 * this.height;
	}
	else if(this.origin.vertical == Origin.BOTTOM) {
		bounds.top = - this.height
		bounds.bottom = 0
		bounds.centerY = - 0.5 * this.height ;
	}
	else if(this.origin.vertical == Origin.CENTER) {
		bounds.top = - 0.5 * this.height
		bounds.bottom = 0.5 * this.height
		bounds.centerY = 0;
	}
	else {
		throw "Unrecognized vertical origin setting: " + this.origin.vertical;
	}
	
	return bounds;
};

RenderSettings.prototype.getChildTransform = function(renderSettingsOfChild) {
	var t = this.transform.clone();
	var translation = {x: 0, y: 0};
	
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