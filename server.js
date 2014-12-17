var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.port || 8000;

var browserify = require('browserify-middleware');

app.use(express.static(__dirname + '/dist'));

app.get('/main.js', function (req, res) {
  return res.sendFile(__dirname + '/app/dist/js/main.js');
});
app.get('/main.css', function (req, res) {
  return res.sendFile(__dirname + '/main.css');
});

app.get('/*', function (req, res) {
  return res.sendFile(__dirname + '/app/index.html');
});

io.on('connection', function (socket) {
  console.log('a user has connected.');

  socket.on('disconnect', function () {
    console.log('a user has disconnected.');
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});