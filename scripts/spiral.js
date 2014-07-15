var path = new Path({
    strokeColor: 'black',
    strokeWidth: 2
});

var r = 1;
var theta = 0.0;

function onFrame() {
    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);

    x += view.size.width / 2;
    y += view.size.height / 2;

    if (x > view.size.width || x < 0 || y > view.size.height || y < 0) {
        view.pause();
    }

    path.add(new Point(x, y));

    r += 0.1;
    theta += 0.1;
}