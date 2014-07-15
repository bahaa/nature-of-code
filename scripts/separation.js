include('vehicle.js')

var vehicles = [];

for (var i = 0; i < 90; i++) {
    vehicles.push(new Vehicle(Point.random() * new Point(view.size.width, view.size.height)));
}

function onFrame() {
    _.each(vehicles, function(vehicle) {
        vehicle.separate(vehicles);
        vehicle.update();
        vehicle.borders();
        vehicle.render();
    });
}