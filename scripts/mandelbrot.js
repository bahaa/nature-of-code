// Implementation from http://www.pheelicks.com/2013/11/intro-to-images-in-go-fractals/


function toComplex(x, y, zoom, center) {
    return math.add(center, math.complex(x / zoom, y / zoom));
}

function complexAbs(c) {
    return Math.sqrt(c.re * c.re + c.im * c.im);
}

function mandelbrot(c, iter) {
    var z = math.complex(0.0, 0.0);
    for (var i = 0; i < iter; i++) {
        z = math.add(math.multiply(z, z), c);
        if (complexAbs(z) > 1000) {
            return 1000;
        }
    }
    return complexAbs(z);
}

function createColorizer() {
    var palettePath = new Path.Rectangle({
        position: view.center,
        size: [256, 10],
        // Fill the path with a gradient of three color stops
        // that runs between the two points we defined earlier:
        fillColor: {
            gradient: {
                stops: ['green', 'yellow', 'red', 'blue']
            },
            origin: view.center - new Point(128, 0),
            destination: view.center + new Point(128, 0)
        }
    });

    var palette = palettePath.rasterize();
    palettePath.remove();
    palette.visible = false;

    var limit = palette.width - 1;
    return function(mag) {
        var pos = Math.max(Math.min(300 * mag, limit), 1);
        return palette.getPixel([pos, 5]);
    }
}

function colFractal(x, raster, zoom, center, colorizer) {
    for (var y = 0; y < raster.height; y++) {
        var c = toComplex(
                x - raster.width /2,
                y - raster.height / 2,
            zoom,
            center
        );

        var mag = mandelbrot(c, 50.0);
        raster.setPixel(x, y, colorizer(mag));
    }
}

var path = new Path.Rectangle({
    position:view.center,
    size:view.size
});

var raster = path.rasterize(view.resolution / 2);
path.remove();
raster.position = view.center;

var zoom = 16000.0;
var center = math.complex(-0.71, -0.25);
var colorizer = createColorizer();

var x = 0;

function onFrame() {
    if (x < view.size.width) {
        colFractal(x, raster, zoom, center, colorizer);
        x++;
    }
}



