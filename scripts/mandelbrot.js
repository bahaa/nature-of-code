// Implementation from http://www.pheelicks.com/2013/11/intro-to-images-in-go-fractals/

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

function createColorizer(stops) {
    var palettePath = new Path.Rectangle({
        position: view.center,
        size: [256, 2],
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

function colFractal(x, raster, zoom, center, colorizer) {
    for (var y = 0; y < raster.height; y++) {
        var c = center.add(new Complex(
            (x - (raster.width / 2)) / zoom,
            (y - (raster.height / 2)) / zoom
        ));

        var mag = mandelbrot(c, 50.0);
        setPixel(x, y, colorizer(mag));
    }
}

var path = new Path.Rectangle({
    position: view.center,
    size: view.size
});

var raster = path.rasterize(view.resolution / 2);
path.remove();
raster.position = view.center;

var imageData = raster.getImageData();
var width = imageData.width;
var height = imageData.height;


function setPixel(x, y, components) {
    var index = x + y * width;
    index *= 4.0;

    imageData.data[index + 0] = components[0];
    imageData.data[index + 1] = components[1];
    imageData.data[index + 2] = components[2];
    imageData.data[index + 3] = 255;
}

var zoom = 300.0;
var center = new Complex(-0.7, 0);
var colorizer = createColorizer(['yellow', 'red', 'fuchsia', 'black']);

var beginTime = new Date();

var x = 0;
var executionsPerFrame = 10;
var width = view.size.width;

function onFrame() {
    if (x < width) {
        for (var i = 0; i < executionsPerFrame; i++) {
            if (x + i >= width) {
                break;
            }
            colFractal(x + i, imageData, zoom, center, colorizer);
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



