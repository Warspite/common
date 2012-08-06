var Animator = {
	imgAnimate: function(node) {
		node.imgSetPaused = function(paused) {
			this.animationSettings.imgRunning = !paused;
		};
	
		node.imgTogglePause = function() {
			this.animationSettings.imgRunning = !this.animationSettings.imgRunning;
		};
	
		node.imgStart = function() {
			this.animationSettings.imgElapsedTime = 0;
			this.animationSettings.frameTop = 0;
			this.animationSettings.imgRunning = true;
		};
	
		node.imgStop = function() {
			this.animationSettings.imgElapsedTime = 0;
			this.animationSettings.frameTop = 0;
			this.animationSettings.imgRunning = false;
		};

		node.imgAnimationUpdate = function(self, tickInterval) {
			if(!self.animationSettings.imgRunning)
				return;
			
			var elapsedFrames = Math.floor(self.animationSettings.imgElapsedTime / (1000 * self.animationSettings.frameInterval));
			var numberOfFrames = self.renderSettings.getImage().height / self.animationSettings.frameHeight;
			
			if( self.animationSettings.imgAnimationEndBehavior == AnimationEndBehavior.LOOP ) {
				self.animationSettings.frameTop = self.animationSettings.frameHeight * (elapsedFrames % numberOfFrames);
			}
			else if( self.animationSettings.imgAnimationEndBehavior == AnimationEndBehavior.FREEZE ) {
				if(elapsedFrames < numberOfFrames)
					self.animationSettings.frameTop = self.animationSettings.frameHeight * elapsedFrames;
				else
					self.animationSettings.frameTop = self.animationSettings.frameHeight * (numberOfFrames - 1);
			}
			else {
				throw "Unrecognized imgAnimationEndBehavior '" + self.animationSettings.imgAnimationEndBehavior.name + "' encountered.";
			}
			
			self.animationSettings.imgElapsedTime += tickInterval;
		};

		if(!node.animationSettings)
			node.animationSettings = new AnimationSettings();
		
		node.extraTickEffects.push(node.imgAnimationUpdate);
	},
	
	spatialAnimate: function(node) {
		node.spatialSetPaused = function(paused) {
			this.animationSettings.spatialRunning = !paused;
		};
	
		node.spatialTogglePause = function() {
			this.animationSettings.spatialRunning = !this.animationSettings.spatialRunning;
		};
		
		node.spatialAnimationUpdate = function(self, tickInterval) {
			if(!self.animationSettings.spatialRunning)
				return;
			
			if(self.prepareSpatialAnimation)
				self.prepareSpatialAnimation(self, tickInterval);
			
			self.renderSettings.position.x += self.animationSettings.translationSpeed.x * tickInterval * 0.001; 
			self.renderSettings.position.y += self.animationSettings.translationSpeed.y * tickInterval * 0.001; 
			self.renderSettings.scale.x += self.animationSettings.scalingSpeed.x * tickInterval * 0.001; 
			self.renderSettings.scale.y += self.animationSettings.scalingSpeed.y * tickInterval * 0.001; 
			self.renderSettings.size.width += self.animationSettings.sizingSpeed.width * tickInterval * 0.001; 
			self.renderSettings.size.height += self.animationSettings.sizingSpeed.height * tickInterval * 0.001; 
			self.renderSettings.angle += self.animationSettings.rotationSpeed * tickInterval * 0.001; 
		};

		if(!node.animationSettings)
			node.animationSettings = new AnimationSettings();
		
		node.extraTickEffects.push(node.spatialAnimationUpdate);
	}
}
