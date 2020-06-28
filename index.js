const PlayersRelationship = require('./PlayersRelationship');
const switchPlayersToPartners = require('./switchPlayersData');

const generateGameRecordWinAndLoseRelationShip = (players) => {
    const partners = switchPlayersToPartners(players);
    const relationship = new PlayersRelationship(partners)
    return relationship.generateRelationship()
};

export {
    generateGameRecordWinAndLoseRelationShip
}
