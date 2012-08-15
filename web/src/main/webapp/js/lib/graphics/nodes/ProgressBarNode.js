var ProgressBarNode = function(textString)
{
	mixin(new DynamicNode(), this);
	mixin(new EventDispatcher(), this);
	
	this.inProgressMeterColor = "#8aa1ec";
	this.inProgressBorderColor = "#e5e5f0";
	this.completeMeterColor = "#0bc129";
	this.completeBorderColor = "#f1c823";
	this.completeTextString = textString;
	
	this.complete = false;
	
	this.renderSettings.padding = 1;
	this.renderSettings.graphicsType = GraphicsType.RECT;
	this.renderSettings.size = {width: 200, height: 22};
	
	this.progress = 0.0;
	this.targetProgress = 1.0;

	this.innerBackground = new DynamicNode();
	this.innerBackground.renderSettings.graphicsType = GraphicsType.RECT;
	this.innerBackground.renderSettings.color = "#252525";
	this.innerBackground.renderSettings.sizing = {width: Sizing.PARENT, height: Sizing.PARENT};
	this.innerBackground.renderSettings.padding = 2;
	
	this.meter = new DynamicNode();
	this.meter.renderSettings.graphicsType = GraphicsType.RECT;
	this.meter.renderSettings.sizing = {width: Sizing.PARENT, height: Sizing.PARENT};
	this.meter.renderSettings.relativeSize = {width: 0.0, height: 1.0};
	this.meter.renderSettings.padding = 2;
	
	this.text = new TextNode(textString);
	this.text.renderSettings.sizing = {width: Sizing.PARENT, height: Sizing.PARENT};
	this.text.renderSettings.textAnchor = Direction.CENTER;
	
	this.innerBackground.addChild(this.meter);
	this.innerBackground.addChild(this.text);
	this.addChild(this.innerBackground);

	this.extraTickEffects.push(this.updateProgress);
};

ProgressBarNode.prototype.updateProgress = function(self, tickInterval) {
	if( self.complete )
		return;
	
	var relativeProgress = Math.min(1.0, Math.max(0.0, self.progress/self.targetProgress));
	self.meter.renderSettings.relativeSize.width = relativeProgress;
	
	if( relativeProgress >= 1.0 ) {
		self.complete = true;
		self.renderSettings.color = self.completeBorderColor;
		self.meter.renderSettings.color = self.completeMeterColor;
		self.text.setText(self.completeTextString);
		
		self.dispatchEvent(EventType.PROGRESS_COMPLETE);
	}
	else {
		self.renderSettings.color = self.inProgressBorderColor;
		self.meter.renderSettings.color = self.inProgressMeterColor;
	}
};
