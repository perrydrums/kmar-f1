const {setStat, getStat} = require('./db');

const upgradeList = [
    {upgrade: 'rain-tires'},
    {upgrade: 'engine-upgrade'},
    {upgrade: 'turbo-upgrade'},
    {upgrade: 'aero-upgrade'},
    {upgrade: 'fuel-upgrade'},
];

/**
 * Set all upgrades to FALSE in the database.
 */
const resetUpgrades = async () => {
    let emptyUpgrades = {};

    upgradeList.forEach(upgrade => {
        emptyUpgrades[upgrade.upgrade] = false;
    });

    setStat('upgrades', emptyUpgrades);
};

/**
 * Add upgrade to the database.
 *
 * @param {string} upgrade
 */
const addUpgrade = async (upgrade) => {
    let upgrades = await getStat('upgrades');
    upgrades[upgrade] = true;
    setStat('upgrades', upgrades);
};

module.exports = {addUpgrade, resetUpgrades};
