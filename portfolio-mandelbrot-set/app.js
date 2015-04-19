var MandelbrotConfig = (function () {
    function MandelbrotConfig() {
        this.BasisScale = 2;
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
        this.ImageData = this.Context.createImageData(this.Size.Width, 1);
        this.Pixels = this.ImageData.data;
    }
    Mandelbrot.prototype.draw = function () {
        var iterations = 0;
        var radius = this.Bounds.getRadius();
        radius = radius / Math.cos(4.0 / Math.PI);
        var handler = function (m, i) {
            return function () {
                for (var j = 0; j < m.Size.Width; ++j) {
                    var c = new Complex();
                    var z = new Complex(0, 0);
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
            };
        };
        for (var i = 0; i < this.Size.Height; ++i) {
            setTimeout(handler(this, i), 0);
        }
    };
    Mandelbrot.prototype.setCenter = function (x, y, zoom) {
        this.Bounds = new MandelbrotBounds();
        this.Scale = new Size();
        this.Zoom = zoom;
        this.Bounds.Bottom = y + (1 / zoom) * this.BasisScale;
        this.Bounds.Left = x - (1 / zoom) * this.BasisScale;
        this.Bounds.Right = x + (1 / zoom) * this.BasisScale;
        this.Bounds.Top = y - (1 / zoom) * this.BasisScale;
        var smaller = (this.Size.Height > this.Size.Width) ? this.Size.Width : this.Size.Height;
        this.Scale.Height = (this.Bounds.Bottom - this.Bounds.Top) / smaller;
        this.Scale.Width = (this.Bounds.Right - this.Bounds.Left) / smaller;
    };
    Mandelbrot.prototype.setPixelColor = function (column, color) {
        var offset = 4 * column;
        this.Pixels[offset] = ((16 * color) % 256);
        this.Pixels[offset + 1] = ((16 * color) % 256);
        this.Pixels[offset + 2] = ((16 * color) % 256);
        this.Pixels[offset + 3] = 255;
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
    var ID = document.getElementById("mandelbrot");
    ID.setAttribute("height", "640px");
    ID.setAttribute("width", window.outerWidth + "px");
    setTimeout(function () {
        var m = new Mandelbrot("mandelbrot");
        m.setCenter(-1.790038, 0, 85000);
        m.setIterations(7500);
        m.draw();
    }, 1000);
};
//# sourceMappingURL=app.js.map