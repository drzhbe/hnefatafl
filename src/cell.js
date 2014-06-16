var $ = require('jquery');
var state = require('./state');
var tryToMove = require('./move').tryToMove;

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
Cell.prototype.generateUI = function() {
    var self = this;
    this.element = $('<div>').addClass('board__cell');
    if (this.type) {
        this.element.addClass('_' + this.type);
    }
    this.element.on('click', function() {
        tryToMove(state.active.cell, self);
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

module.exports = Cell;
