var $ = require('jquery');
var state = require('./state');
var directions = require('./directions');

var $infoTurn = $('.info__turn');
var $infoWinner = $('.info__winner');

function recordMove(cell) {
    state.moves.push({
        color: state.active.color,
        isKing: state.active.isKing,
        x1: state.active.x,
        y1: state.active.y,
        x2: cell.x,
        y2: cell.y
    });
}

function move(cell, direction) {
    recordMove(cell);
    cell.element.append( state.active.element.detach() );
    state.active.element.removeClass('_active');
    state.active.x = cell.x;
    state.active.y = cell.y;
    state.active.cell.warrior = null; // rm warrior from old cell
    state.active.cell = cell; // set new cell to warrior
    state.active.cell.warrior = state.active; // set warrior to new cell
    state.active = null; // rm pointer to warrior from active

    if (cell.type == 'corner' && cell.warrior.isKing) {
        // white wins
        $infoTurn.hide();
        $infoWinner.addClass('_white');
        $infoWinner.show();
        return;
    }

    eatNeighbors(cell, direction);

    if (!state.king) {
        // black wins
        $infoTurn.hide();
        $infoWinner.addClass('_black');
        $infoWinner.show();
        return;
    }

    // change turn
    $infoTurn.removeClass('_' + state.turn);
    state.turn = state.turn == 'black' ? 'white' : 'black';
    $infoTurn.addClass('_' + state.turn);
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

function tryToMove(cell) {
    if (state.active && state.active.color == state.turn &&
        (!cell.type || state.active.isKing) && !cell.warrior &&
        (state.active.x == cell.x || state.active.y == cell.y)) {

        var direction = directions.get(state.active.cell, cell);
        if (isPathFree(state.active.cell, cell, direction)) {
            move(cell, direction);
        }
    }
}

module.exports = tryToMove;
