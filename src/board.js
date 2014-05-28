var $ = require('jquery');
var Cell = require('./cell');
var Warrior = require('./warrior');
var state = require('./state');

function Board(size) {
    this.size = size;
    this.cells = []; // array of N=size arrays, each containing N cells
    this.element = $('<div>').addClass('board');
}
Board.prototype.generate = function() {
    var size = this.size;

    for (var x = 0; x < size; x++) {
        this.cells.push([]);
        this.cells[x].element = $('<div>').addClass('board__line');
        this.element.append( this.cells[x].element );
        for (var y = 0; y < size; y++) {
            this.addCell(x, y);
        }
    }

    $(document.body).append( this.element );

    return this;
};
function addWarrior(x, y, color) {
    var warrior = new Warrior(x, y, color);
    state.warriors[color].push( warrior );
    return warrior;
}
Board.prototype.addCell = function(x, y) {
    var size = this.size;
    var lastIndex = size - 1;
    var centerIndex = size >> 1; // divide by 2 and floor
    var cellType; // {String}

    if ((x == 0 && y == 0) ||
        (x == 0 && y == lastIndex) ||
        (x == lastIndex && y == 0) ||
        (x == lastIndex && y == lastIndex)) {

        cellType = 'corner';    
    }

    
    if (x == centerIndex &&
        y == centerIndex) {

        cellType = 'throne';
    }

    var cell = new Cell(x, y, cellType);
    this.cells[x].push( cell );
    this.cells[x].element.append( cell.element );

    var warrior;

    // Place black Warriors
    if ((y == 0 || y == lastIndex) && 
        (x > 2 && x < lastIndex - 2)) {

        warrior = addWarrior(x, y, 'black');
    } else if ((x == 0 || x == lastIndex) &&
        (y > 2 && y < lastIndex - 2)) {

        warrior = addWarrior(x, y, 'black');
    } else if (x == centerIndex && (y == 1 || y == lastIndex - 1)) {
        warrior = addWarrior(x, y, 'black');
    } else if (y == centerIndex && (x == 1 || x == lastIndex - 1)) {
        warrior = addWarrior(x, y, 'black');
    }

    // Place the King and white Warriors
    /*
            x
          x x x
        x x o x x
          x x x
            x
    */
    if (x == centerIndex &&
        y == centerIndex) {

        warrior = new Warrior(x, y, 'white', true);
        state.king = warrior;
    /*
            x
          x x x
        o o x o o
          x x x
            x
    */
    } else if (x == centerIndex &&
        (y > centerIndex - 3 && y < centerIndex + 3)) {

        warrior = addWarrior(x, y, 'white');
    /*
            o
          x o x
        x x x x x
          x o x
            o
    */
    } else if (y == centerIndex &&
        (x > centerIndex - 3 && x < centerIndex + 3)) {

        warrior = addWarrior(x, y, 'white');
    /*
            x
          o x o
        x x x x x
          o x o
            x
    */
    } else if ((x == centerIndex - 1 || x == centerIndex + 1) &&
        (y == centerIndex - 1 || y == centerIndex + 1)) {

        warrior = addWarrior(x, y, 'white');
    }

    if (warrior) {
        warrior.cell = cell;
        cell.warrior = warrior;
        cell.element.append( warrior.element );
    }

    return this;
};

module.exports = Board;
