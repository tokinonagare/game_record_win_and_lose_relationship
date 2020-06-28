const PlayersRelationship = require('./PlayersRelationship');
const switchPlayersToPartners = require('./switchPlayersData');

const generateGameRecordWinAndLoseRelationships = (players) => {
    const partners = switchPlayersToPartners(players);
    const relationship = new PlayersRelationship(partners)
    return relationship.generateRelationships()
};

const generatePlayerWinAndLoseRelationships = (players, playerId) => {
    const partners = switchPlayersToPartners(players);
    const playersRelationship = new PlayersRelationship(partners);
    const relationships = playersRelationship.generateRelationships();
    const currentPlayerRelationship = relationships.find((relationship) => relationship.id === playerId);
    if (currentPlayerRelationship) {
        return currentPlayerRelationship.partner;
    }
    return [];
};

export {
    generateGameRecordWinAndLoseRelationships,
    generatePlayerWinAndLoseRelationships
}
