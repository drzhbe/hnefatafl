var $ = require('jquery');
var move = require('./move');
var State = require('./State');
var Board = require('./board');
var Warrior = require('./warrior');
var killWarriorAt = require('./eat').killWarriorAt;

function Book() {
	this.element = $('.book');
	this.shown = false;
	this.pages = {};
	this.currentPage = undefined;

	// this.closeButton = $('<div>');
	// this.closeButton.addClass('book__closeButton');
	// this.closeButton.innerText = 'x';
	// this.element.append(this.closeButton);

	this.pageRustleSound = $('#page-rustle-sound')[0];
	this.pageHoverSound = $('#page-hover-sound')[0];



	var boardWrapper = $('<div>').addClass('boardWrapper');
	this.appState = new State();
	this.appState.board = new Board(this.appState, 11, 'empty');
	this.appState.board.generate(boardWrapper);
	this.element.append(boardWrapper);



	var self = this;
	var bookButton = $('.info__book');
	bookButton.on('click', function() {
		self.shown = !self.shown;
		if (self.shown) {
			self.shown = true;
			self.element.addClass('_shown');
			bookButton.addClass('_open');

			var page = self.pages.move;
			// var page = self.pages.goal;
			if (!page) {
				// page = self.createPage('move', 'All the pieces move like rooks in the chess: horizontally and vertically as long as there are no other pieces on the way.');
				// self.createPage('capture', 'To capture a piece enclose it to the "sandwich" from two opposite edges.');
				// self.createPage('goal', 'The goal of White is to escort his king to any corner.');

				['goal', 'king', 'capture', 'move'].forEach(self.createPage.bind(self));
				page = self.pages.move;
			}

			self.openPage(page);
		} else {
			self.element.removeClass('_shown');
			bookButton.removeClass('_open');

			self.stopActionsForPage(self.currentPage);
		}
	});

	// this.closeButton.on('click', function() {
	// 	self.shown = false;
	// 	self.element.removeClass('_shown');

	// 	self.stopActionsForPage(self.currentPage);
	// });

	self.element.on('click', function() {
		console.log('CLICK BOOK')
	})
}

Book.prototype.createPage = function(name, text) {
	var self = this;
	
	var page = {
		name: name,
		actions: [],
		moveTween: undefined,
		element: $('<div>').addClass('book__page _' + name),
		text: text
	};
	this.pages[name] = page;
	this.element.append(page.element);

	// var el = $('<div>').addClass('page__info _' + page.name);
	// var talkBubble = $('<div>').addClass('talk-bubble')
	// var talkText = $('<div>').addClass('talktext');
	// talkText.text(page.text);
	// talkBubble.append(talkText);
	// var viking = $('<div>').addClass('page__info-viking')

	// el.append(viking);
	// el.append(talkBubble);

	fetch('img/' + name + '-text.svg', {mode: 'no-cors'})
		.then(function(res) { return res.text() })
		.then(function(svg) {
			page.element.append(svg);
			page.element.find('#' + name + '-area')
				.on('mouseenter', function() {
					self.pageHoverSound.play();
					page.element.addClass('_hovered');
				})
				.on('mouseleave', function() {
					page.element.removeClass('_hovered');
				})
				.on('click', function() {
					self.openPage(page);
				});

		});

	return page;
}


Book.prototype.openPage = function(page) {
	this.pageRustleSound.play();

	// mark label and info
	// activePage.removeClass('_active');
	// el.addClass('_active');
	// activePage = el;

	if (this.currentPage) {
		this.stopActionsForPage(this.currentPage);
		this.currentPage.element.removeClass('_active');
	}
	this.currentPage = page;
	this.currentPage.element.addClass('_active');

	switch (page.name) {
		case 'move':
			this.moveAction(page, true);
			break;
		case 'capture':
			this.captureAction(page, true);
			break;
		case 'king':
			this.kingAction(page, true);
			break;
		case 'goal':
			this.goalAction(page, true);
			break;
	}
};


Book.prototype.stopActionsForPage = function(page) {
	page.actions.forEach(function(actionTimeout) {
		clearInterval(actionTimeout);
	});
	if (page.moveTween) {
		page.moveTween.kill();
	}
	page.moveTween = undefined;
	page.actions = [];
};


function addWarrior(appState, cell, color) {
	warrior = new Warrior(appState, color);
    warrior.cell = cell;
    cell.warrior = warrior;
    warrior.generateUI(cell.element);
    return warrior;
}

function killAllWarriors(appState) {
	appState.warriors.black.forEach(function(warrior) {
		warrior.die();
		warrior.cell.warrior = null;
	});
	appState.warriors.black = [];
	appState.warriors.white.forEach(function(warrior) {
		warrior.die();
		warrior.cell.warrior = null;
	});
	appState.warriors.white = [];
	if (appState.king) {
		appState.king.die();
		appState.king.cell.warrior = null;
		appState.king = null;
	}
}


