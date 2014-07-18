
var GEN_POPULATION = 25;
var GENE_COUNT = 600;
var GENOME_MUTATION_RATE = 0.01;
var POPULATION_MUTATION_RATE = 0.7;

var madeItAudio = window.Audio ? new Audio('data/madeit.wav') : null;

var Rocket = Class.extend({

    init: function(target, obstcacles, genome) {
        this.location = new Point(view.size.width / 2, view.size.height - 50);
        this.velocity = new Point();
        this.acceleration = new Point();
        this.target = target;
        this.obstcacles = obstcacles ? obstcacles : [];

        this.genome = genome ? genome : new Genome();
        this.alive = true;
        this.madeIt = false;
        this.fitness = 0;

        this.maxSpeed = 8;

        this.item = this._draw();
    },

    _draw: function() {
        var item = new Raster('data/rocket.png');
        item.scale(.3);
        return item;
    },

    push: function(amount) {
        var force = this.velocity.normalize();
        force.length = amount;
        this.applyForce(force);
    },

    left: function(amount) {
        var force = this.velocity.normalize();
        force.angle = force.angle - 90;
        force.length = amount;
        this.applyForce(force);
    },

    right: function(amount) {
        var force = this.velocity.normalize();
        force.angle = force.angle + 90;
        force.length = amount;
        this.applyForce(force);
    },

    pull: function(amount) {
        var force = -this.velocity.normalize();
        force.length = amount;
        this.applyForce(force);
    },

    applyForce: function(force) {
        this.acceleration += force;
    },

    live: function() {
        if (!this.alive) {
            return;
        }

        var gene = this.genome.nextGene();
        if (gene) {
            switch (gene.dir) {
                case 0:
                    this.push(gene.amount);
                    break;
                case 1:
                    this.left(gene.amount);
                    break;
                case 2:
                    this.right(gene.amount);
                    break;
                case 3:
                    this.pull(gene.amount);
                    break;
            }
        }
    },

    mate: function(other) {
        var childGenome = this.genome.crossover(other.genome);
        if (Math.random() < POPULATION_MUTATION_RATE) {
            childGenome.mutate();
        }
        return new Rocket(this.target, this.obstcacles, childGenome);
    },

    checkObstcacles: function() {
        for (var i = 0; i < this.obstcacles.length; i++) {
            if (this.obstcacles[i].contains(this.location)) {
                this.destroy();
            }
        }
    },

    checkTarget:function() {
        if (this.target.contains(this.location)) {
            this.destroy();
            this.fitness = 1.0;
            this.madeIt = true;
            if (madeItAudio) {
                madeItAudio.play();
            }
        }
    },

    update: function() {
        this.velocity += this.acceleration;
        this.velocity.length = Math.min(this.velocity.length, this.maxSpeed);

        this.location += this.velocity;
        this.acceleration = new Point();
    },

    render: function() {
        this.item.position = this.location;
        this.item.rotation = this.velocity.angle + 90;
    },

    destroy: function() {
        this.item.visible = false;
        this.item.remove();

        this.alive = false;

        var distance = (this.target.location - this.location).length;
        this.fitness = 1 / (distance * distance) * view.size.width * view.size.height;
    }
});

var Genome = Class.extend({

    init: function(genes) {
        this.current = 0;

        if (genes) {
            this.genes = genes;
        } else {
            this.genes = [];

            for(var i = 0; i < GENE_COUNT; i++) {
                this.genes[i] = this._randomGene();
            }
        }
    },

    _randomGene: function() {
        return {
            dir: Math.round(Math.random() * 3),
            amount: Math.round(Math.random() * 1000) / 1000
        };
    },

    nextGene: function() {
        if (this.current < this.genes.length) {
            return this.genes[this.current++];
        }
        return null;
    },

    crossover: function(other) {
        var genes = [];
        var midpoint = Math.round(Math.random() * this.genes.length);

        for (var i = 0; i < this.genes.length; i++) {
            if (i < midpoint) {
                genes.push(this.genes[i]);
            } else {
                genes.push(other.genes[i]);
            }
        }

        return new Genome(genes);
    },

    mutate: function() {
        for (var i = 0; i < this.genes.length; i++) {
            if (Math.random() < GENOME_MUTATION_RATE) {
                this.genes[i] = this._randomGene();
            }
        }
    }
});

