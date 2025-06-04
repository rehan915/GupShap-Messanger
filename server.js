const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/join.html');
});

let users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    io.emit('receive', {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      socket.broadcast.emit('user-left', users[socket.id]);
      delete users[socket.id];
    }
  });
});

http.listen(PORT, () => {
  console.log(`Gupshap Messenger running at http://localhost:${PORT}`);
});
