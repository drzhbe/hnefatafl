var usersCount = 0;
var playingUsersCount = 0;
var lastRoom = 1;
var playersToRooms = {};
var disconnectedPlayers = {};
var io = require('socket.io')();
io.on('connection', function(socket) {
    usersCount++;
    console.log('+', socket.id, usersCount, playingUsersCount)
    io.emit('usersCountChanged', usersCount);
    io.to(socket.id).emit('connected', socket.id);

    socket.on('wishToPlay', function() {
        playingUsersCount++;
        socket.join(lastRoom);
        playersToRooms[socket.id] = lastRoom;

        if (playingUsersCount % 2 == 0) {
            io.to(socket.id).emit('setColor', 'white');
            io.to(lastRoom).emit('start', 'start');
            lastRoom++;
        } else {
            io.to(socket.id).emit('setColor', 'black');
        }

        console.log('$', socket.id, usersCount, playingUsersCount, lastRoom, playersToRooms, io.sockets.adapter.rooms)
    });

    socket.on('move', function(move) {
        io.to(playersToRooms[socket.id]).emit('moveDone', move);
    });

    socket.on('leaveGame', function() {

    });

    socket.on('disconnect', function() {
        
        usersCount--;
        // Last room would be more than player's room if the pair connected and game started
        if (playersToRooms[socket.id] < lastRoom) {
            playingUsersCount--;
        }
        delete playersToRooms[socket.id];
        console.log('-', socket.id, usersCount, playingUsersCount, lastRoom, playersToRooms, io.sockets.adapter.rooms)
        io.emit('usersCountChanged', usersCount);
        // io.to(playersToRooms[socket.id]).emit('endGame', {reason: 'opponentDisconnected', loserId: socket.id});
    });
});
io.listen(3030, {path: '/server/socket.io'});
