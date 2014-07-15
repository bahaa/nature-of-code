
var Particle = Class.extend({

    init: function(location, image) {
        this.location = location;

        if (!image) {
            this.circle = new Path.Circle({
                position: this.location,
                radius: 3,
                strokeColor: 'black',
                fillColor: '#777'
            });
        } else {
            this.image = image;
        }

        this.rand = new Random();

        this.acceleration = new Point(0.0, 0.0);
        this.velocity = new Point(this.rand.normal(0, 1) * 0.3, this.rand.normal(0, 1) * 0.3 - 1);
        this.lifespan = 100.0;
    },

    run: function() {
        this.update();
        this.render();
    },

    update: function() {
        this.velocity += this.acceleration;
        this.location += this.velocity;
        this.lifespan -= 2.5;
        this.acceleration = new Point(0.0, 0.0);
    },

    render: function() {
        if(this.image) {
            this.image.opacity = this.lifespan / 100.0;
            this.image.position = this.location;
        } else {
            this.circle.opacity = this.lifespan / 100.0;
            this.circle.position = this.location;
        }
    },

    applyForce: function(force) {
        this.acceleration += force;
    },

    dead: function() {
        return this.lifespan <= 0.0;
    }
});

var ParticleSystem = Class.extend({

    init: function(num, origin, image) {
        this.particles = [];
        this.origin = origin;
        this.image = image;

        for (var i = 0; i < num; i++) {
            this.particles.push(new Particle(this.origin, this.image));
        }
    },

    run: function() {
        _.each(this.particles, function(particle) {
            particle.run();
        });
        this.particles = _.filter(this.particles, function(particle) {
            return !particle.dead();
        });
    },

    applyForce: function(force) {
        _.each(this.particles, function(particle) {
            particle.applyForce(force);
        });
    },

    addParticle: function() {
        this.particles.push(new Particle(this.origin, this.image.place(-10, -10)));
    }
});

var width = view.size.width;
var height = view.size.height;

new Path.Rectangle({
    position: view.center,
    size: [width, height],
    strokeColor: 'black',
    fillColor: 'black'
});

var texture = new Raster('data/texture.png');
texture.blendMode = 'normal';
var imageSymbol = new Symbol(texture);

var ps = new ParticleSystem(0, new Point(width / 2, height - 80), imageSymbol);

var wind = new Point(.1, 0.0);

function onFrame() {
    ps.applyForce(wind);
    ps.run();

    ps.addParticle();
    ps.addParticle();
}