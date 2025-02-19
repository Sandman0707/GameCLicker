const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Папка с вашими HTML файлами

io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id);

  // Отправляем пользователю информацию о других пользователях в сети
  socket.broadcast.emit('user-connected', socket.id);

  // Обрабатываем сообщения с предложениями, ответами и кандидатами ICE
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
    socket.broadcast.emit('user-disconnected', socket.id);
  });
});

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
