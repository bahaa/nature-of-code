function cantor(x, y, len) {

    if (len < 1) {
        return;
    }

    new Path({
        segments: [
            [x, y],
            [x + len, y]
        ],
        strokeColor: 'black',
        strokeWidth: 10
    });

    y += 20;

    cantor(x, y, len / 3);
    cantor(x + len * 2 / 3, y, len / 3);
}

cantor(10, 20, view.size.width - 20);