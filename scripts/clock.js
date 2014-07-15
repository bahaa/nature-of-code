var width = view.size.width;
var height = view.size.height;

var center = new Point(width / 2, height / 2);
var r = width < height ? width / 2 - 20 : height / 2 - 20;


new Path.Circle({
    position:[width / 2, height / 2],
    radius: r,
    strokeColor: 'black'
});

new Path.Circle({
    position:[width / 2, height / 2],
    radius: 10,
    strokeColor: 'black',
    fillColor: 'black'
});

for (var i = 0; i < 12; i++) {
    var t = i * Math.PI / 6;
    var x = (r - 10) * Math.cos(t) + center.x;
    var y = (r - 10) * Math.sin(t) + center.y;

    new Path.Circle({
        position: [x, y],
        radius: i == 9 ? 7 : 3,
        strokeColor: '#668',
        fillColor: '#668'
    });
}

for (var i = 0; i < 60; i++) {
    if (i % 5 == 0) {
        continue;
    }
    var t = i * Math.PI / 30;
    var x1 = (r - 5) * Math.cos(t) + center.x;
    var y1 = (r - 5) * Math.sin(t) + center.y;

    var x2 = (r - 10) * Math.cos(t) + center.x;
    var y2 = (r - 10) * Math.sin(t) + center.y;

    var path = new Path({
        strokeColor: '#668'
    });

    path.moveTo([x1, y1]);
    path.lineTo([x2, y2]);
}

var dateRect = new Path.Rectangle({
    position:[center.x + r - 60, center.y],
    size:[80, 50],
    strokeColor: 'black'
});

var dateText = new PointText({
    point: [center.x + r - 95, center.y + 17],
    content: '31',
    fillColor: 'black',
    fontSize: 50,
    fontFamily: 'serif',
    fontWeight: 'bold'
});

var hourHand = new Path({
    strokeColor: 'black',
    strokeWidth: 13
});

hourHand.moveTo([0, 0]);
hourHand.lineTo([0, - r + 50]);
hourHand.translate([center.x, center.y + 40]);

var minuteHand = new Path({
    strokeColor: 'black',
    strokeWidth: 9
});

minuteHand.moveTo([0, 0]);
minuteHand.lineTo([0, - r - 10]);
minuteHand.translate([center.x, center.y + 40]);

var secondHand = new Path({
    strokeColor: 'black',
    strokeWidth: 2
});

secondHand.moveTo([0, 0]);
secondHand.lineTo([0, - r - 60]);
secondHand.translate([center.x, center.y + 65]);

var secondsAngle = 0;
var minutesAngle = 0;
var hoursAngle = 0;



function onFrame(event) {

    if (event.count % 5 != 0) {
        return;
    }
    var date = new Date();

    secondHand.rotate(-secondsAngle, center);
    secondsAngle = 360 / 60 * date.getSeconds();
    secondHand.rotate(secondsAngle, center);

    minuteHand.rotate(-minutesAngle, center);
    minutesAngle = 360 / 60 * date.getMinutes();
    minuteHand.rotate(minutesAngle, center);

    hourHand.rotate(-hoursAngle, center);
    hoursAngle = 360 / 60 * date.getHours();
    hourHand.rotate(hoursAngle, center);

    dateText.content = date.getDate();
    dateText.position = dateRect.position;
}