function include(file) {
	if (document.createElement && document.getElementsByTagName) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', '../../main/webapp/js/' + file);
		head.appendChild(script);
	}
}
	
include("lib/graphics/Renderer.js");
include("lib/graphics/RenderSurface.js");
include("lib/graphics/Transform.js");

include("lib/utilities/Ticker.js");


window.onload = function(event) {
	var canvas = document.getElementById('viewportCanvas');
	var surface = new RenderSurface(canvas);
	var renderer = new Renderer(surface);

	var ticker = new Ticker(25);
	ticker.addListener(renderer);
};

