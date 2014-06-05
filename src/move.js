var hasUI = typeof window != 'undefined';
var $ = require('jquery');
var state = require('./state');
var directions = require('./directions');

if (hasUI) {
    var $infoTurn = $('.info__turn');
    var $infoWinner = $('.info__winner');
}

function recordMove(from, to) {
    var move = {
        color: from.warrior.color,
        isKing: from.warrior.isKing,
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y
    };
    state.moves.push(move);
    return move;
}

function sendMove(move) {
    state.socket.emit('move', move);
}

/**
 * @param {Cell} from
 * @param {Cell} to
 * @param {String} direction
 * @param {Boolean} recievedMove — флаг говорит о том, что мы не приняли этот ход от оппонента
 */
function move(from, to, direction, recievedMove) {
    var moveRec = recordMove(from, to);
    if (!recievedMove) {
        sendMove(moveRec);
    }
    if (hasUI) {
        to.element.append( from.warrior.element.detach() );
        from.warrior.element.removeClass('_active');
    }
    from.warrior.move(to);
    state.active = null; // rm pointer to warrior from active

    if (to.type == 'corner' && to.warrior.isKing) {
        // white wins
        if (hasUI) {
            $infoTurn.hide();
            $infoWinner.addClass('_white');
            $infoWinner.show();
        }
        return;
    }

    eatNeighbors(to, direction);

    if (!state.king) {
        // black wins
        if (hasUI) {
            $infoTurn.hide();
            $infoWinner.addClass('_black');
            $infoWinner.show();
        }
        return;
    }

    // change turn
    if (hasUI) {
        $infoTurn.removeClass('_' + state.turn);
    }
    state.turn = state.turn == 'black' ? 'white' : 'black';
    if (hasUI) {
        $infoTurn.addClass('_' + state.turn);
    }
}

// store directions outside fn will decrease access speed, but save memory → decrease GC pressure
// also check for direction where we came from is redundant
function eatNeighbors(cell, ourDirection) {
    for (var i = 0; i < directions.list.length; i++) {
        var direction = directions.list[i];
        if (direction == ourDirection) {
            continue;
        }

        var victim = cell[direction]();
        if (victim && victim.warrior && victim.warrior.color != cell.warrior.color) {

            // now we have to check 3 neighbors of a king (excluding the `cell`)
            if (victim.warrior.isKing) {
                var freedom = 3;
                for (var j = 0; j < directions.list.length; j++) {
                    var dir = directions.list[j];
                    if (directions.opposite(dir) == direction) {
                        continue;
                    }

                    var gangerCell = victim[dir]();
                    if (!gangerCell ||
                        (gangerCell.warrior && gangerCell.warrior.color != 'white') ||
                        gangerCell.type) {

                        freedom--;
                    } else {
                        break;
                    }
                }
                if (freedom == 0) {
                    victim.warrior.die();
                    victim.warrior = null;
                    state.king = null;
                    return;
                    // @TODO: endgame here, black wins
                }
            } else {
                var holder = victim[direction]();
                if (holder &&
                    (holder.type == 'corner' ||
                        (holder.warrior && holder.warrior.color == cell.warrior.color))) {

                    state.rmWarrior(victim.warrior);
                    victim.warrior.die();
                    victim.warrior = null;
                }
            }

        }
    }
}

function isPathFree(from, to, direction) {
    var nextCell = from[direction]();
    while (nextCell && nextCell != to) {
        if (nextCell.warrior || nextCell.type == 'corner') {
            return false;
        }
        nextCell = nextCell[direction]();
    }
    return true;
}

function tryToMove(from, to) {
    if (state.turn == state.color && // check if it is current client's turn
        from.warrior.color == state.turn && // check if it is warrior's turn
        (!to.type || from.warrior.isKing) && !to.warrior &&
        (from.x == to.x || from.y == to.y)) {

        var direction = directions.get(from, to);
        if (isPathFree(from, to, direction)) {
            move(from, to, direction);
        }
    }
}

module.exports = {
    tryToMove: tryToMove,
    move: move
};
