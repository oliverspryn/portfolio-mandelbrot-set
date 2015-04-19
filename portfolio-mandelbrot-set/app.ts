/// <reference path="Mandelbrot.ts" />

window.onload = function() {
// resize the canvas to the window
	var ID: HTMLElement = document.getElementById("mandelbrot");
	ID.setAttribute("height", "640px");
	ID.setAttribute("width", window.outerWidth + "px");

// draw the Mandelbrot set
	setTimeout(function() {
		var m: Mandelbrot = new Mandelbrot("mandelbrot");
		m.setCenter(-1.790038, 0, 85000);
		m.setIterations(7500);
		m.draw();
	}, 1000);
};