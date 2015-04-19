class Complex {
	public Real: number;
	public Imaginary: number;

	constructor();
	constructor(real: number, imaginary: number);

	constructor(real?: number, imaginary?: number) {
		if(real && typeof real == "number" &&
		   imaginary && typeof imaginary == "number") {
			this.Real = real;
			this.Imaginary = imaginary;
		} else {
			this.Real = 0;
			this.Imaginary = 0;
		}
	}

	public abs(): number {
		return this.Real * this.Real + this.Imaginary * this.Imaginary;
	}

	public add(c: Complex): Complex {
		this.Real += c.Real;
		this.Imaginary += c.Imaginary;
		return this;
	}

	public multiply(c: Complex): Complex {
		var r: number = (this.Real * c.Real) - (this.Imaginary * c.Imaginary);
		var i: number = (this.Imaginary * c.Real) + (this.Real * c.Imaginary);
		this.Real = r;
		this.Imaginary = i;

		return this;
	}
} 