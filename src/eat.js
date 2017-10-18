var directions = require('./directions');

/**
 * Eat victim on edge of the table
 * To eat victim on edge it should be `holders` on both sides of the victim
 * | o
 * | x o
 * | o
 *
 * @param {Cell} victimCell
 * @param {String} directionToVictim — direction from `the cell we came to` → to the victim
 */
function eatOnEdge(appState, victimCell, directionToVictim) {
    var sideHolders = 0;
    // if it is an edge of table, check neighbors of victim, to determine if it is occupied from all directions
    for (var i = 0; i < directions.list.length; i++) {
        var direction = directions.list[i];
        // check only neighbors, dont bother with already checked direction (lack of holder out of an edge)
        // and dont check the cell where we came to (opposite to directionToVictim)
        if (direction == directionToVictim || directions.opposite(direction) == directionToVictim) {
            continue;
        }

        var sideHolder = victimCell[direction]();
        if (sideHolder.type == 'corner' ||
            (sideHolder.warrior && sideHolder.warrior.color != victimCell.warrior.color)) {

            sideHolders++;
        }
    }
    if (sideHolders == 2) {
        killWarriorAt(appState, victimCell);
    }
}

/**
 * Eat warrior by closing it into the sandwich
 * |  o  |      |         |
 * |  x  |  or  |  o x o  |
 * |  o  |      |         |
 *
 * @param {Cell} holderCell
 * @param {Cell} attackerCell
 * @param {Cell} victimCell
 */
function eatSandwich(appState, holderCell, attackerCell, victimCell) {
    if (holderCell.type == 'corner' ||
        // one can be killed by throne if it is empty OR only black could be killed by throne if it is a king on the throne
        (holderCell.type == 'throne' && (!holderCell.warrior || victimCell.warrior == 'black')) ||
        (holderCell.warrior && holderCell.warrior.color == attackerCell.warrior.color)) {

        killWarriorAt(appState, victimCell);
    }
}

function killWarriorAt(appState, cell) {
    if (cell.warrior.isKing) {
        appState.king = null;
    } else {
        appState.removeWarrior(cell.warrior);
    }
    if (appState.activeWarrior === cell.warrior) {
        appState.activeWarrior = null;
    }
    cell.warrior.die();
    cell.warrior = null;
}

function eatKing(appState, victimCell, directionToVictim) {
    var freedom = 3;
    for (var j = 0; j < directions.list.length; j++) {
        var dir = directions.list[j];
        if (directions.opposite(dir) == directionToVictim) {
            continue;
        }

        var holderCell = victimCell[dir]();
        if (!holderCell ||
            (holderCell.warrior && holderCell.warrior.color != 'white') ||
            holderCell.type) {

            freedom--;
        } else {
            break;
        }
    }
    if (freedom == 0) {
        killWarriorAt(appState, victimCell);
        return;
        // @TODO: endgame here, black wins
    }
}

module.exports = {
    killWarriorAt: killWarriorAt,
    neighbors: function(appState, attackerCell, directionOfAttack) {
        for (var i = 0; i < directions.list.length; i++) {
            var direction = directions.list[i];
            // check for direction where we came from is redundant coz it is the cell where we stand now
            if (directions.opposite(direction) == directionOfAttack) {
                continue;
            }

            var victimCell = attackerCell[direction]();
            if (victimCell && victimCell.warrior && victimCell.warrior.color != attackerCell.warrior.color) {

                // now we have to check 3 neighbors of a king (excluding the `attackerCell`)
                if (victimCell.warrior.isKing) {
                    eatKing(appState, victimCell, direction);
                } else {
                    var holderCell = victimCell[direction]();
                    if (holderCell) {
                        eatSandwich(appState, holderCell, attackerCell, victimCell);
                    } else {
                        eatOnEdge(appState, victimCell, direction);
                    }
                }
            }
        }
    }
};
