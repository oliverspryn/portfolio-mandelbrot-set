/// <reference path="Mandelbrot.ts" />

window.onload = function() {
	setTimeout(function() {
		var m: Mandelbrot = new Mandelbrot("mandelbrot");
		m.setBounds(-2.5, 1.5, -2, 2);
		m.setIterations(1024); //18
		m.draw();
	}, 3000);
};