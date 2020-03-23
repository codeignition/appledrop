var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
 


//{roomName: players[]}
var playersInRooms = {};
//{socketId: roomName}
var socketIdRoomNameMap = {};

var highestScoreInRoom = {};
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/game', function (req, res) {
  res.sendFile(__dirname + '/game.html');
});
 

 setTimeout(function prn(i){
    console.log('Creating enemy');
    io.emit('enemyCreated', {x: 360, y: Math.floor(Math.random() * 450)});
    setTimeout(prn, 2000, i);
  }, 2000, 0);


io.on('connection', function (socket) {

  console.log('a user connected', socket.handshake.query.room);
  var roomName = socket.handshake.query.room;
  
  // create a new player and add it to our players object
  var playerType = null;

  socket.join(roomName);

  if(roomName in playersInRooms){
    playersInRooms[roomName].push({
      playerId: socket.id,
      playerType: 'hero',
      x:0,
      y:0
    })
  }else{
    playersInRooms[roomName] = [];
    playersInRooms[roomName].push({
      playerId: socket.id,
      playerType: 'hero',
      x:0,
      y:0
    });

  }

  socketIdRoomNameMap[socket.id] = roomName;

  // send the players array to the new player
  socket.emit('currentPlayers', playersInRooms[roomName]);
  // update all other players of the new player
  socket.to(roomName).emit('newPlayer', playersInRooms[roomName][playersInRooms[roomName].length - 1]);
 
  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected');
    // remove this player from our players array in a room
    playersInRooms[socketIdRoomNameMap[socket.id]] = playersInRooms[socketIdRoomNameMap[socket.id]].filter((p) => p.playerId !== socket.id)
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
    socket.in(socketIdRoomNameMap[socket.id]).emit('playerRemoved', socket.id);

    delete socketIdRoomNameMap[socket.id];

  });

  socket.on('movementChanged', function (data) {
    socket.to(socketIdRoomNameMap[data.playerId]).emit('playerMoved', data);
  });

  socket.on('enemyMoved', function (data) {
    io.to(socketIdRoomNameMap[data.playerId])('enemyMoved', data);
  });
  
  socket.on('enemyCreated', function (data) {
    io.to(socketIdRoomNameMap[data.playerId]).emit('enemyCreated', data);
  });

  socket.on('scoreUpdate', function (data) {
    socket.to(socketIdRoomNameMap[data.playerId]).emit('scoreUpdate', data);

    var highestScore = highestScoreInRoom[socketIdRoomNameMap[data.playerId]]
    
    if(highestScore === undefined || data.score > highestScore.score) {
      highestScore = {playerName: data.playerName, score:data.score}
    }
    highestScoreInRoom[socketIdRoomNameMap[data.playerId]] = highestScore;

    socket.to(socketIdRoomNameMap[data.playerId]).emit('highestScore', highestScore);
  });


});
 
server.listen(process.env.PORT || 8080, function () {
  console.log(`Listening on ${server.address().port}`);
});