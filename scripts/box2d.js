var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    _b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;

var b2World = function (gravity, sleep) {
    _b2World.call(this, gravity, sleep);

    this.transX = view.size.width / 2;
    this.transY = view.size.height / 2;
    this.scaleFactor = 10;
    this.yFlip = -1.0;
}

b2World.prototype = Object.create(_b2World.prototype);

b2World.prototype.setScaleFactor = function (scaleFactor) {
    this.scaleFactor = scaleFactor;
}

b2World.prototype.Step = function () {
    _b2World.prototype.Step.call(
        this,
        1.0 / 60.0,
        10,
        10
    );
}

b2World.prototype.coordWorldToPixels = function (vec) {
    var pixelX = map(vec.x, 0.0, 1.0, this.transX, this.transX + this.scaleFactor);
    var pixelY = map(vec.y, 0.0, 1.0, this.transY, this.transY + this.scaleFactor);

    if (this.yFlip == -1) {
        pixelY = map(pixelY, 0.0, view.size.height, view.size.height, 0.0);
    }
    return new b2Vec2(pixelX, pixelY);
}

b2World.prototype.coordPixelsToWorld = function (vec) {
    var worldX = map(vec.x, this.transX, this.transX + this.scaleFactor, 0.0, 1.0);
    var worldY = vec.y;

    if (this.yFlip == -1) {
        worldY = map(vec.y, view.size.height, 0.0, 0.0, view.size.height);
    }

    worldY = map(worldY, this.transY, this.transY + this.scaleFactor, 0.0, 1.0);

    return new b2Vec2(worldX, worldY);
}

b2World.prototype.scalarPixelsToWorld = function (scaler) {
    return scaler / this.scaleFactor;
}

b2World.prototype.scalarWorldToPixels = function (scaler) {
    return scaler * this.scaleFactor;
}

