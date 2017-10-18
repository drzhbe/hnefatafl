var $ = require('jquery');
var move = require('./move');
var directions = require('./directions');

/**
 * @param {State} appState
 * @param {Board} board
 * @param {Number} x
 * @param {Number} y
 * @param {String|Undefined} type ['corner'|'throne']
 */
function Cell(appState, board, x, y, type) {
    this.appState = appState;
    this.board = board;
    this.x = x;
    this.y = y;
    this.type = type;
    this.warrior = null;
    this.element = null; // {Null|jQuery}
};
Cell.prototype.size = 50;


Cell.prototype.generateUI = function(parent) {
    var self = this;
    this.element = $('<div>').addClass('board__cell');
    this.element.css({left: this.x * this.size, top: this.y * this.size});
    if (this.type) {
        this.element.addClass('_' + this.type);
    }
    this.element.append($('<div>').addClass('board__cell_moveMarker'));
    this.element.on('click', function() {
        move.tryToMoveActiveWarrior(self.appState, self);
    });
    if (parent) {
        parent.append(this.element);
    }
};
Cell.prototype.top = function() {
    var topY = this.y - 1;
    if (topY >= 0) {
        return this.board.cells[this.x][topY];
    }
};
Cell.prototype.bottom = function() {
    var bottomY = this.y + 1;
    if (bottomY < this.board.size) {
        return this.board.cells[this.x][bottomY];
    }
};
Cell.prototype.left = function() {
    var leftX = this.x - 1;
    if (leftX >= 0) {
        return this.board.cells[leftX][this.y];
    }
};
Cell.prototype.right = function() {
    var rightX = this.x + 1;
    if (rightX < this.board.size) {
        return this.board.cells[rightX][this.y];
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
        if (nextCell.warrior
            || (nextCell.type === 'corner' && !this.appState.activeWarrior.isKing))
        {
            return;
        }
        if (!(nextCell.type === 'throne' && !this.appState.activeWarrior.isKing)) {
            nextCell.mark(true);
        }
        nextCell = nextCell[direction]();
    }
};
Cell.prototype.remove = function() {
    this.element.remove();
    this.element = null;
    if (this.warrior) {
        this.warrior.die();
        this.warrior = null;
    }
    this.board = null;
    this.appState = null;
};

module.exports = Cell;
