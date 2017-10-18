var hasUI = typeof window != 'undefined';
var $ = require('jquery');
var Board = require('./board');

module.exports = function(state) {
	var boardWrapper = hasUI ? $('.main .boardWrapper') : undefined;
    state.board = new Board(state, 11, 'hnefatafl');
    state.board.generate(boardWrapper);

    if (typeof state.ai == 'function') {
        state.ai(state);
    }
};
