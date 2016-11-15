const test = require('tape')
require('../game.js')

test('Test environment', function(t) {
    t.plan(1)
    t.ok(Game, 'Game should be defined')
})
