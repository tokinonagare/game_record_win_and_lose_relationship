const makePlayer = (props) => {
    return {
        id: props.id,
        name: props.nickname,
        amount: props.score
    }
};

const switchPlayersData = (players) => {
    return players.map((player) => makePlayer(player))
};

module.exports = switchPlayersData;
