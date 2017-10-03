var $ = require('jquery');
var state = require('./state').state;
var move = require('./move');
var directions = require('./directions');
var Warrior = require('./warrior');

/**
 * @param {Number} x
 * @param {Number} y
 * @param {String|Undefined} type ['corner'|'throne']
 */
function Cell(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.warrior = null;
    this.element = null; // {Null|jQuery}
};
Cell.prototype.size = 50;


Cell.prototype.generateUI = function() {
    var self = this;
    this.element = $('<div>').addClass('board__cell');
    if (this.type) {
        this.element.addClass('_' + this.type);
    }
    this.element.append($('<div>').addClass('board__cell_moveMarker'));
    this.element.on('click', function() {
        if (state.activeWarrior) {
            move.tryToMove(state.activeWarrior.cell, self);
        }
    });
};
Cell.prototype.top = function() {
    var topY = this.y - 1;
    if (topY >= 0) {
        return state.board.cells[this.x][topY];
    }
};
Cell.prototype.bottom = function() {
    var bottomY = this.y + 1;
    if (bottomY < state.board.size) {
        return state.board.cells[this.x][bottomY];
    }
};
Cell.prototype.left = function() {
    var leftX = this.x - 1;
    if (leftX >= 0) {
        return state.board.cells[leftX][this.y];
    }
};
Cell.prototype.right = function() {
    var rightX = this.x + 1;
    if (rightX < state.board.size) {
        return state.board.cells[rightX][this.y];
    }
};
Cell.prototype.mark = function(enable) {
    if (!this.element) return;
    if (enable) {
        this.element.addClass('_possibleMove');
    } else {
        this.element.removeClass('_possibleMove');
    }
};
Cell.prototype.markPossibleMoves = function() {
    directions.list.forEach(this.markDirection.bind(this));
};
Cell.prototype.markDirection = function(direction) {
    var nextCell = this[direction]();
    while (nextCell) {
        if (nextCell.warrior || nextCell.type == 'corner') {
            return;
        }
        nextCell.mark(true);
        nextCell = nextCell[direction]();
    }
};

Cell.prototype.addWarriorHnefatafl = function(boardSize) {
    var lastIndex = boardSize - 1;
    var centerIndex = boardSize >> 1; // divide by 2 and floor
    var x = this.x;
    var y = this.y;
    var warrior;

    // Place black Warriors
    if ((y == 0 || y == lastIndex) && 
        (x > 2 && x < lastIndex - 2)) {

        warrior = new Warrior('black');
    } else if ((x == 0 || x == lastIndex) &&
        (y > 2 && y < lastIndex - 2)) {

        warrior = new Warrior('black');
    } else if (x == centerIndex && (y == 1 || y == lastIndex - 1)) {
        warrior = new Warrior('black');
    } else if (y == centerIndex && (x == 1 || x == lastIndex - 1)) {
        warrior = new Warrior('black');
    }

    // @TODO: following conditions should else if

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

        warrior = new Warrior('white', true);
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

        warrior = new Warrior('white');
    /*
            o
          x o x
        x x x x x
          x o x
            o
    */
    } else if (y == centerIndex &&
        (x > centerIndex - 3 && x < centerIndex + 3)) {

        warrior = new Warrior('white');
    /*
            x
          o x o
        x x x x x
          o x o
            x
    */
    } else if ((x == centerIndex - 1 || x == centerIndex + 1) &&
        (y == centerIndex - 1 || y == centerIndex + 1)) {

        warrior = new Warrior('white');
    }

    if (warrior) {
        warrior.cell = this;
        this.warrior = warrior;
    }
};

module.exports = Cell;
