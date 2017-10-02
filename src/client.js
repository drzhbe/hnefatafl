var hasUI = typeof window != 'undefined';
if (hasUI) {
    var $ = require('jquery');
    var $actionsPlay = $('.actions__play');
}
var game = require('./game');
var directions = require('./directions');
var movement = require('./move');
var state = require('./state');

if (hasUI) {
    amplitude.getInstance().logEvent('INTRO_STARTED');
    $('.actions__play').on('click', function(e) {
        $(this).hide();
        $('.intro').hide();
        $('body').removeClass('_intro');
        connect('https://tafl.website');
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
}
/**
 * @param {String} server — w/ or w/o scheme and w/ port ('http://localhost:3000')
 */
function connect(server) {
    console.log('\n\nserver', typeof server, server, '\n\n');
    if (server) {
        if (server.indexOf('http') == -1) {
            server = 'http://' + server;
        }
    } else {
        server = 'http://localhost:3030';
    }
    state.server = server;
    var socket = require('socket.io-client')(server, {path: '/server/socket.io'});
    socket.on('connect', function() {
        socket.on('setColor', function(color) {
            // If color exists it means we already in game and it is just a reconnect.
            if (state.color) return;

            state.color = color;
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

            // If board exists it means we already in game and it is just a reconnect.
            if (state.board) return;

            state.socket = socket;
            // create game
            game(state);

            $('.info__brief').show();
            $('.info__turn').show();
            $('.info__waitingForPlayer').hide();

            amplitude.getInstance().logEvent('GAME_STARTED');
        });

        socket.on('moveDone', function(move) {
            // if opponent's move done
            if (state.color != move.color) {
                var from = state.board.cells[move.x1][move.y1];
                var to = state.board.cells[move.x2][move.y2];
                // @TODO: dont do usual move
                // all i need is to actualize state by this recieved move
                movement.move(from, to, directions.get(from, to), true);
            }
            console.log(typeof move, 'move', move);
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
