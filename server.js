const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('message', ({ contact, msg }) => {
    io.emit('message', { contact, msg });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(5000, '0.0.0.0', () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
