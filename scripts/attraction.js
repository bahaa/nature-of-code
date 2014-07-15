include('mover.js');

var attractor = new Mover(4, new Point(width / 2, height / 2), 'yellow');
var mover = new Mover(1, new Point(250, 100), 'red');

mover.velocity = new Point(3, 0);

var path = new Path();
path.strokeColor = '#999';

function onFrame() {
    var attraction = attractor.attract(mover);

    mover.applyForce(attraction);
    mover.update();
    mover.render();

    path.add(mover.location);
}