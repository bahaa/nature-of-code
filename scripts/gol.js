
var Cell = Class.extend({

    init: function(gol, x, y) {
        this.x = x;
        this.y = y;
        this.width = gol.cellWidth;

        this.state = Math.random() >= .5 ? true : false;

        this.liveSquare = gol.liveSymbol.place();
        this.liveSquare.position = [
                x * this.width + this.width / 2,
                y * this.width + this.width / 2
        ];

        this.deadSquare = gol.deadSymbol.place();
        this.deadSquare.position = [
                x * this.width + this.width / 2,
                y * this.width + this.width / 2
        ];

        this.bornSquare = gol.bornSymbol.place();
        this.bornSquare.position = [
                x * this.width + this.width / 2,
                y * this.width + this.width / 2
        ];

        this.diesSquare = gol.diesSymbol.place();
        this.diesSquare.position = [
                x * this.width + this.width / 2,
                y * this.width + this.width / 2
        ];

        this.render();
    },

    savePreviousSate: function() {
        this.previousState = this.state;
    },

    render: function() {
        this.liveSquare.visible = this.state && this.previousState;
        this.deadSquare.visible = !this.state && !this.previousState;
        this.bornSquare.visible = this.state && !this.previousState;
        this.diesSquare.visible = !this.state && this.previousState;
    }
});


var GameOfLife = Class.extend({

    init: function(cellWidth) {
        this.cellWidth = cellWidth ? cellWidth : 10;

        this.width = Math.floor(view.size.width / this.cellWidth);
        this.height = Math.floor(view.size.height / this.cellWidth);

        this.liveSymbol = new Symbol(new Path.Rectangle({
            position: [-100, -100],
            size: [this.cellWidth, this.cellWidth],
            strokeColor: 'black',
            fillColor: 'black'
        }));

        this.deadSymbol = new Symbol(new Path.Rectangle({
            position: [-100, -100],
            size: [this.cellWidth, this.cellWidth],
            strokeColor: 'black',
            fillColor: 'white'
        }));

        this.bornSymbol = new Symbol(new Path.Rectangle({
            position: [-100, -100],
            size: [this.cellWidth, this.cellWidth],
            strokeColor: 'black',
            fillColor: 'green'
        }));

        this.diesSymbol = new Symbol(new Path.Rectangle({
            position: [-100, -100],
            size: [this.cellWidth, this.cellWidth],
            strokeColor: 'black',
            fillColor: 'red'
        }));

        this.cells = [];
        for (var y = 0; y < this.height; y++) {
            var row = [];
            for (var x = 0; x < this.width; x++) {
                row[x] = new Cell(this, x, y);
            }

            this.cells[y] = row;
        }
    },

    render: function() {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.cells[y][x].render();
            }
        }
    },

    generate: function() {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.cells[y][x].savePreviousSate();
            }
        }

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {

                var neighbors = 0;
                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        neighbors += this.cells[(y + i + this.height) % this.height]
                            [(x + j + this.width) % this.width].previousState;
                    }
                }

                neighbors -= this.cells[y][x].previousState;

                if (this.cells[y][x].state && neighbors < 2) {
                    this.cells[y][x].state = false;
                } else if (this.cells[y][x].state && neighbors > 3) {
                    this.cells[y][x].state = false;
                } else if (!this.cells[y][x].state && neighbors == 3) {
                    this.cells[y][x].state = true;
                }
            }
        }
    }
});

var gol = new GameOfLife();

function onFrame(event) {
    gol.generate();
    gol.render();
}
