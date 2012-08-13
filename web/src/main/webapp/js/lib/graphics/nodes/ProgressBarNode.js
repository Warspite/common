var ProgressBarNode = function()
{
	mixin(new DynamicNode(), this);
	
	this.inProgressMeterColor = "#8aa1ec";
	this.inProgressBorderColor = "#e5e5f0";
	this.completeMeterColor = "#0bc129";
	this.completeBorderColor = "#f1c823";
	
	this.renderSettings.padding = 1;
	this.renderSettings.graphicsType = GraphicsType.RECT;
	
	this.progress = 0.0;
	this.targetProgress = 1.0;

	this.innerBackground = new DynamicNode();
	this.innerBackground.renderSettings.graphicsType = GraphicsType.RECT;
	this.innerBackground.renderSettings.color = "#252525";
	this.innerBackground.renderSettings.sizing = {width: Sizing.PARENT, height: Sizing.PARENT};
	this.innerBackground.renderSettings.padding = 2;
	
	this.meter = new DynamicNode();
	this.meter = new DynamicNode();
	this.meter.renderSettings.graphicsType = GraphicsType.RECT;
	this.meter.renderSettings.sizing = {width: Sizing.PARENT, height: Sizing.PARENT};
	this.meter.renderSettings.relativeSize = {width: 0.6, height: 1.0};
	this.meter.renderSettings.padding = 2;
	
	this.innerBackground.addChild(this.meter);
	this.addChild(this.innerBackground);

	this.extraTickEffects.push(this.updateProgress);
};

ProgressBarNode.prototype.updateProgress = function(self, tickInterval) {
	var relativeProgress = Math.min(1.0, Math.max(0.0, self.progress/self.targetProgress));
	self.meter.renderSettings.relativeSize.width = relativeProgress;
	
	if(relativeProgress < 1.0) {
		self.renderSettings.color = self.inProgressBorderColor;
		self.meter.renderSettings.color = self.inProgressMeterColor;
	}
	else {
		self.renderSettings.color = self.completeBorderColor;
		self.meter.renderSettings.color = self.completeMeterColor;
	}
};
