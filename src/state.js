var state = {
    warriors: {
        white: [], // array of pointers to Warrior instances with white color
        black: [] // array of pointers to Warrior instances with black color
    },
    rmWarrior: function(warrior) {
        var index = this.warriors[warrior.color].indexOf(warrior);
        this.warriors[warrior.color].splice(index);
    },
    king: null, // pointer to King Warrior
    active: null, // pointer to active Warrior — clicked and ready to move
    board: null,
    moves: [],
    turn: 'black' // Black starts
};

global.state = state;
module.exports = state;