var Population = Class.extend({

    init: function(target, obstacles) {
        this.members = [];

        for (var i = 0; i < GEN_POPULATION; i++) {
            this.members.push(new Rocket(target, obstacles));
        }

        this.generations = 0;
        this.bestScore = 0;
        this.madeIt = 0;
        this.genMadeIt = 0;
    },

    step: function() {
        var alive = false;
        for(var  i = 0; i < this.members.length; i++) {
            var rocket = this.members[i];

            if (rocket.alive) {
                rocket.live();
                rocket.update();
                rocket.render();
                rocket.checkObstcacles();
                rocket.checkTarget();
                if (rocket.madeIt) {
                    this.genMadeIt++;
                }
                alive = true;
            }
        }

        if(alive) {
            return;
        }

        var matingPool = [];
        for(var  i = 0; i < this.members.length; i++) {
            var rocket = this.members[i];

            var score = Math.ceil(rocket.fitness * GEN_POPULATION);

            if (score > this.bestScore) {
                this.bestScore = score;
            }

            for (var j = 0; j <= score; j++) {
                matingPool.push(rocket);
            }
        }

        this.members = [];
        for (var i = 0; i < GEN_POPULATION; i++) {
            var p1 = Math.min(Math.round(Math.random() * matingPool.length), matingPool.length - 1);
            var p2 = Math.min(Math.round(Math.random() * matingPool.length), matingPool.length - 1);

            var parent1 = matingPool[p1];
            var parent2 = matingPool[p2];

            var child = parent1.mate(parent2);
            this.members.push(child);
        }

        this.generations++;
        this.madeIt += this.genMadeIt;
        this.genMadeIt = 0;
    }
});

var Obstcacle = Class.extend({

    init: function(position, size) {
        this.item = new Path.Rectangle({
            position: position,
            size: size,
            strokeColor: 'black',
            fillColor: '#555'
        });
    },

    contains: function(point) {
        return this.item.contains(point);
    }
});

var Target = Class.extend({

    init: function(location) {
        this.location = new Point(location);

        this.item = new Group();

        this.item.addChild(new Path.Circle({
            position: location,
            radius: 20,
            fillColor: '#55F',
            strokeColor: 'black'
        }));

        this.item.addChild(new Path.Circle({
            position: location,
            radius: 5,
            fillColor: 'black',
            strokeColor: 'black'
        }));
    },

    contains: function(point) {
        return this.item.contains(point);
    }
});

var obstcacles = [];

obstcacles.push(new Obstcacle(view.center - new Point(200, 100), [200, 15]));
obstcacles.push(new Obstcacle(view.center + new Point(200, 100), [200, 15]));
obstcacles.push(new Obstcacle(view.center - new Point(0, 0), [200, 15]));
obstcacles.push(new Obstcacle(view.center - new Point(200, -100), [200, 15]));
obstcacles.push(new Obstcacle(view.center + new Point(200, -100), [200, 15]));

obstcacles.push(new Obstcacle([view.size.width / 2, 3], [view.size.width, 10]));
obstcacles.push(new Obstcacle([view.size.width / 2, view.size.height - 3], [view.size.width, 10]));

obstcacles.push(new Obstcacle([3, view.size.height / 2], [10, view.size.height]));
obstcacles.push(new Obstcacle([view.size.width - 3, view.size.height / 2], [10, view.size.height]));

var target = new Target([view.size.width / 2, 30]);

var population = new Population(target, obstcacles);

var label = new PointText({
    position:[0, 0],
    fillColor: 'grey',
    fontSize: 12
});

function onFrame() {
    population.step();
    label.content = "Generations: " + population.generations +
        ", Best Score: " + population.bestScore +
        ", Made It (Generation): " + population.genMadeIt +
        ", Made It (Total): " + population.madeIt
    ;
    label.position = new Point(view.size.width / 2, view.size.height - 30);
}
