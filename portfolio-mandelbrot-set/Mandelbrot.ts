/// <reference path="MandelbrotConfig.ts" />
/// <reference path="Types/BoundsLR.ts" />
/// <reference path="Types/BoundsTB.ts" />
/// <reference path="Types/Complex.ts" />
/// <reference path="Types/MandelbrotBounds.ts" />
/// <reference path="Types/Size.ts" />

class Mandelbrot extends MandelbrotConfig {
	private Bounds: MandelbrotBounds;
	private Callback:() => void;
	private Canvas: HTMLCanvasElement;
	private Context: CanvasRenderingContext2D;
	private ImageData: ImageData;
	private Pixels: number[];
	private Scale: Size;
	private Size: Size;
	private Zoom: number;

	constructor(canvasID: string) {
		super();
		this.Canvas = <HTMLCanvasElement>document.getElementById(canvasID);

		if (!this.Canvas.getContext) {
			return;
		}

	// save canvas information
		this.Context = this.Canvas.getContext("2d");
		this.ImageData = this.Context.createImageData(this.Canvas.width, 1);
		this.Pixels = this.ImageData.data;
		this.Scale = new Size();
		this.Size = new Size();
		this.Size.Height = this.Canvas.height;
		this.Size.Width = this.Canvas.width;

	// fill the canvas with black
		this.Context.fillStyle = "#000000";
		this.Context.rect(0, 0, this.Size.Width, this.Size.Height);
		this.Context.fill();
	}

	public draw() {
		var iterations: number = 0;
		var radius: number = this.Bounds.getRadius();

	// determine the calculation radius needed to cover the whole canvas
		radius = radius / Math.cos(4.0 / Math.PI);

	// calculate that Mandelbro, bro!
		var handler = function (m: Mandelbrot, i: number) {
			return function() {
				for (var j: number = 0; j < m.Size.Width; ++j) {
					var c: Complex = new Complex();
					var z: Complex = new Complex(0, 0);
					c.Real = m.Scale.Width * j + m.Bounds.Left;
					c.Imaginary = m.Scale.Height * i + m.Bounds.Top;
					iterations = 0;

					while (z.abs() < radius && iterations < m.MaxIterations) {
						z.multiply(z);
						z.add(c);

						++iterations;
					}

					m.setPixelColor(j, m.smoothColor(iterations, z));
				}

				m.Context.putImageData(m.ImageData, 0, i);
				m.drawLine(i + 1);
			};
		};

		for(var i: number = 0; i < this.Size.Height; ++i) {
			setTimeout(handler(this, i), 0); // allows for simultaneous calculation & drawing
		}

		this.Callback();
	}

	private drawLine(row: number) {
		var offset: number = 0;

		for(var i: number = 0; i < this.Size.Width; ++i) {
			this.Pixels[offset++] = 255;
			this.Pixels[offset++] = 0;
			this.Pixels[offset++] = 0;
			this.Pixels[offset++] = 255; // alpha
		}

		this.Context.putImageData(this.ImageData, 0, row);
	}

	public setCallback(f:() => void): void {
		this.Callback = f;
	}

	public setCenter(x: number, y: number, zoom: number): void {
		this.Bounds = new MandelbrotBounds();
		this.Scale = new Size();
		this.Zoom = zoom;

	// attempt to map the canvas ratio to the user-specified ratio
		// var moveUnit: number = 0;
		// var ratio: number = 0;
		var smaller: number = 0;

		if (this.Size.Height > this.Size.Width) {
			// ratio = this.Size.Height / this.Size.Width;
			// moveUnit = (y + (1 / zoom) * this.BasisScale) * ratio;
			smaller = this.Size.Width;

			// this.Bounds.Bottom = y + (1 / zoom) * this.BasisScale - moveUnit;
			// this.Bounds.Left = x - (1 / zoom) * this.BasisScale;
			// this.Bounds.Right = x + (1 / zoom) * this.BasisScale;
			// this.Bounds.Top = y - (1 / zoom) * this.BasisScale - moveUnit;
		} else {
			// ratio = this.Size.Width / this.Size.Height;
			// moveUnit = ((y + (1 / zoom) * this.BasisScale) * ratio) / 2;
			smaller = this.Size.Height;

			// this.Bounds.Bottom = y + (1 / zoom) * this.BasisScale;
			// this.Bounds.Left = x - (1 / zoom) * this.BasisScale - moveUnit;
			// this.Bounds.Right = x + (1 / zoom) * this.BasisScale - moveUnit;
			// this.Bounds.Top = y - (1 / zoom) * this.BasisScale;
		}

	// bounds should be uniformly square
		this.Bounds.Bottom = y + (1 / zoom) * this.BasisScale;
		this.Bounds.Left = x - (1 / zoom) * this.BasisScale;
		this.Bounds.Right = x + (1 / zoom) * this.BasisScale;
		this.Bounds.Top = y - (1 / zoom) * this.BasisScale;

	// define the scale of the canvas coordinates to the mandelbrot coordinates
		this.Scale.Height = (this.Bounds.Bottom - this.Bounds.Top) / smaller;
		this.Scale.Width = (this.Bounds.Right - this.Bounds.Left) / smaller;
	}

	private setPixelColor(column: number, color: number) {
		var offset = 4 * column;
		this.Pixels[offset]     = ((16 * color) % 256);
		this.Pixels[offset + 1] = ((16 * color) % 256);
		this.Pixels[offset + 2] = ((16 * color) % 256);
		this.Pixels[offset + 3] = 255; // alpha
	}

	public setIterations(i: number): void {
		this.MaxIterations = i;
	}

	private smoothColor(iterations: number, z: Complex): number {
		return (iterations + 1) - Math.log(Math.log(Math.sqrt(z.abs()))) / Math.log(2);
	}
} 