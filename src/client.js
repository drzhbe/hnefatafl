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
    $('.actions__connectToCommonServer').on('click', function(e) {
        $(this).hide();
        $('.intro').hide();
        $('body').removeClass('_intro');
        connect('http://hnef.besokind.ru/');
    });
    $serverPopulation = $('.info__serverPopulation');
    $serverPopulationCount = $('.info__serverPopulationCount');


    // $introKing = $('.intro__king');
    // $introKing.addClass('_rollIn');
    // setTimeout(function() {
    //     $introAxe = $('.intro__axe');
    //     $introAxe.each(function(i, axe) {
    //         $(axe).addClass('_rollIn');
    //     });
    // }, 1000)
    // setTimeout(function() {
    //     $introShield = $('.intro__shield');
    //     $introShield.each(function(i, shield) {
    //         $(shield).addClass('_rollIn');
    //     });
    // }, 1500)


    TweenLite.to($('.intro__king'), 2, {
        y: window.innerHeight/2
    });


    TweenLite.to($('.intro__shield._left'), 0.8, {
        x: window.innerWidth/2,
        rotation: 360,
        ease: Back.easeOut,
        delay: 1.5
    });
    TweenLite.to($('.intro__shield._right'), 0.8, {
        x: -window.innerWidth/2,
        rotation: 360,
        ease: Back.easeOut,
        delay: 1.5
    });


    TweenLite.to($('.intro__axe._left'), 1, {
        x: window.innerWidth/2 - 50,
        y: -window.innerHeight/2,
        rotation: 340,
        delay: 1
    });
    TweenLite.to($('.intro__axe._mid'), 1, {
        y: -window.innerHeight/2+50,
        rotation: 360,
        delay: 1
    });
    TweenLite.to($('.intro__axe._right'), 1, {
        x: -window.innerWidth/2 + 50,
        y: -window.innerHeight/2,
        rotation: 400,
        delay: 1
    });
    
}
/**
 * @param {String} server — w/ or w/o scheme and w/ port ('http://localhost:3000')
 */
function connect(server) {
    console.log('\n\nserver', typeof server, server, '\n\n');
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
        socket.on('setColor', function(color) {
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
            state.socket = socket;
            // create game
            game(state);

            $('.info__brief').show();
            $('.info__turn').show();
            $('.info__waitingForPlayer').hide();
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
