var Complex = (function () {
    function Complex(real, imaginary) {
        this.Real = real;
        this.Imaginary = imaginary;
    }
    Complex.prototype.add = function (c) {
        this.Real += c.Real;
        this.Imaginary += c.Imaginary;
        return this;
    };

    Complex.prototype.multiply = function (c) {
        this.Real = (this.Real * c.Real) - (this.Imaginary * c.Imaginary);
        this.Imaginary = (this.Imaginary * c.Imaginary) - (this.Real * c.Real);
        return this;
    };
    return Complex;
})();

var Mandelbrot = (function () {
    function Mandelbrot(canvas) {
        this.Canvas = document.getElementById(canvas);

        if (!this.Canvas.getContext) {
            return;
        }

        this.Context = this.Canvas.getContext("2d");
        this.Pixels = this.Context.getImageData(0, 0, this.Canvas.width, this.Canvas.height).data;
        this.Size.Height = this.Canvas.height;
        this.Size.Width = this.Canvas.width;
    }
    return Mandelbrot;
})();

window.onload = function () {
    var m = new Mandelbrot("mandelbrot");
};
//# sourceMappingURL=Mandelbrot.js.map
