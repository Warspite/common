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
	topLeftStackPanel.renderSettings.graphicsType = GraphicsType.RECT;
	topLeftStackPanel.renderSettings.color = "#00ffff";
	topLeftStackPanel.renderSettings.padding = 1;
	topLeftStackPanel.renderSettings.sizing = {width: Sizing.CHILDREN, height: Sizing.CHILDREN};

	var spChildOne = new StackPanel();
	spChildOne.renderSettings.alterPosition(0, 0, 32, 40);
	spChildOne.renderSettings.graphicsType = GraphicsType.RECT;
	spChildOne.renderSettings.color = "#202020";
	
	var spChildTwo = new StackPanel();
	spChildTwo.renderSettings.alterPosition(0, 0, 32, 40);
	spChildTwo.renderSettings.graphicsType = GraphicsType.RECT;
	spChildTwo.renderSettings.color = "#404040";
	spChildTwo.orientation = Orientation.HORIZONTAL;
	spChildTwo.renderSettings.interChildPadding = 5;
	
	var spGrandChildOne = new StackPanel();
	spGrandChildOne.renderSettings.alterPosition(0, 0, 40, 32);
	spGrandChildOne.renderSettings.graphicsType = GraphicsType.RECT;
	spGrandChildOne.renderSettings.color = "#606060";
	
	var spGrandChildTwo = new StackPanel();
	spGrandChildTwo.renderSettings.alterPosition(0, 0, 40, 32);
	spGrandChildTwo.renderSettings.graphicsType = GraphicsType.RECT;
	spGrandChildTwo.renderSettings.color = "#808080";
	
	var greenBox = new RenderedNode();
	greenBox.renderSettings.alterPosition(0, 0, 64, 64);
	greenBox.renderSettings.alterAnchor(Anchor.CENTER, Anchor.TOP);
	greenBox.renderSettings.alterOrigin(Origin.CENTER, Origin.TOP);
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

	var centerWindow = new Window("A fancy window with a rather long title");
	centerWindow.setDraggable(true);
	
	spChildTwo.addChild(spGrandChildOne);
	spChildTwo.addChild(spGrandChildTwo);
	topLeftStackPanel.addChild(spChildOne);
	topLeftStackPanel.addChild(spChildTwo);
	renderer.sceneRoot.addChild(topLeftStackPanel);
	renderer.sceneRoot.addChild(greenBox);
	
	renderer.guiRoot.addChild(centerWindow);
};

