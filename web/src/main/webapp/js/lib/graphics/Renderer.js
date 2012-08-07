var Renderer = function(surface, voidColor)
{
	mixin(new RenderedNode(null), this);
	mixin(new InputAwareNode(), this);
	
	this.inputSettings.mouseVisible = true;
	this.surface = surface;
	this.viewportParameters = {x: 0, y: 0, scale: 1};
	this.voidColor = voidColor || "#000000";
	
	this.tickSelf = function(tickInterval) {
		this.surface.ctx.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
		this.surface.ctx.fillStyle = this.voidColor;
		this.surface.ctx.globalAlpha = 1.0;
		this.surface.ctx.fillRect(-1, -1, this.surface.width + 1, this.surface.height + 1);
		
		this.render(this.surface);
	};
	
	this.renderSelf = function(surface) {};
	
	this.sceneRoot = new ViewportNode();
	this.guiRoot = new RenderedNode();
	this.tooltip = new TooltipNode();
	
	this.sceneRoot.zIndex = 0;
	this.guiRoot.zIndex = 1;
	this.tooltip.zIndex = 2;
	
	this.addChild(this.sceneRoot);
	this.addChild(this.guiRoot);
	this.addChild(this.tooltip);

	var self = this;
	this.surface.addResizeListener(function(width, height) {
		self.renderSettings.size = {width: width, height: height};
		self.guiRoot.renderSettings.size = {width: width, height: height};
	});
	
	this.addEventHandler(EventType.MOUSE_DRAG, function(self, mouse, event) { 
		self.sceneRoot.translateViewport({x: -event.value.delta.x, y: -event.value.delta.y});
	});

	this.addEventHandler(EventType.TOOLTIP_DISPLAY_REQUESTED, function(self, source, event) { 
		self.tooltip.display(event.value.text, {x: event.value.x, y: event.value.y});
	});

	this.addEventHandler(EventType.TOOLTIP_REMOVAL_REQUESTED, function(self, source, event) { 
		self.tooltip.hide();
	});
};
