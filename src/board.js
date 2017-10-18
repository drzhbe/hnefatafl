var $ = require('jquery');
var Cell = require('./cell');
var addWarrior = require('./rules');
/**
 * @param {State} appState
 * @param {Number} size of board, typically it's 11
 * @param {String} ruleSet
 *                 0 default hnefatafl game
 *                 1 rules board: goal
 *                 2 rules board: move
 *                 3 rules board: eat
 *                 4 rules board: throne and corners
 */
function Board(appState, size, ruleSet) {
    this.appState = appState;
    this.size = size;
    this.cells = []; // array of N=size arrays, each containing N cells
    this.element = null; // {Null|jQuery}
    this.ruleSet = ruleSet;
}
/**
 * Generate UI and bind events for:
 * - a Board
 * - all Cells
 * - all Warriors
 * So board generation with UI goes in 2 full for-loops.
 */
Board.prototype.generateUI = function(boardWrapper) {
    var size = this.size;
    
    this.element = $('<div>').addClass('board _' + this.appState.color);
    if (this.appState.color === this.appState.turn) {
        this.element.addClass('_turn');
    }
    
    for (var x = 0; x < size; x++) {
        var cellX = this.cells[x];
        for (var y = 0; y < size; y++) {
            cellX[y].generateUI(this.element);
            if (cellX[y].warrior) {
                cellX[y].warrior.generateUI(cellX[y].element);
            }
        }
    }

    boardWrapper.append(this.element);
};

/**
 * @param {DOMElement} boardWrapper
 */
Board.prototype.generate = function(boardWrapper) {
    var size = this.size;

    for (var x = 0; x < size; x++) {
        this.cells.push([]);
        for (var y = 0; y < size; y++) {
            this.addCell(x, y);
        }
    }

    if (boardWrapper) {
        this.generateUI(boardWrapper);
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

    var cell = new Cell(this.appState, this, x, y, cellType);
    this.cells[x].push( cell );

    addWarrior[this.ruleSet](cell, size);

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
Board.prototype.remove = function() {
    this.element.remove();
    this.element = null;
    this.cells.forEach(function(row) {
        row.forEach(function(cell) {
            cell.remove();
        });
    });
    this.cells = null;
    this.appState.warriors.black = [];
    this.appState.warriors.white = [];
    this.appState.king = null;
    this.ruleSet = null;
    this.appState = null;
};


module.exports = Board;
