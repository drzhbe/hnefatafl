var hasUI = typeof window != 'undefined';
var Board = require('./board');

module.exports = function(state) {
    state.board = new Board(11);
    state.board.generate(hasUI);
    if (typeof state.ai == 'function') {
        state.ai(state);
    }
};
