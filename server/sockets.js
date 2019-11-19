const socketIO = require('socket.io');
const { setStat, getStat, setUUID } = require('./db');

/**
 * Sets up all socket connections.
 * 
 * @param {Server} http 
 */
const initializeSockets = (http) => {

  const io = socketIO(http);

  io.sockets.on('connection', async socket => {
    console.log('Socket connected with Client.');
  
    /**
     * Init sockets.
     */
    socket.on('client:start', data => {
      //
    });

    socket.on('client:startGame', async data => {

      const pitstopUUID = await getStat('pitstopUUID');
      const gasolineUUID = await getStat('gasolineUUID');

      // Start the game if all players are in their mini-game.
      if (pitstopUUID && gasolineUUID) {
        setStat('running', true);
        setStat('startTime', Date.now());
      }
      
    });

    /**
     * Pitstop sockets.
     */
    socket.on('pitstop:start', data => {
      setUUID('pitstop', data.uuid);
    });
  
    /**
     * Gasoline sockets.
     */
    socket.on('gasoline:start', data => {
      setUUID('gasoline', data.uuid);
    });

    socket.on('gasoline:update', data => {
      socket.broadcast.emit('server:gasoline:update', {gasoline: data.gasoline});
    });
  });
}

module.exports = { initializeSockets };
