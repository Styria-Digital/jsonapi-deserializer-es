"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var index_1 = require("../src/index");
describe('deserialize', function () {
    it('should deserialize jsonapi spec example', function () {
        var example = {
            'data': [{
                    'type': 'articles',
                    'id': '1',
                    'attributes': {
                        'title': 'JSON API paints my bikeshed!'
                    },
                    'links': {
                        'self': 'http://example.com/articles/1'
                    },
                    'relationships': {
                        'author': {
                            'links': {
                                'self': 'http://example.com/articles/1/relationships/author',
                                'related': 'http://example.com/articles/1/author'
                            },
                            'data': { 'type': 'people', 'id': '9' }
                        },
                        'comments': {
                            'links': {
                                'self': 'http://example.com/articles/1/relationships/comments',
                                'related': 'http://example.com/articles/1/comments'
                            },
                            'data': [
                                { 'type': 'comments', 'id': '5' },
                                { 'type': 'comments', 'id': '12' }
                            ]
                        }
                    }
                }],
            'included': [{
                    'type': 'people',
                    'id': '9',
                    'attributes': {
                        'first-name': 'Dan',
                        'last-name': 'Gebhardt',
                        'twitter': 'dgeb'
                    },
                    'links': {
                        'self': 'http://example.com/people/9'
                    }
                }, {
                    'type': 'comments',
                    'id': '5',
                    'attributes': {
                        'body': 'First!'
                    },
                    'relationships': {
                        'author': {
                            'data': { 'type': 'people', 'id': '2' }
                        }
                    },
                    'links': {
                        'self': 'http://example.com/comments/5'
                    }
                }, {
                    'type': 'comments',
                    'id': '12',
                    'attributes': {
                        'body': 'I like XML better'
                    },
                    'relationships': {
                        'author': {
                            'data': { 'type': 'people', 'id': '9' }
                        }
                    },
                    'links': {
                        'self': 'http://example.com/comments/12'
                    }
                }]
        };
        var result = index_1.deserialize(example);
        var expected = [
            {
                'id': '1',
                'title': 'JSON API paints my bikeshed!',
                'author': {
                    'id': '9',
                    'first-name': 'Dan',
                    'last-name': 'Gebhardt',
                    'twitter': 'dgeb'
                },
                'comments': [
                    { 'id': '5', 'body': 'First!' },
                    { 'id': '12', 'body': 'I like XML better' }
                ]
            }
        ];
        expect(lodash_1.matches(expected)(result)).toBe(true);
    });
    it('should deserialize nested resources', function () {
        var document = {
            data: [
                {
                    id: '1', type: 'people', attributes: { name: 'John' },
                    relationships: { friend: { data: { id: '2', type: 'people' } } }
                },
                {
                    id: '2', type: 'people', attributes: { name: 'Carl' },
                    relationships: { dog: { data: { id: '3', type: 'dogs' } } }
                }
            ],
            included: [
                {
                    id: '2', type: 'people', attributes: { name: 'Carl' },
                    relationships: { dog: { data: { id: '3', type: 'dogs' } } }
                },
                { id: '3', type: 'dogs', attributes: { name: 'Bobby' } }
            ]
        };
        var result = index_1.deserialize(document);
        var expected = [
            { id: '1', name: 'John', friend: { id: '2', name: 'Carl', dog: { id: '3', name: 'Bobby' } } },
            { id: '2', name: 'Carl', dog: { id: '3', name: 'Bobby' } }
        ];
        expect(lodash_1.matches(expected)(result)).toBe(true);
    });
});
//# sourceMappingURL=deserializer-spec.js.map