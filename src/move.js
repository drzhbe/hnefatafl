var hasUI = typeof window != 'undefined';
var $ = require('jquery');
var state = require('./state').state;
var directions = require('./directions');
var eat = require('./eat');

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
 * @param {Boolean} recievedMove — opponent's move came from internet and shouldn't be send
 */
function move(from, to, direction, recievedMove) {
    var moveRec = recordMove(from, to);
    if (!recievedMove) {
        sendMove(moveRec);
    }
    if (hasUI) {
        warriorEl = $(from.warrior.element);
        var tweenProps = {
            clearProps: 'transform',
            onComplete: function() {
                warriorEl.removeClass('_animating');
                warriorEl.css({top:5,left:5});
                to.element.append( warriorEl.detach() );

                eat.neighbors(to, direction);
            }
        };
        switch (direction) {
            case 'top':
                tweenProps.y = (to.y - from.y) * from.size - 7;
                break;
            case 'bottom':
                tweenProps.y = (to.y - from.y) * from.size + 7;
                break;
            case 'left':
                tweenProps.x = (to.x - from.x) * from.size - 7;
                break;
            case 'right':
                tweenProps.x = (to.x - from.x) * from.size + 7;
                break;
        }

        // Detach warrior from cell to board to have highest Z index
        // Set _animating to have position absolute
        warriorEl.addClass('_animating');
        var offset = warriorEl.offset();
        $('.board').append(warriorEl.detach());
        warriorEl.offset(offset);

        TweenLite.to(from.warrior.element, 1, tweenProps);
        
        from.warrior.element.removeClass('_active');
    }
    from.warrior.move(to);
    state.changeActiveWarrior(null);

    if (to.type == 'corner' && to.warrior.isKing) {
        // white wins
        if (hasUI) {
            $infoTurn.hide();
            $infoWinner.addClass('_white');
            $infoWinner.show();
        }
        return;
    }

    if (!hasUI) {
        eat.neighbors(to, direction);
    }

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

function tryToMove(from, to, recievedMove) {
    if (state.turn === state.color && // check if it is current client's turn
        from.warrior.color === state.turn && // check if it is warrior's turn
        (!to.type || from.warrior.isKing) && !to.warrior &&
        (from.x === to.x || from.y === to.y)) {

        var direction = directions.get(from, to);
        if (isPathFree(from, to, direction)) {
            move(from, to, direction, recievedMove);
        }
    }
}

module.exports = {
    tryToMove: tryToMove,
    move: move
};
