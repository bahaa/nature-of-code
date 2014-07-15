var Vehicle = Class.extend({

    init: function(location) {
        this.location = location ? location : view.center;
        this.velocity = new Point(0.0, 0.0);
        this.acceleration = new Point(0.0, 0.0);

        this.maxSpeed = 4.0;
        this.maxForce = 0.1;

        this.rotation = 0

        this.r = 6;

        this.item = new Path({
            position: view.center,
            strokeColor: 'black',
            fillColor: '#AAF'
        });

        this.item.add(0, -this.r * 2);
        this.item.add(this.r/2, this.r * 2);
        this.item.add(this.r, -this.r * 2);
        this.item.add(0, -this.r * 2);

        this.item.rotate(-90);
    },

    update: function() {
        this.velocity += this.acceleration;

        // Limit speed
        if (this.velocity.length > this.maxSpeed) {
            this.velocity.length = this.maxSpeed;
        }

        this.location += this.velocity;

        this.acceleration = new Point(0.0, 0.0);
    },

    applyForce: function(force) {
        this.acceleration += force;
    },

    arrive: function(target) {
        var desired = target - this.location;
        var distance = desired.length;

        if (distance < 100) {
            desired.length = map(distance, 0.0, 100.0, 0.0, this.maxSpeed);
        } else {
            desired.length = this.maxSpeed;
        }

        var steer = desired - this.velocity;
        if (steer.length > this.maxForce) {
            steer.length = this.maxForce;
        }

        this.applyForce(steer);
    },

    separate: function(vehicles) {
        var desiredSeparation = this.r * 5;
        var sum = new Point(0.0, 0.0);
        var count = 0;

        for (var i = 0; i < vehicles.length; i++) {
            var other = vehicles[i];
            var distance = this.location.getDistance(other.location);

            if (distance > 0 && distance < desiredSeparation) {
                var diff = this.location - other.location;
                sum += diff.normalize() / distance;
                count++;
            }
        }

        if (count > 0) {
            var steer = ((sum / count).normalize() * this.maxSpeed) - this.velocity;
            if (steer.length > this.maxForce) {
                steer.length = this.maxForce;
            }

            this.applyForce(steer);
        }
    },

    borders: function() {
        if (this.location.x < -this.r) {
            this.location.x = view.size.width + this.r;
        }

        if (this.location.y < -this.r) {
            this.location.y = view.size.height + this.r;
        }

        if (this.location.x > view.size.width + this.r) {
            this.location.x = -this.r;
        }

        if (this.location.y > view.size.height + this.r) {
            this.location.y = -this.r;
        }
    },

    render: function() {
        this.item.position = this.location;
        this.item.rotation = this.velocity.angle - this.rotation;
        this.rotation = this.velocity.angle;
    }
});
