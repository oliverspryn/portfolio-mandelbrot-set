/// <reference path="Mandelbrot.ts" />
/// <reference path="Types/RenderPoint.ts" />

// thanks to:
// basic tutorial: http://www.semurjengkol.com/drawing-mandelbrot-set-on-html5-graphics-canvas/
// optimizations: https://github.com/cslarsen/mandelbrot-js
// mathematics: https://github.com/oliver-spryn/College/tree/master/COMP%20322/Mandelbrot%20Set%20-%20Project%203
// color smoothing: http://linas.org/art-gallery/escape/smooth.html

// configuration
	var canvasID: string = "mandelbrot";
	var runResizer: boolean = true;

// some cool points on the Mandelbrot set
	var pts: RenderPoint[] = new Array<RenderPoint>();
	pts.push(new RenderPoint(-1.790038, 0, 120000, 9000));
	pts.push(new RenderPoint(-1, 0, 5, 250));
	pts.push(new RenderPoint(-0.5623, -0.64283, 15000, 3000));

	var i: number = Math.floor(Math.random() * pts.length);
	var rand: RenderPoint = pts[i];

// mandelbrot renderer
	function render(time: number): void {
		"use strict";

	// prevent race conditions
		if (!runResizer) {
			return;
		} else {
			runResizer = false;
		}

	// resize the canvas to the window
		var ID: HTMLElement = document.getElementById(canvasID);
		ID.setAttribute("width", window.outerWidth + "px");

	// draw the Mandelbrot set
		setTimeout(function() {
		// did the canvas size change after all that waiting time?
			var cwidth: string = <string>ID.getAttribute("width").replace(/[a-zA-Z]/g, "");
			var width: string = window.outerWidth + "px";
			var wwidth: string = width.replace(/[a-zA-Z]/g, "");

			if (cwidth !== wwidth) {
				runResizer = true;
				render(time);
				return;
			}

		// draw the set
			var m: Mandelbrot = new Mandelbrot(canvasID);
			m.setCenter(rand.X, rand.Y, rand.Zoom);
			m.setIterations(rand.Iterations);
			m.setCallback(function() {
				runResizer = true;
				cwidth = <string>ID.getAttribute("width").replace(/[a-zA-Z]/g, "");
				width = window.outerWidth + "px";
				wwidth = width.replace(/[a-zA-Z]/g, "");

			// did the canvas size change after all that rendering time?
				if (cwidth !== wwidth) {
					render(time);
				}
			});
			m.draw();
		}, time);
	}

// render the Mandelbrot set on window load and resize
	window.onload = function() {
		render(1000);
	};

	window.onresize = function() {
		render(3000);
	};