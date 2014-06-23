var state;
var movement = require('../src/move');
var directions = require('../src/directions');

function analyze(state) {
    var move = {};

    if (state.color == 'black') {
        move.from = state.board.cells[1][5];
        move.to = state.board.cells[1][1];
    } else {
        move.from = state.board.cells[5][3];
        move.to = state.board.cells[5][8];
    }

    return move;
}

function doMove() {
    var move = analyze(state);
    movement.tryToMove(move.from, move.to);
}

module.exports = function(initState) {
    state = initState;

    state.socket.on('moveDone', function(move) {
        // if opponent's move done
        if (state.color != move.color) {
            var from = state.board.cells[move.x1][move.y1];
            var to = state.board.cells[move.x2][move.y2];

            // apply recieved move to state
            movement.move(from, to, directions.get(from, to), true);

            // and then do own move
            doMove();
        }
    });

    if (state.color == state.turn) {
        doMove();
    }
};
