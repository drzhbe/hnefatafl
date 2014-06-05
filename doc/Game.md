Game
====

When 2 clients met on the server wishing to play, a game creates.
Server send the 'start' message and both clients initiates a game onStart.
The game is made of board. The board is made of cells.
There are warriors on some cells.

Each cell is listened for a click and
— could be activated if it has a warrior
— could be a move target if it is an active warrior (selected in 1st case)

After each move client should not be able to select or move something.
It is an opponent's move phase.
A game should be able to recieve moves and make according changes on the board.

Flow
====

client( browser | uiLessBot )

clientWantToPlay()
clientWantToPlay()
    forEach(client)
        game(socket)
            createBoard()
            bindCells() ← if browser

        move()
            validateMove()
            sendMove(socket)
            recieveMove(socket.on(opponentMove))

eventEmitterForSinglePlayer?
