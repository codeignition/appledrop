var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
 
var players = {};
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function (socket) {
  console.log('a user connected');
  
  // create a new player and add it to our players object
  var playerType = null;

  players[socket.id] = {
    playerId: socket.id,
    playerType: 'hero',
    x:0,
    y:0
  };
  
  console.log(players);
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);
 
  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected');
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
    socket.broadcast.emit('playerRemoved', socket.id);
  });

  socket.on('movementChanged', function (data) {
    socket.broadcast.emit('playerMoved', data);

    if(Math.random() > .997 ){
        console.log("creating an enemy")
        io.emit('enemyCreated', {x: 360, y: Math.floor(Math.random() * 640)});
    }

  });

  socket.on('enemyMoved', function (data) {
    io.emit('enemyMoved', data);
  });
  
  socket.on('enemyCreated', function (data) {
    io.emit('enemyCreated', data);
  });

  socket.on('gameOver', function () {
    io.emit('gameOver');
  });



});
 
server.listen(process.env.PORT || 8080, function () {
  console.log(`Listening on ${server.address().port}`);
});