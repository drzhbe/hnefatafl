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
    $connect = $('.actions__connect');
    $serverValue = $('.actions__connectServer');
    $connect.on('submit', function(e) {
        // take server and connect to it
        connect($serverValue.val());
        e.preventDefault();
    });
    $('.actions__connectToCommonServer').on('click', function(e) {
        $(this).hide();
        connect('95.85.56.250/hnefserver');
    });
    $color = $('.playerInfo__color');
    $server = $('.playerInfo__serverName');
    $serverPopulation = $('.playerInfo__serverPopulation');
    $serverPopulationCount = $('.playerInfo__serverPopulationCount');
}
/**
 * @param {String} server — w/ or w/o scheme and w/ port ('http://localhost:3000')
 */
function connect(server) {
    if (server) {
        if (server.indexOf('http://') == -1) {
            server = 'http://' + server;
        }
    } else {
        server = 'http://localhost:3030';
    }
    state.server = server;
    var socket = require('socket.io-client')(server);
    socket.on('connect', function() {
        if (hasUI) {
            $server.text(server);
            $serverPopulation.show();
        }
        socket.on('setColor', function(color) {
            state.color = color;
            if (hasUI) {
                $color.show();
                $color.addClass('_' + color);
            }
        });
        socket.on('usersCountChanged', function(usersCount) {
            if (hasUI) {
                $serverPopulationCount.text(usersCount);
            }
        });

        socket.emit('wishToPlay');
        socket.on('start', function(data) {
            state.socket = socket;
            // create game
            game(state);
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

        socket.on('disconnect', function() {});
    });
}

global.connect = connect;
