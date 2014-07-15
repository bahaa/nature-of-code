include('box2d.js');

var width = view.size.width;
var height = view.size.height;

var world = new b2World(new b2Vec2(0.0, -10.0), true);

var Box = Class.extend({

    init: function (point) {
        this.rotation = 0;

        var bd = new b2BodyDef();
        bd.type = b2Body.b2_dynamicBody;
        bd.position = world.coordPixelsToWorld(new b2Vec2(point.x, point.y));
        this.body = world.CreateBody(bd);
    },

    render: function () {
        var pos = world.coordWorldToPixels(this.body.GetTransform().position);
        var angle = -this.body.GetAngle() * (180 / Math.PI);

        this.item.position = [pos.x, pos.y];

        this.item.rotate(angle - this.rotation);
        this.rotation = angle;
    }
});

var Cube = Box.extend({

    init: function(point) {
        this._super(point);

        this.width = 16;
        this.height = 16;

        this.item = new Path.Rectangle({
            position: [0, 0],
            size: [this.width, this.height],
            strokeColor: 'black',
            fillColor: 'green'
        });

        var ps = new b2PolygonShape();
        ps.SetAsBox(
            world.scalarPixelsToWorld(this.width / 2),
            world.scalarPixelsToWorld(this.height / 2)
        );

        var fd = new b2FixtureDef();
        fd.shape = ps;
        fd.density = 1.0;
        fd.friction = 0.3;
        fd.restitution = 0.5;

        this.body.CreateFixture(fd);
    }
});

var Circle = Box.extend({

    init: function(point) {
        this._super(point);

        this.radius = 8;

        var circle = new Path.Circle({
            position:[0, 0],
            radius: 8,
            strokeColor: 'black',
            fillColor: '#99F'
        });

        var line = new Path.Line({
            from: [0, 0],
            to: [0, 8],
            strokeColor: 'black'
        });

        this.item = new Group([circle, line]);

        var cs = new b2CircleShape(world.scalarPixelsToWorld(this.radius));
        cs.position = world.coordPixelsToWorld(new b2Vec2(point.x, point.y));

        var fd = new b2FixtureDef();
        fd.shape = cs;
        fd.density = 3.0;
        fd.friction = 0.2;
        fd.restitution = 0.5;

        this.body.CreateFixture(fd);
    }
});

var Boundary = Class.extend({

    init: function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var bd = new b2BodyDef();
        bd.type = b2Body.b2_staticBody;
        bd.position = world.coordPixelsToWorld(new b2Vec2(x, y));

        this.body = world.CreateBody(bd);

        var ps = new b2PolygonShape();
        ps.SetAsBox(
            world.scalarPixelsToWorld(this.width / 2),
            world.scalarPixelsToWorld(this.height / 2)
        );

        this.body.CreateFixture2(ps, 1);

        this.item = new Path.Rectangle({
            position: [this.x, this.y],
            size:[this.width, this.height],
            strokeColor: 'black',
            fillColor: 'black'
        });
    },

    render: function() {

    }
});


new PointText({
    point: [20, 20],
    content: 'Click to drop a circle. Click + Shift to drop a cube.',
    fillColor: 'grey',
    fontSize: 12
});

var boxes = [];
var boundaries = [];

boundaries.push(new Boundary(50, 100, 50, 10));
boundaries.push(new Boundary(120, 150, 50, 10));
boundaries.push(new Boundary(190, 200, 50, 10));

boundaries.push(new Boundary(width/2, height - 20, width - 40, 10));

function onMouseDown(event) {
    if (event.modifiers.shift) {
        boxes.push(new Cube(event.point));
    } else {
        boxes.push(new Circle(event.point));
    }
}

function onFrame() {
    world.Step();

    _.each(boxes, function(box) {
        box.render();
    });
}