var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

console.log("In Server.js");
server.listen(3000, () => console.log('listening on *:3000'));

io.on('connection', function (socket) {
  console.log('SUCCESS CONNECTION !!!');
  socket.on('room', function(room) {
        socket.join(room);
    });

  socket.on('message', function(message) {
        console.log("MESSAGE ==> ", message);
    });

  socket.on('my other event', function (data) {
    console.log(data);
  });
});
