var CA = Class.extend({

    init: function (width) {

        this.width = width ? width : Math.floor(view.size.width / 10);
        this.pixels = Math.floor(view.size.width / this.width);
        this.generations = view.size.height / this.pixels;
        this.generation = 0;

        this.cells = [];
        this.rules = [0, 1, 0, 1, 1, 0, 1, 0];

        for (var i = 0; i < this.width; i++) {
            this.cells.push(0);
        }
        this.cells[Math.floor(this.width / 2)] = 1;

        this.blackSquare = new Symbol(new Path.Rectangle({
            position: [-100, -100],
            size: [this.pixels, this.pixels],
            strokeColor: 'black',
            fillColor: 'black'
        }));
    },

    generate: function () {
        var nextCells = [];
        for (var i = 0; i < this.cells.length; i++) {
            nextCells.push(0);
        }

        var length = this.cells.length;
        for (var i = 0; i < length; i++) {
            var li = i == 0 ? length - 1 : i - 1;
            var ri = i == length - 1 ? 0 : i + 1;

            var left = this.cells[li];
            var me = this.cells[i];
            var right = this.cells[ri];

            nextCells[i] = this.ruleValue(left, me, right);
        }

        this.cells = nextCells;
        this.generation++;
    },

    ruleValue: function (left, me, right) {
        return this.rules[parseInt("" + left + me + right, 2)];
    },

    render: function () {
        if (this.generation >= this.generations) {
            return;
        }

        for (var i = 0; i < this.cells.length; i++) {
            if (this.cells[i] == 1) {
                var x = i * this.pixels + this.pixels / 2;
                var y = this.generation * this.pixels + this.pixels / 2;
                debugger;
                this.blackSquare.place().position = [x, y];
            }
        }
        this.generate();
    }
});

var ca = new CA();

function onFrame(event) {
    if (event.count % 5 == 0) {
        ca.render();
    }
}