const generateRelationship = require('./generateRelationship');
const switchPlayersToPartners = require('./switchPlayersData');

const generateGameRecordWinAndLoseRelationShip = (players) => {
    const partners = switchPlayersToPartners(players);
    return generateRelationship(partners)
};

export {
    generateGameRecordWinAndLoseRelationShip
}
