// Implementation from http://www.pheelicks.com/2013/11/intro-to-images-in-go-fractals/

pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

var ITERATIONS = 50;
var ZOOM = 300.0 * pixelRatio;
var CENTER = new Complex(-0.75, 0);

function mandelbrot(c, iter) {
    var z = new Complex(0.0, 0.0);
    for (var i = 0; i < iter; i++) {
        z = c.add(z.lmul(z));
        if (z.absSquare() > 1000 * 1000) {
            return 1000;
        }
    }
    return z.abs();
}

function colFractal(x, raster, zoom, center, colorizer) {
    for (var y = 0; y < raster.height; y++) {
        var c = center.add(new Complex(
                (x - (raster.width / 2)) / zoom,
                (y - (raster.height / 2)) / zoom
        ));

        var mag = mandelbrot(c, ITERATIONS);
        raster.setPixel(x, y, colorizer(mag));
    }
}

function createColorizer(stops) {
    var palettePath = new Path.Rectangle({
        position: view.center,
        size: [512 / pixelRatio, 2],
        // Fill the path with a gradient of three color stops
        // that runs between the two points we defined earlier:
        fillColor: {
            gradient: {
                stops: stops
            },
            origin: view.center - new Point(128, 0),
            destination: view.center + new Point(128, 0)
        }
    });

    var palette = palettePath.rasterize();
    palettePath.remove();
    palette.visible = false;

    var imageData = palette.getImageData();

    var limit = imageData.width - 1;
    return function (mag) {
        var pos = Math.max(Math.min(300 * mag, limit), 1);
        var components = [];
        var index = Math.floor(pos) * 4;

        components.push(imageData.data[index + 0]);
        components.push(imageData.data[index + 1]);
        components.push(imageData.data[index + 2]);

        return components;
    }
}

var path = new Path.Rectangle({
    position: view.center,
    size: view.size
});

var raster = path.rasterize();
path.remove();
raster.position = view.center;

var imageData = raster.getImageData();

imageData.setPixel = function (x, y, components) {
    var index = x + y * this.width;
    index *= 4.0;

    this.data[index + 0] = components[0];
    this.data[index + 1] = components[1];
    this.data[index + 2] = components[2];
    this.data[index + 3] = 255;
}

var colorizer = createColorizer(['yellow', 'red', 'fuchsia', 'black']);

var beginTime = new Date();

var x = 0;
var executionsPerFrame = 10 / pixelRatio;
var width = imageData.width;

function onFrame() {
    if (x < width) {
        for (var i = 0; i < executionsPerFrame; i++) {
            if (x + i >= width) {
                break;
            }
            colFractal(x + i, imageData, ZOOM, CENTER, colorizer);
        }
        x += executionsPerFrame;

        raster.setImageData(imageData);
    } else {
        if (beginTime) {
            console.log('Total Time = ', new Date(new Date() - beginTime).valueOf() / 1000 + ' seconds.');
            beginTime = null;
        }
    }
}



