# Запуск сервера
```javascript
node server/server.js
```

# Запуск клиента
index.html
В консоли браузера пишем `connect(server)`, где `server` — адрес сервера. В случае локального сервера, `server = 'http://localhost:3000'`.

# Запуск бота
```javascript
node scarlett/scarlett.js
```

# Написание бота
Бот лежит в папке `hnefatafl/scarlett`, где
`scarlett.js` — инициализация бота и подключение к серверу
`ai.js` — мозги бота
Чтобы писать логику можно исправлять функцию `scarlett/ai → analyze`. Сейчас там в зависимости от своего цвета, бот будет делать первый захардкоженный ход.
Данные о клектах лежат в `state.board.cells`