Book.prototype.moveAction = function(page, pageJustOpened) {
	var self = this;
	var appState = this.appState;

	// Create new array of deferred actions and take from the old one only global cycle interval
	if (page.actions.length) {
		page.actions = [page.actions.pop()];
	}

	// Set default position
	appState.changeActiveWarrior(null);


	if (pageJustOpened) {
		killAllWarriors(appState);
		addWarrior(appState, appState.board.cells[2][7], 'white');
		addWarrior(appState, appState.board.cells[5][9], 'black');
		addWarrior(appState, appState.board.cells[8][8], 'king');
	} else {
		appState.warriors.white[0].move(appState.board.cells[2][7]);
		appState.board.cells[2][7].element.append( appState.warriors.white[0].element.detach() );

		appState.warriors.black[0].move(appState.board.cells[5][9]);
		appState.board.cells[5][9].element.append( appState.warriors.black[0].element.detach() );

		appState.king.move(appState.board.cells[8][8]);
		appState.board.cells[8][8].element.append( appState.king.element.detach() );
	}
	

	page.actions.push(setTimeout(function() {
		appState.color = 'white';
		appState.turn = 'white';
		appState.changeActiveWarrior(appState.board.cells[2][7].warrior);
	}, 500));
	page.actions.push(setTimeout(function() {
		page.moveTween = move.tryToMoveActiveWarrior(appState, appState.board.cells[2][9], true);
	}, 1500));
	page.actions.push(setTimeout(function() {
		appState.color = 'black';
		appState.turn = 'black';
		appState.changeActiveWarrior(appState.board.cells[5][9].warrior);
	}, 2500));
	page.actions.push(setTimeout(function() {
		page.moveTween = move.tryToMoveActiveWarrior(appState, appState.board.cells[3][9], true);
	}, 3500));
	page.actions.push(setTimeout(function() {
		appState.color = 'white';
		appState.turn = 'white';
		appState.changeActiveWarrior(appState.board.cells[8][8].warrior);
	}, 4500));
	page.actions.push(setTimeout(function() {
		page.moveTween = move.tryToMoveActiveWarrior(appState, appState.board.cells[1][8], true);
	}, 5500));
	page.actions.push(setTimeout(function() {
		self.moveAction(page);
	}, 7000));
};

Book.prototype.captureAction = function(page, pageJustOpened) {
	var self = this;
	var appState = this.appState;

	// Create new array of deferred actions and take from the old one only global cycle interval
	if (page.actions.length) {
		page.actions = [page.actions.pop()];
	}

	// Set default position
	appState.changeActiveWarrior(null);

	if (pageJustOpened) {
		killAllWarriors(appState);
		addWarrior(appState, appState.board.cells[4][9], 'white');
		addWarrior(appState, appState.board.cells[5][9], 'black');
		addWarrior(appState, appState.board.cells[6][8], 'white');
	} else {
		addWarrior(appState, appState.board.cells[5][9], 'black');
		appState.warriors.white[1].move(appState.board.cells[6][8]);
		appState.board.cells[6][8].element.append( appState.warriors.white[1].element.detach() );
	}
	

	page.actions.push(setTimeout(function() {
		appState.color = 'white';
		appState.turn = 'white';
		appState.changeActiveWarrior(appState.board.cells[6][8].warrior);
	}, 500));
	page.actions.push(setTimeout(function() {
		page.moveTween = move.tryToMoveActiveWarrior(appState, appState.board.cells[6][9], true);
	}, 1000));
	page.actions.push(setTimeout(function() {
		self.captureAction(page);
	}, 2000));
};

Book.prototype.kingAction = function(page, pageJustOpened) {
	var self = this;
	var appState = this.appState;

	// Create new array of deferred actions and take from the old one only global cycle interval
	if (page.actions.length) {
		page.actions = [page.actions.pop()];
	}

	// Set default position
	appState.changeActiveWarrior(null);

	if (pageJustOpened) {
		killAllWarriors(appState);
		addWarrior(appState, appState.board.cells[5][9], 'king');
		addWarrior(appState, appState.board.cells[4][9], 'black');
		addWarrior(appState, appState.board.cells[5][8], 'black');
		addWarrior(appState, appState.board.cells[5][10], 'black');
		addWarrior(appState, appState.board.cells[7][9], 'black');
	} else {
		addWarrior(appState, appState.board.cells[5][9], 'king');
		appState.warriors.black[3].move(appState.board.cells[7][9]);
		appState.board.cells[7][9].element.append( appState.warriors.black[3].element.detach() );
	}

	page.actions.push(setTimeout(function() {
		appState.color = 'black';
		appState.turn = 'black';
		appState.changeActiveWarrior(appState.board.cells[7][9].warrior);
	}, 500));
	page.actions.push(setTimeout(function() {
		page.moveTween = move.tryToMoveActiveWarrior(appState, appState.board.cells[6][9], true);
	}, 1000));
	page.actions.push(setTimeout(function() {
		self.kingAction(page);
	}, 2000));
};

Book.prototype.goalAction = function(page, pageJustOpened) {
	var self = this;
	var appState = this.appState;

	// Create new array of deferred actions and take from the old one only global cycle interval
	if (page.actions.length) {
		page.actions = [page.actions.pop()];
	}

	// Set default position
	appState.changeActiveWarrior(null);

	if (pageJustOpened) {
		killAllWarriors(appState);
		addWarrior(appState, appState.board.cells[5][7], 'king');
	} else {
		appState.king.move(appState.board.cells[5][7]);
		appState.board.cells[5][7].element.append( appState.king.element.detach() );
	}

	// Save all deferred actions so we can cancel them later
	page.actions.push(setTimeout(function() {
		appState.color = 'white';
		appState.turn = 'white';
		appState.changeActiveWarrior(appState.king);
	}, 500));
	page.actions.push(setTimeout(function() {
		page.moveTween = move.tryToMoveActiveWarrior(appState, appState.board.cells[5][10], true);
	}, 1000));
	page.actions.push(setTimeout(function() {
		appState.turn = 'white';
		appState.changeActiveWarrior(appState.king);
	}, 1500));
	page.actions.push(setTimeout(function() {
		page.moveTween = move.tryToMoveActiveWarrior(appState, appState.board.cells[10][10], true);
	}, 2000));
	page.actions.push(setTimeout(function() {
		self.goalAction(page);
	}, 3000));
};

module.exports = Book;
