var ViewportNode = function()
{
	mixin(new RenderedNode(), this);
	
	this.maxScale = 5;
	this.minScale = 0.03;
	
	this.renderSettings.setAnchor(Direction.CENTER, Direction.CENTER);
	this.renderSettings.focus = {x: 0, y: 0};

	this.addEventHandler(EventType.KEY_DOWN, function(self, keyboard, event) { 
		var scalingFactor = 1 + 0.005 * event.value.elapsedTime; 
		if( event.value.key == Key.KP_MINUS ) {
			self.scaleViewport(1/scalingFactor);
		}

		if( event.value.key == Key.KP_PLUS ) {
			self.scaleViewport(scalingFactor);
		}

		if( event.value.key == Key.LEFT )
			self.translateViewport({x: -1.0 * event.value.elapsedTime, y: 0});

		if( event.value.key == Key.RIGHT )
			self.translateViewport({x: 1.0 * event.value.elapsedTime, y: 0});

		if( event.value.key == Key.UP )
			self.translateViewport({x: 0, y: -1.0 * event.value.elapsedTime});

		if( event.value.key == Key.DOWN )
			self.translateViewport({x: 0, y: 1.0 * event.value.elapsedTime});
	});

	this.addEventHandler(EventType.MOUSE_WHEEL, function(self, mouse, event) {
		self.scaleViewport(1 + event.value * 0.0015)
	});

	this.renderSettings.postTransformEffect = function(self, t) {
		t.translate(-self.focus.x, -self.focus.y);
	};
};

ViewportNode.prototype.scaleViewport = function(scalingFactor) {
	var newScaleX = this.renderSettings.scale.x * scalingFactor;
	var newScaleY = this.renderSettings.scale.y * scalingFactor;
	
	if(newScaleX > this.maxScale)
		newScaleX = this.maxScale;
	
	if(newScaleX < this.minScale)
		newScaleX = this.minScale;
	
	if(newScaleY > this.maxScale)
		newScaleY = this.maxScale;
	
	if(newScaleY < this.minScale)
		newScaleY = this.minScale;
	
	this.renderSettings.scale.x = newScaleX;
	this.renderSettings.scale.y = newScaleY;
};

ViewportNode.prototype.translateViewport = function(delta) {
	this.renderSettings.focus.x += delta.x / this.renderSettings.scale.x;
	this.renderSettings.focus.y += delta.y / this.renderSettings.scale.y;
};

ViewportNode.prototype.reset = function() {
	this.renderSettings.focus = {x: 0, y: 0};
	this.renderSettings.scale = {x: 1, y: 1};
};