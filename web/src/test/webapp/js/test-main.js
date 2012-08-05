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

	var ticker = new Ticker(25);
	ticker.addListener(mouse);
	ticker.addListener(renderer);
	
	
	var topLeftStackPanel = new StackPanel();
	topLeftStackPanel.renderSettings.alterPosition(0, 0, 64, 64);
	topLeftStackPanel.renderSettings.graphicsType = GraphicsType.RECT;
	topLeftStackPanel.renderSettings.content = "#00ffff";
	topLeftStackPanel.renderSettings.padding = 1;
	topLeftStackPanel.renderSettings.sizing = Sizing.CHILDREN;

	var spChildOne = new StackPanel();
	spChildOne.renderSettings.alterPosition(0, 0, 32, 40);
	spChildOne.renderSettings.graphicsType = GraphicsType.RECT;
	spChildOne.renderSettings.content = "#202020";
	
	var spChildTwo = new StackPanel();
	spChildTwo.renderSettings.alterPosition(0, 0, 32, 40);
	spChildTwo.renderSettings.graphicsType = GraphicsType.RECT;
	spChildTwo.renderSettings.content = "#404040";
	spChildTwo.orientation = Orientation.HORIZONTAL;
	spChildTwo.renderSettings.interChildPadding = 5;
	
	var spGrandChildOne = new StackPanel();
	spGrandChildOne.renderSettings.alterPosition(0, 0, 40, 32);
	spGrandChildOne.renderSettings.graphicsType = GraphicsType.RECT;
	spGrandChildOne.renderSettings.content = "#606060";
	
	var spGrandChildTwo = new StackPanel();
	spGrandChildTwo.renderSettings.alterPosition(0, 0, 40, 32);
	spGrandChildTwo.renderSettings.graphicsType = GraphicsType.RECT;
	spGrandChildTwo.renderSettings.content = "#808080";
	
	var greenBox = new RenderedNode();
	greenBox.renderSettings.alterPosition(0, 0, 64, 64);
	greenBox.renderSettings.alterAnchor(Anchor.CENTER, Anchor.TOP);
	greenBox.renderSettings.alterOrigin(Origin.CENTER, Origin.TOP);
	greenBox.renderSettings.graphicsType = GraphicsType.RECT;
	greenBox.renderSettings.content = "#00ff00";
	mixin(new InputAwareNode(), greenBox);
	greenBox.inputSettings.mouseVisible = true;
	greenBox.inputSettings.mouseEnter = function(coords) { console.log("Mouse entered green box!") };
	greenBox.inputSettings.mouseExit = function(coords) { console.log("Mouse exited green box!") };
	greenBox.inputSettings.mouseDown = function(coords) { console.log("Mouse is down in green box!") };
	greenBox.inputSettings.mousePressed = function(coords) { console.log("Mouse clicked on green box!") };
	greenBox.inputSettings.mouseReleased = function(coords) { console.log("Mouse released on green box!") };
	greenBox.inputSettings.mouseDrag = function(coords, delta) { console.log("Mouse is dragging green box (" + delta.x + "," + delta.y + ")!")};
	greenBox.inputSettings.mouseCursor = "pointer";

	var centerWindow = new StackPanel();
	centerWindow.renderSettings.alterPosition(0, 0, 128, 200);
	centerWindow.renderSettings.alterAnchor(Anchor.CENTER, Anchor.CENTER);
	centerWindow.renderSettings.alterOrigin(Origin.CENTER, Origin.CENTER);
	centerWindow.renderSettings.graphicsType = GraphicsType.RECT;
	centerWindow.renderSettings.content = "#7000d0";
	
	var centerWindowBar = new DraggableNode();
	centerWindowBar.renderSettings.alterPosition(0, 0, 128, 40);
	centerWindowBar.renderSettings.alterAnchor(Anchor.LEFT, Anchor.TOP);
	centerWindowBar.renderSettings.graphicsType = GraphicsType.RECT;
	centerWindowBar.renderSettings.content = "#5000a0";
	centerWindowBar.inputSettings.dragTarget = centerWindow;
	
	spChildTwo.addChild(spGrandChildOne);
	spChildTwo.addChild(spGrandChildTwo);
	topLeftStackPanel.addChild(spChildOne);
	topLeftStackPanel.addChild(spChildTwo);
	renderer.sceneRoot.addChild(topLeftStackPanel);
	renderer.sceneRoot.addChild(greenBox);
	
	centerWindow.addChild(centerWindowBar);
	renderer.sceneRoot.addChild(centerWindow);
};

