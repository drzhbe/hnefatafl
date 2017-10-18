var hasUI = typeof window != 'undefined';
if (hasUI) {
    var $ = require('jquery');
    var $actionsPlay = $('.actions__play');
}
var game = require('./game');
var movement = require('./move');
var State = require('./State');
var Book = require('./Book');
var io = require('socket.io-client');

if (hasUI) {
    amplitude.getInstance().logEvent('INTRO_STARTED');
    $('.actions__play').on('click', function(e) {
        $(this).hide();
        $('.intro').hide();
        $('body').removeClass('_intro');
        connect();
        // connect('https://tafl.website');
        amplitude.getInstance().logEvent('PLAY_CLICKED');
    });
    $serverPopulation = $('.info__serverPopulation');
    $serverPopulationCount = $('.info__serverPopulationCount');


    // Intro animation finish
    var stroke = $('#path0_stroke');
    stroke.one('animationend', function () {
        $('#play-svg-blur').show();
        stroke.attr('fill', '#000')
    });

    // Create rules book
    global.book = new Book();
}
/**
 * @param {String} server — w/ or w/o scheme and w/ port ('http://localhost:3000')
 */
function connect(server) {
    if (server) {
        if (server.indexOf('http') == -1) {
            server = 'http://' + server;
        }
    } else {
        server = 'http://localhost:3030';
    }

    var socket = io(server, {path: '/server/socket.io'});
    var appState = new State();
    appState.server = server;
    appState.socket = socket;

    socket.on('connect', function() {
        console.log(socket.id)

        if (appState.board) {
            appState.board.remove();
            appState = new State();
            appState.server = server;
            appState.socket = socket;
        }

        socket.on('connected', function(socketId) {
            console.log(socketId)
        });
        socket.on('setColor', function(color) {
            // If color exists it means we already in game and it is just a reconnect.
            if (appState.color) return;

            appState.color = color;
            if (hasUI) {
                var $info = $('.info');
                var $brief = $info.find('.info__brief');
                var $warrior = $brief.find('.warrior');
                var $goal = $brief.find('.info__goal');

                $warrior.addClass('_' + color);

                var goal = color === 'white'
                    ? 'to escort <span class="warrior _king"></span> to any corner.'
                    : 'to catch <span class="warrior _king"></span> before he gets to the corner.';
                $goal.html(goal);

                $info.show();
            }
        });
        socket.on('usersCountChanged', function(usersCount) {
            if (hasUI) {
                $serverPopulationCount.text(usersCount);
            }
        });

        socket.emit('wishToPlay');
        socket.on('start', function(data) {
            console.log('Recieved `start` signal from socket')

            // create game
            game(appState);

            $('.info__brief').show();
            $('.info__turn').show();
            $('.info__waitingForPlayer').hide();

            amplitude.getInstance().logEvent('GAME_STARTED');
        });

        socket.on('moveDone', function(move) {
            console.log(typeof move, 'move', move);
            // if opponent's move done
            if (appState.color != move.color) {
                var from = appState.board.cells[move.x1][move.y1];
                var to = appState.board.cells[move.x2][move.y2];
                movement.tryToMove(appState, from, to, true);
            }
            // @TODO: send moveData on move and recieve moveData on enemyMove
        });

        if (hasUI) {
            $actionsPlay.on('click', function() {
                socket.emit('wishToPlay');
            });
        }

        socket.on('disconnect', function() {
            console.log('disconnected from server');
        });
    });
}

global.connect = connect;
