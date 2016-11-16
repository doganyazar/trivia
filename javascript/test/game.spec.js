'use strict'

const test = require('tape')
const Game = require('../lib/game.js')

test('Test environment', function(t) {
    t.plan(1)
    t.ok(Game, 'Game should be defined')
})

test('Game rules', function(t) {
    let dices = Array.from(new Array(100), () => Game.dice())
    t.ok(dices.every(x => (x >= 0 && x <=6)), 'Each dice number should be in [0,6]')
    t.equal(new Set(dices).size, 6, 'All dice numbers should exist')

    const game = new Game(['p0'], 5)
    t.equal(game.currentCategory(0), 'Pop')
    t.equal(game.currentCategory(5), 'Science')
    t.equal(game.currentCategory(10), 'Sports')
    t.equal(game.currentCategory(7), 'Rock')

    t.throws(() => game.play(Game.dice()), 'Not possible to play with less than 2')

    t.end()
})

test('Game should end', function(t) {
    t.timeoutAfter(20)
    t.plan(2)

    const winningPoints = 6
    const players = ['p0', 'p1']
    const game = new Game(players, winningPoints)
    const p0 = 0
    const p1 = 1

    const now = Date.now()
    let gameEnded = false
    while ((Date.now() - now) < 20) {
        game.play(Game.dice())

        if(Math.floor(Math.random() * 10) == 7) {
            game.wrongAnswer()
        } else {
            if (game.correctAnswer()) {
                gameEnded = true
                break
            }
        }
    }

    t.ok(gameEnded, 'Game should end!')
    t.ok((game.getPurse(p0) === winningPoints && game.getPurse(p1) !== winningPoints) ||
            (game.getPurse(p0) !== winningPoints && game.getPurse(p1) === winningPoints),
            'Only 1 player should win')
})
