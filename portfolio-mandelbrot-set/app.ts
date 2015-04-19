/// <reference path="Mandelbrot.ts" />
/// <reference path="Types/RenderPoint.ts" />

// thanks to:
// basic tutorial: http://www.semurjengkol.com/drawing-mandelbrot-set-on-html5-graphics-canvas/
// optimizations: https://github.com/cslarsen/mandelbrot-js
// mathematics: https://github.com/oliver-spryn/College/tree/master/COMP%20322/Mandelbrot%20Set%20-%20Project%203
// color smoothing: http://linas.org/art-gallery/escape/smooth.html

window.onload = function() {
// resize the canvas to the window
	var ID: HTMLElement = document.getElementById("mandelbrot");
	ID.setAttribute("height", "480px");
	ID.setAttribute("width", window.outerWidth + "px");

// some cool points on the Mandelbrot set
	var pts: RenderPoint[] = new Array<RenderPoint>();
	pts.push(new RenderPoint(-1.790038, 0, 120000, 9000));
	pts.push(new RenderPoint(-1, 0, 5, 250));
	pts.push(new RenderPoint(-0.5623, -0.64283, 15000, 3000));

	var i: number = Math.floor(Math.random() * pts.length);
	var rand: RenderPoint = pts[i];

// draw the Mandelbrot set
	setTimeout(function() {
		var m: Mandelbrot = new Mandelbrot("mandelbrot");
		m.setCenter(rand.X, rand.Y, rand.Zoom);
		m.setIterations(rand.Iterations);
		m.draw();
	}, 1000);
};