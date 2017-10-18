function State() {
    this.warriors = {
        white: [], // array of pointers to Warrior instances with white color
        black: [] // array of pointers to Warrior instances with black color
    },
    this.king = null, // pointer to King Warrior
    this.activeWarrior = null, // pointer to active Warrior — clicked and ready to move
    
    this.board = null,
    this.socket = null, // {socket.io} current client's socket @TODO: so bad to store socket in state
    this.color = null, // {String} current client's color @TODO: same here
    this.ai = null, // {Function} init fn of Artifical Intelligence
    this.moves = [],
    this.turn = 'black' // Black starts
}
State.prototype.removeWarrior = function(warrior) {
    var index = this.warriors[warrior.color].indexOf(warrior);
    this.warriors[warrior.color].splice(index, 1);
};
State.prototype.changeActiveWarrior = function(warrior) {
    var state = this;

    if (state.activeWarrior) {
        state.activeWarrior.element.removeClass('_active');
    }
    if (state.activeWarrior === warrior || !warrior) {
        state.activeWarrior = null;
    } else {
        state.activeWarrior = warrior;
        warrior.element.addClass('_active');
    }

    // call change of board if warrior was activated or deactivated
    var activeCell = state.activeWarrior && state.activeWarrior.cell;
    state.board.changeActiveCell(activeCell);
};

module.exports = State;
