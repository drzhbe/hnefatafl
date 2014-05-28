var $ = require('jquery');
var state = require('./state');

function Warrior(x, y, color, isKing) {
    var self = this;
    this.x = x;
    this.y = y;
    this.cell = null;
    this.color = color;
    this.isKing = isKing || false;
    this.element = $('<div>')
        .addClass('warrior')
        .addClass('_' + color);
    if (isKing) {
        this.element.addClass('_king');
    }
    // we dont need to off this eventListener, jquery.remove will handle it
    this.element.on('click', function(e) {
        if (state.turn == self.color) {
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
}
Warrior.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};
Warrior.prototype.die = function() {
    this.element.remove();
    this.element = null;
};

module.exports = Warrior;