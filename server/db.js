const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
 
const firebaseConfig = {
  apiKey: "AIzaSyBMtcl-BpKIc0z8Cd_KVdw4HGimL0IvasI",
  authDomain: "kmar-f1.firebaseapp.com",
  databaseURL: "https://kmar-f1.firebaseio.com",
  projectId: "kmar-f1",
  storageBucket: "kmar-f1.appspot.com",
  messagingSenderId: "530594781173",
  appId: "1:530594781173:web:dc000f4a5391ff98b9f2bc"
};

const fb = firebase.initializeApp(firebaseConfig);
const database = fb.database();

/**
 * Save a statistic of the current game.
 * 
 * @param {string} name 
 * @param {any} value 
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
}

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

module.exports = { setStat, getStat, setUUID, getUUIDs };