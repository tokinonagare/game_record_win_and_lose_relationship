const PlayersRelationship = require("../PlayersRelationship");
const switchPlayersData = require("../switchPlayersData");

test('处理数据正确', () => {
    const partners = [
        {
            id: '2e2e74bb-534d-4ef3-a8cc-2947b7ec52ca',
            name: '小米qaq',
            amount: 259
        },
        {
            id: 'd76c9b50-d47f-4fe2-b8fa-0d20dce36de5',
            name: '.******.',
            amount: 214
        },
        {
            id: '726d7620-0775-4dd7-92a3-798ec498c902',
            name: 'QAQ',
            amount: -102
        },
        {
            id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
            name: 'la',
            amount: -371
        }
    ];

    const relationship = new PlayersRelationship(partners)
    expect(relationship.generateRelationship()).toStrictEqual([
        {
            id: 'd76c9b50-d47f-4fe2-b8fa-0d20dce36de5',
            name: '.******.',
            amount: 214,
            partner: [
                {
                    id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
                    name: 'la',
                    amount: 112
                },
                {
                    id: '726d7620-0775-4dd7-92a3-798ec498c902',
                    name: 'QAQ',
                    amount: 102
                }
            ]
        },
        {
            id: '2e2e74bb-534d-4ef3-a8cc-2947b7ec52ca',
            name: '小米qaq',
            amount: 259,
            partner: [
                {
                    id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
                    name: 'la',
                    amount: 259
                }
            ]
        },
        {
            id: '726d7620-0775-4dd7-92a3-798ec498c902',
            name: 'QAQ',
            amount: -102,
            partner: [
                {
                    id: 'd76c9b50-d47f-4fe2-b8fa-0d20dce36de5',
                    name: '.******.',
                    amount: -102
                }
            ]
        },
        {
            id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
            name: 'la',
            amount: -371,
            partner: [
                {
                    id: '2e2e74bb-534d-4ef3-a8cc-2947b7ec52ca',
                    name: '小米qaq',
                    amount: -259
                },
                {
                    id: 'd76c9b50-d47f-4fe2-b8fa-0d20dce36de5',
                    name: '.******.',
                    amount: -112
                }
            ]
        }
    ])
});

test('转换 players 数据', () => {
    const players = [
        {
            setNickname: [Function],
            id: '15fea3a9-f872-4c9e-81a5-d3daf01e5ee9',
            score: 71,
            rounds: 8,
            isLose: false,
            isBreakeven: false,
            getScore: '+71',
            nickname: 'peking'
        },
        {
            setNickname: [Function],
            id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
            score: -82,
            rounds: 8,
            isLose: true,
            isBreakeven: false,
            getScore: -82,
            nickname: 'la'
        }
    ];

    expect(switchPlayersData(players)).toStrictEqual([
        {
            id: '15fea3a9-f872-4c9e-81a5-d3daf01e5ee9',
            name: 'peking',
            amount: 71
        },
        {
            id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
            name: 'la',
            amount: -82
        }
    ])
});


test('处理分不平的数据（赢太多）', () => {
    const partners = [
        {
            id: '15fea3a9-f872-4c9e-81a5-d3daf01e5ee9',
            name: 'peking',
            amount: 1485
        },
        {
            id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
            name: 'la',
            amount: -597
        }
    ];

    const relationship = new PlayersRelationship(partners)
    expect(relationship.generateRelationship()).toStrictEqual([
        {
            id: '15fea3a9-f872-4c9e-81a5-d3daf01e5ee9',
            name: 'peking',
            amount: 1485,
            partner: [
                {
                    id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
                    name: 'la',
                    amount: 597
                }
            ]
        },
        {
            id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
            name: 'la',
            amount: -597,
            partner: [
                {
                    id: '15fea3a9-f872-4c9e-81a5-d3daf01e5ee9',
                    name: 'peking',
                    amount: -597
                }
            ]
        },
    ])
})

test('处理分不平的数据（输太多）', () => {
    const partners = [
        {
            id: '15fea3a9-f872-4c9e-81a5-d3daf01e5ee9',
            name: 'peking',
            amount: 200
        },
        {
            id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
            name: 'la',
            amount: -597
        }
    ];

    const relationship = new PlayersRelationship(partners)
    expect(relationship.generateRelationship()).toStrictEqual([
        {
            id: '15fea3a9-f872-4c9e-81a5-d3daf01e5ee9',
            name: 'peking',
            amount: 200,
            partner: [
                {
                    id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
                    name: 'la',
                    amount: 200
                }
            ]
        },
        {
            id: '6d2ea3a0-33a1-45ff-b4c7-ac75cc6019ce',
            name: 'la',
            amount: -597,
            partner: [
                {
                    id: '15fea3a9-f872-4c9e-81a5-d3daf01e5ee9',
                    name: 'peking',
                    amount: -200
                }
            ]
        },
    ])
})
