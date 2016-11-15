'use strict'

const test = require('tape')
const Game = require('../lib/game.js')

test('Test environment', function(t) {
    t.plan(1)
    t.ok(Game, 'Game should be defined')
})

test('Game ends', function(t) {
    t.timeoutAfter(100)
    t.plan(2)

    const game = new Game()
    const p0 = 0
    const p1 = 1
    game.add('p0')
    game.add('p1')

    const now = Date.now()
    let gameEnded = false
    while ((Date.now() - now) < 15) {
        game.roll(Math.floor(Math.random() * 6) + 1)

        if(Math.floor(Math.random() * 10) == 7) {
            game.wrongAnswer()
        } else {
            if (!game.wasCorrectlyAnswered()) {
                gameEnded = true
                break
            }
        }
    }

    t.ok(gameEnded, 'Game should end!')
    t.ok((game.getPurse(p0) === game.WINNING_POINTS && game.getPurse(p1) !== game.WINNING_POINTS) ||
            (game.getPurse(p0) !== game.WINNING_POINTS && game.getPurse(p1) === game.WINNING_POINTS),
            'Only 1 player should win')
})
