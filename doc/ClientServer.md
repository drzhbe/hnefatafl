Clients connect to the server

Client can wish to play
=======================

When client made a wish to play, server should place him into a lobby.
It could be an empty lobby or a half-full lobby (1/2 players).
When lobby is full (2/2) a game starts, it gets an id.
If game was started, server should maintain a game state (moves), and be able to continue a game if one of the clients disconnects.
So every player should have a list of his games: finished and not finished.