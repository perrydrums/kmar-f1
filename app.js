const express = require('express')
const app     = express()
const http    = require('http').createServer(app)
const io      = require('socket.io')(http)
const uuidv1  = require('uuid/v1');
const dotenv  = require('dotenv').config();
const { setStat, getStat } = require('./server/db');

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.use('/', express.static(__dirname + '/client'));

app.get('/pitstop', (req, res) => {
  res.sendFile(__dirname + '/client/pitstop/');
});

io.sockets.on('connection', async socket => {
  console.log('Socket connected with Client.');

  socket.on('client:start', data => {
    if (data.uuid) {
      console.log('Known player with UUID ' + data.uuid);
    } else {
      console.log('Set new UUID');
      
      const uuid = uuidv1();
      socket.emit('server:save_uuid', { uuid });
    }
  });

  socket.on('pitstop:start', data => {
    console.log('PITSTOP: Start with UUID ' + data.uuid);
  });

  socket.on('gasoline:start', data => {
    console.log('GASOLINE: Start with UUID ' + data.uuid);
  });

  socket.on('gasoline:update', data => {
    console.log('SERVER: GASOLINE: UPDATE', data.gasoline);
    setStat('gasoline', data.gasoline);
    socket.broadcast.emit('server:gasoline:update', {gasoline: data.gasoline});
  });

});

const port = process.env.PORT || 80;

http.listen(port);
console.log('Server running on: http://localhost:' + port);
