var TextNode = function(text)
{
	mixin(new DynamicNode(), this);
	this.setText(text);
	this.renderSettings.sizing.height = Sizing.TEXT;
	this.renderSettings.textAnchor = Anchor.LEFT;
	this.renderSettings.font = "10px Arial";
	this.renderSettings.textColor = "#e0e0e0";
	this.renderSettings.lineHeight = 11;
	this.renderSettings.textPadding = 3;
	this.maximumNumberOfLines = null;
	
	var self = this;
	this.customSelfRenderEffect = function(surface, boundaries) {
		surface.ctx.fillStyle = self.renderSettings.textColor;
		
		var textArray = self.getBrokenText(surface);
		var actualNumberOfLines = textArray.length;
		if(self.maxNumberOfLines != null && actualNumberOfLines > self.maxNumberOfLines)
			actualNumberOfLines = self.maxNumberOfLines;
			
		if(self.renderSettings.sizing.height == Sizing.TEXT) {
			self.renderSettings.size.height = actualNumberOfLines * self.renderSettings.lineHeight + self.renderSettings.textPadding;
		}
		
		var verticalOffset = 0;
		for(i = 0; i < actualNumberOfLines; i++) {
			verticalOffset += self.renderSettings.lineHeight;

			if(verticalOffset + self.renderSettings.textPadding > self.renderSettings.size.height)
				return;

			var leftEdge = boundaries.left + self.renderSettings.textPadding;
			
			if(self.renderSettings.textAnchor == Anchor.CENTER)
				leftEdge = (boundaries.right + boundaries.left - textArray[i].width) * 0.5;  
			else if(self.renderSettings.textAnchor == Anchor.RIGHT)
				leftEdge = boundaries.right - self.renderSettings.textPadding - textArray[i].width; 
			
			surface.ctx.fillText(textArray[i].text, leftEdge, boundaries.top + verticalOffset);
		}
	};
};

TextNode.prototype.setText = function(text) {
	this.text = text;
	this.brokenText = null;
};

TextNode.prototype.getBrokenText = function(surface) {
	if( this.nodeWidthAtLastTextBreaking != this.renderSettings.size.width )
		this.brokenText = null;
	
	if(this.brokenText == null)
		this.brokenText = this.breakText(this.text, surface);
	
	return this.brokenText;
};

TextNode.prototype.breakText = function(text, surface) {
	var broken = new Array(0);
	
	var explicitTextLines = text.split('\n');
	
	var dynamicNodeWidth = 0;
	
	for(i in explicitTextLines) {
		if( this.renderSettings.sizing.width == Sizing.TEXT ) {
			broken.push({text: explicitTextLines[i], width: this.measureLineWidth(surface, explicitTextLines[i])});
			var lineWidth = this.measureLineWidth(surface, explicitTextLines[i]);
			if(lineWidth > dynamicNodeWidth)
				dynamicNodeWidth = lineWidth;
		}
		else {
			this.pushImplicitTextLines(explicitTextLines[i], broken, surface);
		}
	}
	
	if(this.renderSettings.sizing.width == Sizing.TEXT)
		this.renderSettings.size.width = dynamicNodeWidth;
	
	this.nodeWidthAtLastTextBreaking = this.renderSettings.size.width;
	
	return broken;
};

TextNode.prototype.pushImplicitTextLines = function(line, pushTarget, surface) {
	var words = line.split(' ');

	var lastAcceptedCandidateString = null;
	for(i in words) {
		if(lastAcceptedCandidateString == null) {
			lastAcceptedCandidateString = words[i];
		}
		else {
			var candidateString = lastAcceptedCandidateString + " " + words[i];
			var lineWidth = this.measureLineWidth(surface, candidateString);
			if( lineWidth > this.renderSettings.size.width ) {
				pushTarget.push({text: lastAcceptedCandidateString, width: lineWidth});
				lastAcceptedCandidateString = words[i];
			}
			else {
				lastAcceptedCandidateString = candidateString;
			}
		}
	}
	
	if( lastAcceptedCandidateString != null )
		pushTarget.push({text: lastAcceptedCandidateString, width: this.measureLineWidth(surface, lastAcceptedCandidateString)});
};

TextNode.prototype.measureLineWidth = function(surface, line) {
	return surface.ctx.measureText(line).width * 1.1 + this.renderSettings.textPadding;
};