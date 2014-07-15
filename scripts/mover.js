var width = view.size.width;
var height = view.size.height;

var fc = 0.1;
var g = 15;

function Mover(mass, location, color) {
    this.mass = mass ? mass : 1.0;
    this.location = location ? location : new Point(Math.random() * width, Math.random() * height);
    this.velocity = new Point(0.0, 0.0);
    this.acceleration = new Point(0.0, 0.0);

    this.circle = new Path.Circle({
        center: this.location,
        radius: this.mass * 10,
        strokeColor: 'black',
        fillColor: color ? color : '#999'
    });
}

Mover.prototype.render = function() {
    this.circle.position = this.location;
}

Mover.prototype.update = function() {
    this.velocity += this.acceleration;
    this.location += this.velocity;
    this.acceleration = new Point(0.0, 0.0);
}

Mover.prototype.checkEdges = function() {
    var r = this.mass * 10.0;
    if (this.location.x > width - r) {
        this.velocity.x *= -1;
        this.location.x = width - r;
    }

    if (this.location.x < 0 + r) {
        this.velocity.x *= -1;
        this.location.x = 0 + r;
    }

    if (this.location.y > height - r) {
        this.velocity.y *= -1;
        this.location.y = height - r;
    }

    if (this.location.y < 0 + r) {
        this.velocity.y *= -1;
        this.location.y = 0 + r;
    }
}

Mover.prototype.applyForce = function(force) {
    this.acceleration += force / this.mass;
}

Mover.prototype.attract = function(mover) {
    var force = this.location - mover.location;
    var distance = force.length;

    // Constrain
    if (distance < 5) {
        distance = 5;
    }

    if (distance > 30) {
        distance = 30;
    }

    var strength = (g * this.mass * mover.mass) / (distance * distance);

    return force.normalize().multiply(strength);
}