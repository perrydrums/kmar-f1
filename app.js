const express      = require('express');
const cookieParser = require('cookie-parser');
const app          = express();
const http         = require('http').createServer(app);
const io           = require('socket.io')(http);
const uuidv1       = require('uuid/v1');
const dotenv       = require('dotenv').config();
const { initializeSockets } = require('./server/sockets');
const { getUUIDs } = require('./server/db');

// Contains all available games.
const games = ['pitstop', 'gasoline'];

app.use(cookieParser());

/**
 * Determine to which game the player will be sent to.
 */
app.get('/', async (req, res) => {
  // Contains all UUIDs currently in the game.
  const uuids = await getUUIDs();

  // If the player has already logged in once.
  if (req.cookies.uuid) {
    // Check if the UUID is already playing the game, if so, redirect them to their game.
    const game = Object.keys(uuids).find(key => uuids[key] === req.cookies.uuid);
    if (game) {
      res.redirect('/' + game);
      return;
    }
  }
  // Create a unique ID for the player and save in cookie.
  else {
    const uuid = uuidv1();
    res.cookie('uuid', uuid);
  }

  let skip = false;

  // Pick a game for the player.
  games.forEach(game => {
    if (!uuids[game]) {
      res.redirect('/' + game);
      skip = true;
      return;
    }
  });

  // Don't send headers twice.
  if (!skip) {
    res.sendFile(__dirname + '/client/index.html');
  }
});

app.use('/', express.static(__dirname + '/client'));

initializeSockets(http);

const port = process.env.PORT || 80;

http.listen(port);
console.log('Server running on: http://localhost:' + port);
