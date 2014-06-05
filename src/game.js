var hasUI = typeof window != 'undefined';
var Board = require('./board');

module.exports = function(socket) {
    state.board = new Board(11);
    state.board.generate(hasUI);
    state.socket = socket;
};
