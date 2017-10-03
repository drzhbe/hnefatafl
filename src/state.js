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
    this.warriors[warrior.color].splice(index);
};
State.prototype.changeActiveWarrior = function(warrior) {
    this.activeWarrior = warrior;
    this.board.changeActiveCell(warrior && warrior.cell);
};

global.state = new State();
module.exports = {
    State: State,
    state: global.state
}