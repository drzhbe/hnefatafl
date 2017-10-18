var $ = require('jquery');

/*
    @param {State} appState
    @param {String} color ['black'|'white'|'king']
 */
function Warrior(appState, color) {
    this.appState = appState;
    this.cell = null;
    this.isKing = color === 'king';
    this.color = this.isKing ? 'white' : color;

    if (this.isKing) {
        this.appState.king = this;
    } else {
        this.appState.warriors[color].push( this );
    }
}
Warrior.prototype.generateUI = function(parent) {
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
        if (self.appState.turn == self.appState.color &&
            self.appState.turn == self.color)
        {
            self.appState.changeActiveWarrior(self);
        }
        e.stopPropagation(); // dont propagate on Cell if it is a Warrior here
    });
    if (parent) {
        parent.append(this.element);
    }
};
Warrior.prototype.move = function(cell) {
    this.cell.warrior = null;
    this.cell = cell;
    this.cell.warrior = this;
};
Warrior.prototype.die = function() {
    this.element.remove();
    this.element = null;
    this.cell = null;
    this.appState = null;
};

module.exports = Warrior;