const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const uuidv1 = require('uuid/v1');
const dotenv = require('dotenv').config();
const {initializeSockets} = require('./server/sockets');
const {getUUIDs, resetUUIDs, resetStats, setStat, getStat} = require('./server/db');
const {resetUpgrades} = require('./server/upgrades');

app.use(cookieParser());

/**
 * Determine to which game the player will be sent to.
 */
app.get('/', async (req, res) => {
    let skip = false;

    // Contains all UUIDs currently in the game.
    const uuids = await getUUIDs();

    // If the player has already logged in once.
    if (req.cookies.uuid) {
        if (await getStat('started')) {
            // Check if the UUID is already playing the game, if so, redirect them to their game.
            const game = Object.keys(uuids).find(key => uuids[key] === req.cookies.uuid);
            if (game) {
                res.redirect('/' + game);
                skip = true;
                return;
            }
        }
        else {
            if (await getStat('running')) {
                res.redirect('/start/waiting');
                skip = true;
                return;
            }
        }
    }
    // Create a unique ID for the player and save in cookie.
    else {
        const uuid = uuidv1();
        res.cookie('uuid', uuid);
    }

    // Don't send headers twice.
    if (!skip) {
        if (await getStat('running')) {
            res.redirect('/start/waiting');
        } else {
            res.sendFile(__dirname + '/client/index.html');
        }
    }
});

app.get('/new', async (req, res) => {
    const amountOfPlayers = req.param('players');
    if (!amountOfPlayers) {
        res.redirect('/');
        return;
    }

    setStat('amountOfPlayers', parseInt(amountOfPlayers));
    setStat('running', true);

    res.redirect('/start/waiting');
});

app.get('/reset', async (req, res) => {
    await resetStats();
    await resetUUIDs();
    await resetUpgrades();
    return res.json({message: 'Game reset!'});
});

app.use('/', express.static(__dirname + '/client'));

initializeSockets(http);

const port = process.env.PORT || 80;

http.listen(port);
console.log('Server running on: http://localhost:' + port);
