include('vehicle.js');

var vehicle = new Vehicle();

var target = new Point(0, 0);

var targetCircle = new Path.Circle({
    position: target,
    radius: 30,
    strokeColor: 'black',
    dashArray: [10, 4]
});

function onMouseMove(event) {
    target = event.point;
}

function onFrame() {
    targetCircle.position = target;

    vehicle.arrive(target);
    vehicle.update();
    vehicle.render();
}