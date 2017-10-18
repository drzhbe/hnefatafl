var hasUI = typeof window != 'undefined';
var $ = require('jquery');
var directions = require('./directions');
var eat = require('./eat');

if (hasUI) {
    var $infoTurn = $('.info__turn');
    var $infoWinner = $('.info__winner');
    var moveSound = $('#move-sound')[0];
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
    return move;
}

/**
 * @param {State} appState
 * @param {Cell} from
 * @param {Cell} to
 * @param {String} direction
 * @param {Boolean} recievedMove — opponent's move came from internet and shouldn't be send
 * @returns Tween.To
 */
function move(appState, from, to, direction, recievedMove) {
    var movingTween;
    var moveRec = recordMove(from, to);
    appState.moves.push(moveRec);

    if (!recievedMove) {
        appState.socket.emit('move', moveRec);
    }

    if (hasUI) {
        movingTween = moveUI(appState, from, to, direction);
    }

    from.warrior.move(to);
    appState.changeActiveWarrior(null);

    if (hadWhiteWin(to)) {
        return movingTween;
    }

    if (!hasUI) {
        eat.neighbors(to, direction);
    }

    if (hadBlackWin(appState)) {
        return movingTween;
    }

    changeTurn(appState);

    return movingTween;
}

function hadWhiteWin(to) {
    if (to.type == 'corner' && to.warrior.isKing) {
        // white wins
        if (hasUI) {
            $infoTurn.hide();
            $infoWinner.addClass('_white');
            $infoWinner.show();
        }
        return true;
    }
}

function hadBlackWin(appState) {
    if (!appState.king) {
        // black wins
        if (hasUI) {
            $infoTurn.hide();
            $infoWinner.addClass('_black');
            $infoWinner.show();
        }
        return true;
    }
}

function changeTurn(appState) {
    if (hasUI) {
        $infoTurn.removeClass('_' + appState.turn);
    }
    appState.turn = appState.turn == 'black' ? 'white' : 'black';
    if (hasUI) {
        $infoTurn.addClass('_' + appState.turn);

        if (appState.turn === appState.color) {
            appState.board.element.addClass('_turn');
        } else {
            appState.board.element.removeClass('_turn');
        }
    }
}

/*
    @returns Tween.To
*/
function moveUI(appState, from, to, direction) {
    warriorEl = from.warrior.element;
    warriorEl.removeClass('_active');
    var tweenProps = {
        clearProps: 'transform',
        ease: Power3.easeOut,
        onComplete: function() {
            warriorEl.removeClass('_animating');
            warriorEl.css({top:5,left:5});
            to.element.append( warriorEl.detach() );

            eat.neighbors(appState, to, direction);
        }
    };
    switch (direction) {
        case 'top':
            tweenProps.y = (to.y - from.y) * from.size - 0;
            break;
        case 'bottom':
            tweenProps.y = (to.y - from.y) * from.size + 0;
            break;
        case 'left':
            tweenProps.x = (to.x - from.x) * from.size - 0;
            break;
        case 'right':
            tweenProps.x = (to.x - from.x) * from.size + 0;
            break;
    }

    // Detach warrior from cell to board to have highest Z index
    // Set _animating to have position absolute
    warriorEl.addClass('_animating');
    var offset = warriorEl.offset();
    appState.board.element.append(warriorEl.detach());
    warriorEl.offset(offset);

    moveSound.play();
    return TweenLite.to(warriorEl, 0.5, tweenProps);
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

function tryToMove(appState, from, to, recievedMove) {
    if ((appState.turn === appState.color || recievedMove) && // check if it is current client's turn
        from.warrior.color === appState.turn && // check if it is warrior's turn
        (!to.type || from.warrior.isKing) && !to.warrior &&
        (from.x === to.x || from.y === to.y)) {

        var direction = directions.get(from, to);
        if (isPathFree(from, to, direction)) {
            return move(appState, from, to, direction, recievedMove);
        }
    }
}

function tryToMoveActiveWarrior(appState, to, recievedMove) {
    if (appState.activeWarrior) {
        return tryToMove(appState, appState.activeWarrior.cell, to, recievedMove);
    }
}

module.exports = {
    tryToMoveActiveWarrior: tryToMoveActiveWarrior,
    tryToMove: tryToMove,
    move: move,
    moveUI: moveUI
};
