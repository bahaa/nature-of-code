
(function drawCircle(x, y, r) {
    new Path.Circle({
        position: [x, y],
        radius: r,
        strokeColor: 'black'
    });

    if (r > 10) {
        drawCircle(x + r / 2, y, r / 2);
        drawCircle(x - r / 2, y, r / 2);
        drawCircle(x, y + r / 2, r / 2);
        drawCircle(x, y - r / 2, r / 2);
    }
})(view.center.x, view.center.y, Math.min(view.size.width / 2, view.size.height / 2));

