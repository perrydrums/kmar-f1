const socketIO = require('socket.io');
const {setStat, getStat, setUUID, getUUIDs} = require('./db');
const {addUpgrade} = require('./upgrades');

// Contains all available games, sorted on priority.
const games = ['driver', 'gasoline', 'pitstop', 'turbo', 'aero', 'research', 'sponsor'];

/**
 * Sets up all socket connections.
 *
 * @param {Server} http
 */
const initializeSockets = (http) => {

    const io = socketIO(http);

    io.sockets.on('connection', async socket => {

        /**
         * Init sockets.
         */
        socket.on('client:start', async data => {
            const running = await getStat('running');
            socket.emit('server:client:checkGame', {running});
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
                const gameList = games.slice(0, await getStat('amountOfPlayers'));

                // Pick a random game for the player.
                gameList.sort(() => Math.random() - 0.5);
                for (let i = 0; i < gameList.length; i ++) {
                    if (!uuids[gameList[i]]) {
                        setUUID(gameList[i], data.uuid);
                        break;
                    }
                }
            }

            const names = await getStat('names');
            const teamName = await getStat('teamName');
            const newUuids = await getUUIDs();

            // Update player names and roles.
            socket.broadcast.emit('server:waiting:update', {
                names,
                teamName,
                uuids: newUuids,
            });
            socket.emit('server:waiting:update', {
                names,
                teamName,
                uuids: newUuids,
            });

            // Redirect all players that are still on the /start page.
            socket.broadcast.emit('server:start:start');
        });

        socket.on('client:waiting:setName', async data => {
            if (!data.uuid || !data.name) {
                return;
            }

            setStat(`names/${data.uuid}`, data.name);

            socket.broadcast.emit('server:waiting:update', {
                names: await getStat('names'),
                teamName: await getStat('teamName'),
            });

            socket.emit('server:waiting:update', {
                names: await getStat('names'),
                teamName: await getStat('teamName'),
            });
        });

        socket.on('client:waiting:ready', async data => {
            setStat(`ready/${data.uuid}`, data.ready);

            // Check if all players are ready.
            if (data.ready) {
                const players = await getStat('ready');
                const amountOfPlayers = await getStat('amountOfPlayers');

                const entries = Object.entries(players);
                let readyPlayers = 0;
                for (const [uuid, ready] of entries) {
                    if (ready) readyPlayers ++;
                    if (readyPlayers === amountOfPlayers) {
                        // Start Game!
                        setStat('started', true);

                        socket.emit('server:waiting:startCountdown');
                        socket.broadcast.emit('server:waiting:startCountdown');
                    }
                }
            }

            socket.emit('server:waiting:ready', {
                uuids: await getStat('ready'),
            });

            socket.broadcast.emit('server:waiting:ready', {
                uuids: await getStat('ready'),
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
            const tokens = await getStat('tokens');
            socket.emit('server:research:update', {upgrades, tokens});
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

        socket.on('driver:finish', async data => {
            socket.broadcast.emit('finish');
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

        /**
         * Sponsor sockets.
         */
        socket.on('sponsor:start', async data => {
            setUUID('sponsor', data.uuid);
        });

        socket.on('sponsor:update-tokens', async data => {
            const currentTokens = await getStat('tokens');
            if (!currentTokens || currentTokens < data.tokens) {
                setStat('tokens', data.tokens);
            }

            socket.broadcast.emit('server:sponsor:update-tokens', {
                tokens: data.tokens,
            });
        });
    });
};

module.exports = {initializeSockets};
