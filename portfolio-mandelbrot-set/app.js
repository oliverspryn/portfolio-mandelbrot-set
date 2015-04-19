var MandelbrotConfig = (function () {
    function MandelbrotConfig() {
        this.MaxIterations = 100;
    }
    return MandelbrotConfig;
})();
var BoundsLR = (function () {
    function BoundsLR() {
    }
    return BoundsLR;
})();
var BoundsTB = (function () {
    function BoundsTB() {
    }
    return BoundsTB;
})();
var Complex = (function () {
    function Complex(real, imaginary) {
        if (real && typeof real == "number" && imaginary && typeof imaginary == "number") {
            this.Real = real;
            this.Imaginary = imaginary;
        }
        else {
            this.Real = 0;
            this.Imaginary = 0;
        }
    }
    Complex.prototype.abs = function () {
        return this.Real * this.Real + this.Imaginary * this.Imaginary;
    };
    Complex.prototype.add = function (c) {
        this.Real += c.Real;
        this.Imaginary += c.Imaginary;
        return this;
    };
    Complex.prototype.multiply = function (c) {
        var r = (this.Real * c.Real) - (this.Imaginary * c.Imaginary);
        var i = (this.Imaginary * c.Real) + (this.Real * c.Imaginary);
        this.Real = r;
        this.Imaginary = i;
        return this;
    };
    return Complex;
})();
var MandelbrotBounds = (function () {
    function MandelbrotBounds() {
    }
    MandelbrotBounds.prototype.getRadius = function () {
        if (Math.abs(this.Bottom) + Math.abs(this.Top) > Math.abs(this.Left) + Math.abs(this.Right)) {
            return Math.abs(this.Bottom) + Math.abs(this.Top);
        }
        else {
            return Math.abs(this.Left) + Math.abs(this.Right);
        }
    };
    return MandelbrotBounds;
})();
var Size = (function () {
    function Size() {
    }
    return Size;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Mandelbrot = (function (_super) {
    __extends(Mandelbrot, _super);
    function Mandelbrot(canvasID) {
        _super.call(this);
        this.Canvas = document.getElementById(canvasID);
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
    Mandelbrot.prototype.draw = function () {
        var iterations = 0;
        var radius = this.Bounds.getRadius();
        radius = radius / Math.cos(4.0 / Math.PI);
        for (var i = 0; i < this.Size.Height; ++i) {
            for (var j = 0; j < this.Size.Width; ++j) {
                var c = new Complex();
                var z = new Complex(0, 0);
                c.Real = this.Scale.Width * j + this.Bounds.Left;
                c.Imaginary = this.Scale.Height * i + this.Bounds.Top;
                iterations = 0;
                while (z.abs() < radius && iterations < this.MaxIterations) {
                    z.multiply(z);
                    z.add(c);
                    ++iterations;
                }
                this.setPixelColor(j, this.smoothColor(iterations, z));
            }
            this.Context.putImageData(this.ImageData, 0, i);
        }
    };
    Mandelbrot.prototype.setBounds = function (first, second, third, fourth) {
        if (first && typeof first === "MandelbrotBounds") {
            this.Bounds = first;
        }
        else if (first && typeof first === "BoundsLR" && second && typeof second === "BoundsTB") {
            var lr = first;
            var tb = second;
            this.Bounds = new MandelbrotBounds();
            this.Bounds.Bottom = tb.Bottom;
            this.Bounds.Left = lr.Left;
            this.Bounds.Right = lr.Right;
            this.Bounds.Top = tb.Top;
        }
        else if (first && typeof first === "number" && second && typeof second === "number" && third && typeof third === "number" && fourth && typeof fourth === "number") {
            this.Bounds = new MandelbrotBounds();
            this.Bounds.Bottom = fourth;
            this.Bounds.Left = first;
            this.Bounds.Right = second;
            this.Bounds.Top = third;
        }
        this.Scale.Height = (this.Bounds.Bottom - this.Bounds.Top) / this.Size.Height;
        this.Scale.Width = (this.Bounds.Right - this.Bounds.Left) / this.Size.Width;
    };
    Mandelbrot.prototype.setPixelColor = function (column, color) {
        var offset = 4 * column;
        this.Pixels[offset] = ((16 * color) % 256);
        this.Pixels[offset++] = ((16 * color) % 256);
        this.Pixels[offset++] = ((16 * color) % 256);
        this.Pixels[offset++] = 255;
    };
    Mandelbrot.prototype.setIterations = function (i) {
        this.MaxIterations = i;
    };
    Mandelbrot.prototype.smoothColor = function (iterations, z) {
        return (iterations + 1) - Math.log(Math.log(Math.sqrt(z.abs()))) / Math.log(2);
    };
    return Mandelbrot;
})(MandelbrotConfig);
window.onload = function () {
    setTimeout(function () {
        var m = new Mandelbrot("mandelbrot");
        m.setBounds(-2.5, 1.5, -2, 2);
        m.setIterations(1024);
        m.draw();
    }, 3000);
};
//# sourceMappingURL=app.js.map