function Walker() {
    this.location = new Point(Math.random() * view.size.width, Math.random() * view.size.height);
}

Walker.prototype.step = function() {
    this.location.x += Math.random() > .5 ? 1 : -1;
    this.location.y += Math.random() > .5 ? 1 : -1;
}

Walker.prototype.render = function() {
    var path = new Path();
    path.strokeColor = 'red';
    path.moveTo(this.location);
    path.lineTo(this.location + [1 + 1]);
}

var walker = new Walker();

function onFrame() {
    walker.step();
    walker.render();
}