var $ = require('jquery');
var state = require('./state');
var tryToMove = require('./move');

function Cell(x, y, type) {
    var self = this;
    this.x = x;
    this.y = y;
    this.type = type;
    this.warrior = null;
    this.element = $('<div>').addClass('board__cell');
    if (type) {
        this.element.addClass('_' + type);
    }
    this.element.on('click', function() {
        tryToMove(self);
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
