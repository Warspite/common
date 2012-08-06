var Animator = {
	imgAnimate: function(node) {
		node.imgSetPaused = function(paused) {
			this.animationSettings.running = !paused;
		};

		node.imgTogglePause = function() {
			this.animationSettings.running = !this.animationSettings.running;
		};

		node.imgStart = function() {
			this.animationSettings.elapsedTime = 0;
			this.animationSettings.frameTop = 0;
			this.animationSettings.running = true;
		};

		node.imgStop = function() {
			this.animationSettings.elapsedTime = 0;
			this.animationSettings.frameTop = 0;
			this.animationSettings.running = false;
		};

		node.imgAnimationUpdate = function(self, tickInterval) {
			if(!self.animationSettings.running)
				return;
			
			var elapsedFrames = Math.floor(self.animationSettings.elapsedTime / self.animationSettings.frameInterval);
			var numberOfFrames = self.renderSettings.getImage().height / self.animationSettings.frameHeight;
			
			if( self.animationSettings.animationEndBehavior == AnimationEndBehavior.LOOP ) {
				self.animationSettings.frameTop = self.animationSettings.frameHeight * (elapsedFrames % numberOfFrames);
			}
			else if( self.animationSettings.animationEndBehavior == AnimationEndBehavior.FREEZE ) {
				if(elapsedFrames < numberOfFrames)
					self.animationSettings.frameTop = self.animationSettings.frameHeight * elapsedFrames;
				else
					self.animationSettings.frameTop = self.animationSettings.frameHeight * (numberOfFrames - 1);
			}
			else {
				throw "Unrecognized animationEndBehavior '" + self.animationSettings.animationEndBehavior.name + "' encountered.";
			}
			
			self.animationSettings.elapsedTime += tickInterval;
		};

		node.animationSettings = new AnimationSettings();
		node.extraTickEffects.push(node.imgAnimationUpdate);
	}
}
