const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSENGER_ID,
    appId: process.env.FIREBASE_APP_IDD,
};

const fb = firebase.initializeApp(firebaseConfig);
const database = fb.database();

/**
 * Save a statistic of the current game.
 *
 * @param {string} name
 * @param value
 */
const setStat = (name, value) => {
    database.ref('/stats/' + name).set(value);
};

/**
 * Get a statistic of the current game.
 *
 * @param {string} name
 */
const getStat = async (name) => {
    const stats = database.ref('/stats/' + name);
    const snapshot = await stats.once('value');
    return snapshot.val();
};

/**
 * Set the UUID of the current player of set game.
 *
 * @param {string} name
 * @param {string} uuid
 */
const setUUID = async (name, uuid) => {
    // Get current UUIDs.
    const root = database.ref('/uuids');
    const snapshot = await root.once('value');
    let uuids = snapshot.val() || {};

    uuids[name] = uuid;

    database.ref('/uuids').set(uuids);
};

/**
 * Get all UUIDs of the current game.
 */
const getUUIDs = async () => {
    // Get current UUIDs.
    const root = database.ref('/uuids');
    const snapshot = await root.once('value');
    return snapshot.val() || {};
};

/**
 * Reset all UUIDs to start a new game.
 */
const resetUUIDs = async () => {
    database.ref('/uuids').set({});
};

/**
 * Reset all statistics.
 */
const resetStats = async () => {
    database.ref('/stats').set({});
};

/**
 * TRUE if there's already a game going on.
 *
 * @returns {Promise<boolean>}
 */
const isRunning = async () => {
    return !! await getStat('running');
};

module.exports = {setStat, getStat, setUUID, getUUIDs, resetUUIDs, resetStats, isRunning};
