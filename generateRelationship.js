function generateRelationship(partners) {
    return [
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
    ]
}

module.exports = generateRelationship;
