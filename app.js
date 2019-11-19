const express      = require('express');
const cookieParser = require('cookie-parser');
const app          = express();
const http         = require('http').createServer(app);
const io           = require('socket.io')(http);
const uuidv1       = require('uuid/v1');
const dotenv       = require('dotenv').config();
const { initializeSockets } = require('./server/sockets');
const { getUUIDs } = require('./server/db');

app.use(cookieParser());

/**
 * Determine to which game the player will be sent to.
 */
app.get('/', async (req, res) => {
  // Create a unique ID for the player and save in cookie.
  if (req.cookies.uuid) {
    console.log('Known player with UUID ' + req.cookies.uuid);

    const uuids = await getUUIDs();

    // Check if the UUID is already playing the game, if so, redirect them to their game.
    const game = Object.keys(uuids).find(key => uuids[key] === req.cookies.uuid);
    if (game) {
      res.redirect('/' + game);
      return;
    }

  } else {
    console.log('Set new UUID');
    const uuid = uuidv1();
    res.cookie('uuid', uuid);
  }

  res.sendFile(__dirname + '/client/index.html');
});

app.use('/', express.static(__dirname + '/client'));

initializeSockets(http);

const port = process.env.PORT || 80;

http.listen(port);
console.log('Server running on: http://localhost:' + port);
