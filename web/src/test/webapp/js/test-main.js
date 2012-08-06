var Paths = {
	IMAGE_ROOT: "images/"
}

function include(file) {
	if (document.createElement && document.getElementsByTagName) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', '../../main/webapp/js/' + file);
		head.appendChild(script);
	}
}
	
include("lib/Include.js");

window.onload = function(event) {
	var canvas = document.getElementById('viewportCanvas');
	var surface = new RenderSurface(canvas, {x: 25, y: 25});
	var renderer = new Renderer(surface, "#303030");
	var mouse = new Mouse(canvas, renderer);
	var keyboard = new Keyboard(renderer);
	
	keyboard.addEventListener(renderer);

	var ticker = new Ticker(25);
	ticker.addListener(mouse);
	ticker.addListener(keyboard);
	ticker.addListener(renderer);
	
	
	var topLeftStackPanel = new StackPanel();
	topLeftStackPanel.renderSettings.graphicsType = GraphicsType.RECT;
	topLeftStackPanel.renderSettings.color = "#00ffff";
	topLeftStackPanel.renderSettings.padding = 1;
	topLeftStackPanel.renderSettings.sizing = {width: Sizing.CHILDREN, height: Sizing.CHILDREN};

	var spChildOne = new StackPanel();
	spChildOne.renderSettings.size = {width: 32, height: 40};
	spChildOne.renderSettings.graphicsType = GraphicsType.RECT;
	spChildOne.renderSettings.color = "#202020";
	
	var spChildTwo = new StackPanel();
	spChildTwo.renderSettings.size = {width: 32, height: 40};
	spChildTwo.renderSettings.graphicsType = GraphicsType.RECT;
	spChildTwo.renderSettings.color = "#404040";
	spChildTwo.orientation = Orientation.HORIZONTAL;
	spChildTwo.renderSettings.interChildPadding = 5;
	
	var spGrandChildOne = new StackPanel();
	spGrandChildOne.renderSettings.size = {width: 40, height: 32};
	spGrandChildOne.renderSettings.graphicsType = GraphicsType.RECT;
	spGrandChildOne.renderSettings.color = "#606060";
	
	var spGrandChildTwo = new StackPanel();
	spGrandChildTwo.renderSettings.size = {width: 40, height: 32};
	spGrandChildTwo.renderSettings.graphicsType = GraphicsType.RECT;
	spGrandChildTwo.renderSettings.color = "#808080";
	
	var greenBox = new RenderedNode();
	greenBox.renderSettings.size = {width: 64, height: 64};
	greenBox.renderSettings.setAnchor(Anchor.CENTER, Anchor.TOP);
	greenBox.renderSettings.setOrigin(Origin.CENTER, Origin.TOP);
	greenBox.renderSettings.graphicsType = GraphicsType.RECT;
	greenBox.renderSettings.color = "#00ff00";
	mixin(new InputAwareNode(), greenBox);
	greenBox.inputSettings.mouseVisible = true;
	greenBox.inputSettings.mouseEnter = function(coords) { console.log("Mouse entered green box!") };
	greenBox.inputSettings.mouseExit = function(coords) { console.log("Mouse exited green box!") };
	greenBox.inputSettings.mouseDown = function(coords) { console.log("Mouse is down in green box!") };
	greenBox.inputSettings.mousePressed = function(coords) { console.log("Mouse clicked on green box!") };
	greenBox.inputSettings.mouseReleased = function(coords) { console.log("Mouse released on green box!") };
	greenBox.inputSettings.mouseDrag = function(coords, delta) { console.log("Mouse is dragging green box (" + delta.x + "," + delta.y + ")!")};
	greenBox.inputSettings.mouseCursor = "pointer";
	greenBox.addEventHandler(EventType.KEY_HELD, function(self, keyboard, event) { 
		if( event.value == Key.Z )
			console.log("Green box says you're holding down Z. And shift too? " + keyboard.isKeyDown(Key.SHIFT));
	});

	var centerWindow = new Window("A fancy window with a rather long title");
	centerWindow.setDraggable(true);
	centerWindow.setClosable(true);
	
	var windowContents = new StackPanel();
	windowContents.renderSettings.sizing = {width: Sizing.PARENT, height: Sizing.CHILDREN};
	windowContents.renderSettings.padding = 5;
	windowContents.renderSettings.interChildPadding = 5;
	
	var windowChildOne = new ButtonNode(function() { windowChildOne.imgTogglePause(); });
	Animator.imgAnimate(windowChildOne);
	windowChildOne.renderSettings.size = {width: 96, height: 96};
	windowChildOne.renderSettings.setAnchor(Anchor.CENTER, Anchor.TOP);
	windowChildOne.renderSettings.setOrigin(Origin.CENTER, Origin.TOP);
	windowChildOne.renderSettings.graphicsType = GraphicsType.ANIMATION;
	windowChildOne.renderSettings.image = "animation1.png";
	windowChildOne.animationSettings.frameHeight = 8;
	windowChildOne.animationSettings.frameInterval = 0.15;
	windowChildOne.animationSettings.imgAnimationEndBehavior = AnimationEndBehavior.LOOP;
	
	var windowChildTwo = new ButtonNode(function() { windowChildTwo.spatialTogglePause(); });
	Animator.spatialAnimate(windowChildTwo);
	windowChildTwo.renderSettings.position.y = 48;
	windowChildTwo.renderSettings.size = {width: 96, height: 96};
	windowChildTwo.renderSettings.setAnchor(Anchor.CENTER, Anchor.TOP);
	windowChildTwo.renderSettings.setOrigin(Origin.CENTER, Origin.CENTER);
	windowChildTwo.renderSettings.graphicsType = GraphicsType.RECT;
	windowChildTwo.renderSettings.color = "#50a000";
	windowChildTwo.animationSettings.scalingSpeed = {x: -0.2, y: -0.2};
	windowChildTwo.prepareSpatialAnimation = function(self, tickInterval) {
		if(self.renderSettings.scale.x < 0.1)
			self.animationSettings.scalingSpeed = {x: 0.2, y: 0.2}; 

		if(self.renderSettings.scale.x > 1.0)
			self.animationSettings.scalingSpeed = {x: -0.2, y: -0.2}; 
	};
	windowChildTwo.addEventHandler(EventType.KEY_DOWN, function(self, keyboard, event) {
		if(event.value == Key.LEFT)
			windowChildTwo.animationSettings.rotationSpeed -= 0.1;

		if(event.value == Key.RIGHT)
			windowChildTwo.animationSettings.rotationSpeed += 0.1;
});
	var windowGrandChildOne = new ButtonNode(function() { windowGrandChildOne.imgTogglePause(); });
	Animator.imgAnimate(windowGrandChildOne);
	windowGrandChildOne.renderSettings.size = {width: 32, height: 32};
	windowGrandChildOne.renderSettings.graphicsType = GraphicsType.ANIMATION;
	windowGrandChildOne.renderSettings.image = "animation1.png";
	windowGrandChildOne.animationSettings.frameHeight = 8;
	windowGrandChildOne.animationSettings.frameInterval = 0.15;
	windowGrandChildOne.animationSettings.imgAnimationEndBehavior = AnimationEndBehavior.LOOP;
	
	spChildTwo.addChild(spGrandChildOne);
	spChildTwo.addChild(spGrandChildTwo);
	topLeftStackPanel.addChild(spChildOne);
	topLeftStackPanel.addChild(spChildTwo);
	renderer.sceneRoot.addChild(topLeftStackPanel);
	renderer.sceneRoot.addChild(greenBox);
	
	windowChildTwo.addChild(windowGrandChildOne);
	windowContents.addChild(windowChildOne);
	windowContents.addChild(windowChildTwo);
	centerWindow.addChild(windowContents);
	renderer.guiRoot.addChild(centerWindow);
};

