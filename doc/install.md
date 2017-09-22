# Client
Open `index.html` in browser and type to the console (`F12` key or `cmd + alt + i`) `connect(server)`, where `server` — is address of the server. In the case of local server use `server = 'http://localhost:3000'`.

# Server
You can use global server `95.85.56.250/hnefserver` or run local:
```javascript
node server/server.js
```

# AI
You can play with AI. Run it with:
```javascript
node scarlett/scarlett.js
```

# Develop
Firt of all install dependencies: 
```javascript
npm i
```

For building a project we use webpack:
```javascript
npm i -g webpack
```

To see any changes you should build a project:
```javascript
webpack
```

# Develop AI
AI is located at `hnefatafl/scarlett`, where
`scarlett.js` — initialization of AI and connection to the server
`ai.js` — brain of AI
To write a logic you can modify function `scarlett/ai → analyze`. For now it will do hardcoded move depending on player's color. To make a decision where to move you can use data stored in `state.board.cells`.
