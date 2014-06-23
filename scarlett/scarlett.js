var server = 'http://localhost:3000';
var socket = require('socket.io-client')(server);
var game = require('../src/game');
var ai = require('./ai');
var state = require('../src/state');
state.ai = ai;

socket.on('connect', function() {
    socket.on('setColor', function(color) {
        state.color = color;
    });

    socket.on('start', function() {
        console.log('started');
        state.socket = socket;
        game(state);
    });

    socket.emit('wishToPlay');
});
