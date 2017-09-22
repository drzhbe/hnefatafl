var usersCount = 0;
var playingUsersCount = 0;
var lastRoom = 1;
var playersToRooms = {};
var io = require('socket.io')();
io.on('connection', function(socket) {
    usersCount++;
    io.emit('usersCountChanged', usersCount);

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
    });

    socket.on('move', function(move) {
        console.log('MOVE???');
        io.to(playersToRooms[socket.id]).emit('moveDone', move);
    });

    socket.on('leaveGame', function() {

    });

    socket.on('disconnect', function() {
        usersCount--;
        io.emit('usersCountChanged', usersCount);
    });
});
io.listen(3030);