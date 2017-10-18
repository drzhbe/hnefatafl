var Warrior = require('./warrior');

function hnefatafl(cell, boardSize) {
    var lastIndex = boardSize - 1;
    var centerIndex = boardSize >> 1; // divide by 2 and floor
    var x = cell.x;
    var y = cell.y;
    var warrior;

    // Place black Warriors
    if ((y == 0 || y == lastIndex) && 
        (x > 2 && x < lastIndex - 2)) {

        warrior = new Warrior(cell.appState, 'black');
    } else if ((x == 0 || x == lastIndex) &&
        (y > 2 && y < lastIndex - 2)) {

        warrior = new Warrior(cell.appState, 'black');
    } else if (x == centerIndex && (y == 1 || y == lastIndex - 1)) {
        warrior = new Warrior(cell.appState, 'black');
    } else if (y == centerIndex && (x == 1 || x == lastIndex - 1)) {
        warrior = new Warrior(cell.appState, 'black');
    }

    // @TODO: following conditions should else if

    // Place the King and white Warriors
    /*
            x
          x x x
        x x o x x
          x x x
            x
    */
    if (x == centerIndex &&
        y == centerIndex) {

        warrior = new Warrior(cell.appState, 'king');
    /*
            x
          x x x
        o o x o o
          x x x
            x
    */
    } else if (x == centerIndex &&
        (y > centerIndex - 3 && y < centerIndex + 3)) {

        warrior = new Warrior(cell.appState, 'white');
    /*
            o
          x o x
        x x x x x
          x o x
            o
    */
    } else if (y == centerIndex &&
        (x > centerIndex - 3 && x < centerIndex + 3)) {

        warrior = new Warrior(cell.appState, 'white');
    /*
            x
          o x o
        x x x x x
          o x o
            x
    */
    } else if ((x == centerIndex - 1 || x == centerIndex + 1) &&
        (y == centerIndex - 1 || y == centerIndex + 1)) {

        warrior = new Warrior(cell.appState, 'white');
    }

    if (warrior) {
        warrior.cell = cell;
        cell.warrior = warrior;
    }
};

function goal(cell, boardSize) {
	var lastIndex = boardSize - 1;
    var centerIndex = boardSize >> 1; // divide by 2 and floor
    var x = cell.x;
    var y = cell.y;
    var warrior;

    if (x == centerIndex &&
        y == centerIndex)
    {
        warrior = new Warrior(cell.appState, 'king');
    }

    if (warrior) {
        warrior.cell = cell;
        cell.warrior = warrior;
    }
}

function move(cell, boardSize) {
	var lastIndex = boardSize - 1;
    var centerIndex = boardSize >> 1; // divide by 2 and floor
    var x = cell.x;
    var y = cell.y;
    var warrior;

    if (x == 2 && y == 7) {
        warrior = new Warrior(cell.appState, 'white');
    } else if (x == 5 && y == 9) {
    	warrior = new Warrior(cell.appState, 'black');
    } else if (x == 8 && y == 8) {
    	warrior = new Warrior(cell.appState, 'king');
    }

    if (warrior) {
        warrior.cell = cell;
        cell.warrior = warrior;
    }
}

function capture(cell, boardSize) {
	var lastIndex = boardSize - 1;
    var centerIndex = boardSize >> 1; // divide by 2 and floor
    var x = cell.x;
    var y = cell.y;
    var warrior;

    if (x == 2 && y == 8) {
        warrior = new Warrior(cell.appState, 'white');
    } else if (x == 3 && y == 8) {
    	warrior = new Warrior(cell.appState, 'black');
    } else if (x == 4 && y == 5) {
    	warrior = new Warrior(cell.appState, 'white');
    }

    if (warrior) {
        warrior.cell = cell;
        cell.warrior = warrior;
    }
}

function king(cell, boardSize) {
    var lastIndex = boardSize - 1;
    var centerIndex = boardSize >> 1; // divide by 2 and floor
    var x = cell.x;
    var y = cell.y;
    var warrior;

    if (x == 2 && y == 8) {
        warrior = new Warrior(cell.appState, 'white');
    } else if (x == 3 && y == 8) {
        warrior = new Warrior(cell.appState, 'black');
    } else if (x == 4 && y == 5) {
        warrior = new Warrior(cell.appState, 'white');
    }

    if (warrior) {
        warrior.cell = cell;
        cell.warrior = warrior;
    }
}

function corners(cell, boardSize) {
	var lastIndex = boardSize - 1;
    var centerIndex = boardSize >> 1; // divide by 2 and floor
    var x = cell.x;
    var y = cell.y;
    var warrior;

    if (x == 3 && y == 3) {
        warrior = new Warrior(cell.appState, 'white');
    } else if (x == 4 && y == 3) {
    	warrior = new Warrior(cell.appState, 'black');
    } else if (x == 5 && y == 8) {
    	warrior = new Warrior(cell.appState, 'white');
    }

    if (warrior) {
        warrior.cell = cell;
        cell.warrior = warrior;
    }
}

function empty() {
    // Board without warriors used in rules book
}

module.exports = {
	hnefatafl: hnefatafl,
	goal: goal,
	move: move,
	capture: capture,
    king: king,
	corners: corners,
    empty: empty
};
