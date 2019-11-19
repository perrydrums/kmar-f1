const socketIO = require('socket.io');
const { setStat, setUUID, getUUIDs } = require('./db');

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

      const uuids = await getUUIDs();

      // Start the game when all mini-games are active.
      if (uuids.length === 8) {
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
