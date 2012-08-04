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

	var ticker = new Ticker(25);
	ticker.addListener(renderer);
	
	
	var topLeftStackPanel = new StackPanel();
	topLeftStackPanel.renderSettings.alterPosition(0, 0, 64, 64);
	topLeftStackPanel.renderSettings.graphicsType = GraphicsType.RECT;
	topLeftStackPanel.renderSettings.content = "#00ffff";
	topLeftStackPanel.renderSettings.padding = 1;

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
	
	var bottomRightBox = new RenderedNode();
	bottomRightBox.renderSettings.alterPosition(32, 32, 64, 64);
	bottomRightBox.renderSettings.alterAnchor(Anchor.RIGHT, Anchor.BOTTOM);
	bottomRightBox.renderSettings.alterOrigin(Origin.RIGHT, Origin.BOTTOM);
	bottomRightBox.renderSettings.graphicsType = GraphicsType.RECT;
	bottomRightBox.renderSettings.content = "#00ff00";

	spChildTwo.addChild(spGrandChildOne);
	spChildTwo.addChild(spGrandChildTwo);
	topLeftStackPanel.addChild(spChildOne);
	topLeftStackPanel.addChild(spChildTwo);
	renderer.sceneRoot.addChild(topLeftStackPanel);
	renderer.sceneRoot.addChild(bottomRightBox);
};

