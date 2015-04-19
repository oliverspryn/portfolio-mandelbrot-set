/// <reference path="MandelbrotConfig.ts" />
/// <reference path="Types/BoundsLR.ts" />
/// <reference path="Types/BoundsTB.ts" />
/// <reference path="Types/Complex.ts" />
/// <reference path="Types/MandelbrotBounds.ts" />
/// <reference path="Types/Size.ts" />

class Mandelbrot extends MandelbrotConfig {
	private Bounds: MandelbrotBounds;
	private Canvas: HTMLCanvasElement;
	private Context: CanvasRenderingContext2D;
	private ImageData: ImageData;
	private Pixels: number[];
	private Scale: Size;
	private Size: Size;

	constructor(canvasID: string) {
		super();
		this.Canvas = <HTMLCanvasElement>document.getElementById(canvasID);

		if (!this.Canvas.getContext) {
			return;
		}

		this.Context = this.Canvas.getContext("2d");
		this.Scale = new Size();
		this.Size = new Size();
		this.Size.Height = this.Canvas.height;
		this.Size.Width = this.Canvas.width;

		this.ImageData = this.Context.createImageData(this.Canvas.width, 1);
		this.Pixels = this.ImageData.data;
	}

	public draw() {
		var iterations: number = 0;
		var radius: number = this.Bounds.getRadius();

	// determine the calculation radius needed to cover the whole canvas
		radius = radius / Math.cos(4.0 / Math.PI);

	// calculate that Mandelbro, bro!
		for(var i: number = 0; i < this.Size.Height; ++i) {
			for(var j: number = 0; j < this.Size.Width; ++j) {
				var c: Complex = new Complex();
				var z: Complex = new Complex(0, 0);
				c.Real = this.Scale.Width * j + this.Bounds.Left;
				c.Imaginary = this.Scale.Height * i + this.Bounds.Top;
				iterations = 0;

				while(z.abs() < radius && iterations < this.MaxIterations) {
					z.multiply(z);
					z.add(c);

					++iterations;
				}

				this.setPixelColor(j, this.smoothColor(iterations, z));
			}

			this.Context.putImageData(this.ImageData, 0, i);
		}
	}

	public setBounds(mb: MandelbrotBounds): void;
	public setBounds(lr: BoundsLR, tb: BoundsTB): void;
	public setBounds(left: number, right: number, top: number, bottom: number): void;

	public setBounds(first: any, second?: any, third?: number, fourth?: number): void {
	// first overload
		if (first && typeof first === "MandelbrotBounds") {
			this.Bounds = first;
	// second overload
		} else if (first  && typeof first  === "BoundsLR" &&
				   second && typeof second === "BoundsTB") {
			var lr: BoundsLR   = <BoundsLR>first;
			var tb: BoundsTB   = <BoundsTB>second;

			this.Bounds        = new MandelbrotBounds();
			this.Bounds.Bottom = tb.Bottom;
			this.Bounds.Left   = lr.Left;
			this.Bounds.Right  = lr.Right;
			this.Bounds.Top    = tb.Top;
	// third overload
		} else if (first  && typeof first  === "number" &&
				   second && typeof second === "number" &&
				   third  && typeof third  === "number" &&
				   fourth && typeof fourth === "number") {

			this.Bounds        = new MandelbrotBounds();
			this.Bounds.Bottom = fourth;
			this.Bounds.Left   = first;
			this.Bounds.Right  = second;
			this.Bounds.Top    = third;
		}

	// define the scale of the canvas coordinates to the mandelbrot coordinates
		this.Scale.Height = (this.Bounds.Bottom - this.Bounds.Top) / this.Size.Height;
		this.Scale.Width = (this.Bounds.Right - this.Bounds.Left) / this.Size.Width;
	}

	private setPixelColor(column: number, color: number) {
		var offset = 4 * column;
		this.Pixels[offset]   = ((16 * color) % 256);
		this.Pixels[offset++] = ((16 * color) % 256);
		this.Pixels[offset++] = ((16 * color) % 256);
		this.Pixels[offset++] = 255; // alpha
	}

	public setIterations(i: number): void {
		this.MaxIterations = i;
	}

	private smoothColor(iterations: number, z: Complex): number {
		return (iterations + 1) - Math.log(Math.log(Math.sqrt(z.abs()))) / Math.log(2);
	}
} 