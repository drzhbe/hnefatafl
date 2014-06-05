var $ = require('jquery');
var state = require('./state');

function Warrior(color, isKing) {
    this.cell = null;
    this.color = color;
    this.isKing = isKing || false;
}
Warrior.prototype.generateUI = function(first_argument) {
    var self = this;
    this.element = $('<div>')
        .addClass('warrior')
        .addClass('_' + this.color);
    if (this.isKing) {
        this.element.addClass('_king');
    }
    // we dont need to off this eventListener, jquery.remove will handle it
    this.element.on('click', function(e) {
        // check if it is turn of current client (socket)
        // check if it is turn of current warrior -___-
        if (state.turn == state.color && state.turn == self.color) {
            if (state.active) {
                state.active.element.removeClass('_active');
            }
            if (state.active == self) {
                state.active.element.removeClass('_active');
                state.active = null;
            } else {
                state.active = self;
                self.element.addClass('_active');
            }
        }
        e.stopPropagation(); // dont propagate on Cell if it is a Warrior here
    });
};
Warrior.prototype.move = function(cell) {
    this.cell.warrior = null;
    this.cell = cell;
    this.cell.warrior = this;
};
Warrior.prototype.die = function() {
    this.element.remove();
    this.element = null;
};

module.exports = Warrior;