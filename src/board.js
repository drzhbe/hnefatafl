var $ = require('jquery');
var Cell = require('./cell');
var Warrior = require('./warrior');
var state = require('./state').state;

function Board(size) {
    this.size = size;
    this.cells = []; // array of N=size arrays, each containing N cells
    this.element = null; // {Null|jQuery}
}
/**
 * Generate UI and bind events for:
 * - a Board
 * - all Cells
 * - all Warriors
 * So board generation with UI goes in 2 full for-loops.
 */
Board.prototype.generateUI = function() {
    var size = this.size;
    
    this.element = $('<div>').addClass('board');
    
    for (var x = 0; x < size; x++) {
        var cellX = this.cells[x];
        cellX.element = $('<div>').addClass('board__line');
        this.element.append( cellX.element );
        for (var y = 0; y < size; y++) {
            cellX[y].generateUI();
            cellX.element.append( cellX[y].element );
            if (cellX[y].warrior) {
                cellX[y].warrior.generateUI();
                cellX[y].element.append( cellX[y].warrior.element );
            }
        }
    }

    var boardWrapper = $('.boardWrapper');
    if (!boardWrapper.length) {
        boardWrapper = $(document.body);
    }
    boardWrapper.append(this.element);
};
/**
 * @param {Boolean} hasUI — whether we should generate UI or not
 */
Board.prototype.generate = function(hasUI) {
    var size = this.size;

    for (var x = 0; x < size; x++) {
        this.cells.push([]);
        for (var y = 0; y < size; y++) {
            this.addCell(x, y);
        }
    }

    if (hasUI) {
        this.generateUI();
    }

    return this;
};
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

    cell.addWarriorHnefatafl(size);

    return cell;
};
Board.prototype.changeActiveCell = function(activeCell) {
    // Disable old marks
    this.cells.forEach(function(row) {
        row.forEach(function(cell) {
            cell.mark(false);
        });
    });

    if (activeCell) {
        activeCell.markPossibleMoves();
    }
};

module.exports = Board;
