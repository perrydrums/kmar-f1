const socketIO = require('socket.io');
const {setStat, getStat, setUUID, getUUIDs} = require('./db');
const {addUpgrade} = require('./upgrades');

// Contains all available games.
const games = ['pitstop', 'gasoline', 'research', 'turbo', 'aero', 'driver'];

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
        socket.on('client:start', async data => {
            const running = await getStat('running');
            socket.emit('server:client:checkGame', {running});
        });

        socket.on('client:startGame', async data => {
            const running = await getStat('running');
            socket.emit('server:client:checkGame', {running});

            // const uuids = await getUUIDs();

        });

        socket.on('game:finish', async data => {

        });

        socket.on('client:waiting', async data => {
            if (!data.uuid) {
                return;
            }

            const uuids = await getUUIDs();
            const entries = Object.entries(uuids);

            let pickNewGame = true;

            for (const [gameValue, uuidValue] of entries) {
                // A game has already been picked for the player.
                if (uuidValue === data.uuid) {
                    pickNewGame = false;
                }
            }

            if (pickNewGame) {
                // Pick a random game for the player.
                games.sort(() => Math.random() - 0.5);
                games.forEach(game => {
                    if (!uuids[game]) {
                        setUUID(game, data.uuid);
                    }
                });
            }

            const names = await getStat('names');
            const newUuids = await getUUIDs();

            // Update player names and roles.
            socket.broadcast.emit('server:waiting:update', {
                names,
                uuids: newUuids,
            });
            socket.emit('server:waiting:update', {
                names,
                uuids: newUuids,
            });
        });

        socket.on('client:waiting:setName', async data => {
            if (!data.uuid || !data.name) {
                return;
            }

            setStat(`names/${data.uuid}`, data.name);

            socket.broadcast.emit('server:waiting:update', {
                names: await getStat('names'),
            });

            socket.emit('server:waiting:update', {
                names: await getStat('names'),
            });
        });

        /**
         * Pitstop sockets.
         */
        socket.on('pitstop:start', async data => {
            await setUUID('pitstop', data.uuid);
        });

        socket.on('pitstop:done', async data => {
            socket.broadcast.emit('server:pitstop:done', data);
            await setStat('pitstopTimes', data.time);
        });

        /**
         * Gasoline sockets.
         */
        socket.on('gasoline:start', async data => {
            await setUUID('gasoline', data.uuid);

            const upgrades = await getStat('upgrades');
            socket.emit('server:gasoline:upgrades', {upgrades});
        });

        socket.on('gasoline:update', data => {
            socket.broadcast.emit('server:gasoline:update', {...data});
        });

        /**
         * Research sockets.
         */
        socket.on('research:start', async data => {
            setUUID('research', data.uuid);

            const upgrades = await getStat('upgrades');
            socket.emit('server:research:update', {upgrades});
        });

        socket.on('research:unlock', async data => {
            await addUpgrade(data.upgrade);

            socket.broadcast.emit('server:research:unlock:' + data.upgrade, {});
        });

        /**
         * Driver sockets.
         */
        socket.on('driver:start', async data => {
            setUUID('driver', data.uuid);

            const upgrades = await getStat('upgrades');
            socket.emit('server:driver:upgrades', {upgrades});
        });

        socket.on('driver:lap', async data => {
            socket.broadcast.emit('server:driver:pitstop', data);

            setStat('lapTimes', data.time);
            setStat('currentLap', data.lap);
        });

        /**
         * Aero sockets.
         */
        socket.on('aero:start', async data => {
            setUUID('aero', data.uuid);
        });

        socket.on('aero:boost', async data => {
            socket.broadcast.emit('server:aero:boost', {});
        });

        socket.on('aero:slow', async data => {
            socket.broadcast.emit('server:aero:slow', {});
        });

        /**
         * Turbo sockets.
         */
        socket.on('turbo:start', async data => {
            setUUID('turbo', data.uuid);
        });

        socket.on('turbo:turbo', async data => {
            socket.broadcast.emit('server:turbo:turbo', {});
        });
    });
};

module.exports = {initializeSockets};
