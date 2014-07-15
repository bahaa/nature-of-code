
var Boid = Class.extend({

    init: function(location, velocity) {
        this.location = location ? location : view.center.clone();
        this.velocity = velocity ? velocity : Point.random() * 2 - 1;
        this.acceleration = new Point();

        this.radius = 6;
        this.maxSpeed = 5.0;
        this.maxForce = 0.05;
        this.maxFleeForce = 4.0;

        this.separationFactor = 5.0;
        this.neighborFactor = 10.0;

        this.item = this.constructItem();
    },

    constructItem: function() {
        var item = new Path({
            position: view.center,
            strokeColor: 'black',
            fillColor: new Color(Math.random(), Math.random(), Math.random())
        });

        var r = this.radius;

        item.add(0, -r * 2);
        item.add(r/2, r * 2);
        item.add(r, -r * 2);
        item.add(0, -r * 2);

        item.rotate(-90);

        return item;
    },

    update: function() {
        this.velocity += this.acceleration;
        this.velocity.length = Math.min(this.maxSpeed, this.velocity.length);

        this.location += this.velocity;

        this.acceleration = new Point();
    },

    flock: function(boids) {
        var sep = this.separate(boids);
        var ali = this.align(boids);
        var coh = this.cohesion(boids);

        sep *= 1.5;
        ali *= 1.0;
        coh *= 1.0;

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    },

    applyForce: function(force) {
        this.acceleration += force;
    },

    steer: function(target, slowDown) {
        var desired = target - this.location;
        var distance = desired.length;

        if (slowDown && distance < 100) {
            desired.length = this.maxSpeed * (distance / 100);
        } else {
            desired.length = this.maxSpeed;
        }

        var steer = desired - this.velocity;
        steer.length = Math.min(steer.length, this.maxForce);

        return steer;
    },

    seek: function(target) {
        return this.steer(target, false);
    },

    arrive: function(target) {
        return this.steer(target, true);
    },

    separate: function(boids) {
        var desiredSeparation = this.radius * this.separationFactor;
        var steer = new Point();
        var count = 0;

        for (var i = 0; i < boids.length; i++) {
            var other = boids[i];
            var diff = this.location - other.location;
            var distance = diff.length;

            if (distance > 0 && distance < desiredSeparation) {
                steer += diff.normalize(1 / distance);
                count++;
            }
        }

        if (count > 0) {
            steer /= count;
        }

        if (!steer.isZero()) {
            steer.length = this.maxSpeed;
            steer -= this.velocity;
            steer.length = Math.min(steer.length, this.maxForce);
        }

        return steer;
    },

    align: function(boids) {
        var neighborDistance = this.radius * this.neighborFactor;
        var sum = new Point();
        var count = 0;

        for (var i = 0; i < boids.length; i++) {
            var other = boids[i];
            var distance = (this.location - other.location).length;
            if (distance > 0 && distance < neighborDistance) {
                sum += other.velocity;
                count++;
            }
        }

        if (count > 0) {
            var steer = (sum / count).normalize() * this.maxSpeed - this.velocity;
            steer.length = Math.min(steer.length, this.maxForce);
            return steer;
        } else {
            return new Point();
        }
    },

    cohesion: function(boids) {
        var neighborDistance = this.radius * this.neighborFactor;
        var sum = new Point();
        var count = 0;

        for (var i = 0; i < boids.length; i++) {
            var distance = this.location.getDistance(boids[i].location);
            if (distance > 0 && distance < neighborDistance) {
                sum += boids[i].velocity;
                count++;
            }
        }

        if (count > 0) {
            return this.seek(sum / count);
        } else {
            return new Point();
        }
    },

    flee: function(target) {
        var desired = this.location - target;
        var distance = desired.length;

        if (distance < 100) {
            var steer = desired - this.velocity;
            steer.length = Math.min(steer.length, this.maxFleeForce);
            this.applyForce(steer);
        }
    },

    borders: function() {
        var r = this.radius;

        if (this.location.x < -r) {
            this.location.x = view.size.width + r;
        }

        if (this.location.y < -r) {
            this.location.y = view.size.height + r;
        }

        if (this.location.x > view.size.width + r) {
            this.location.x = -this.r;
        }

        if (this.location.y > view.size.height + r) {
            this.location.y = -r;
        }
    },

    render: function() {
        if (!this.rotation) {
            this.rotation = 0.0;
        }
        this.item.position = this.location;
        this.item.rotation = this.velocity.angle - this.rotation;
        this.rotation = this.velocity.angle;
    },

    run: function(boids) {
        this.flock(boids);
        this.update();
        this.borders();
        this.render();
    }
});

var Flock = Class.extend({

    init: function() {
        this.boids = [];
    },

    run: function() {
        for(var i = 0; i < this.boids.length; i++) {
            this.boids[i].run(this.boids);
        }
    },

    add: function(boid) {
        this.boids.push(boid);
    },

    flee: function(target) {
        for(var i = 0; i < this.boids.length; i++) {
            this.boids[i].flee(target);
        }
    }
});

new PointText({
    position:[20, view.size.height - 20],
    content: "Click to add a Boid. Shift + Click to make the boids flee.",
    fontSize: 12,
    fillColor: '#999'
});

var flock = new Flock();

for (var i = 0; i < 80; i++) {
    flock.add(new Boid());
}

function onFrame() {
    flock.run();
}

function onMouseDown(event) {
    if (event.modifiers.shift) {
        flock.flee(event.point);
    } else {
        flock.add(new Boid(event.point));
    }
}