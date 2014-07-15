include('mover.js');

var mover = new Mover(1.0, new Point(width/2, 0));

var gravity = new Point(0.0, 1.0);
var wind = new Point(0.01, 0);

function onFrame() {
    var friction = mover.velocity.negate().normalize().multiply(fc);

    mover.applyForce(gravity);
    mover.applyForce(friction);
    mover.applyForce(wind);
    mover.update();
    mover.checkEdges();
    mover.render();
}