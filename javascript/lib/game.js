'use strict'
const debug = require('debug')('game')
const QUESTION_TYPES = ['Pop', 'Science', 'Sports', 'Rock']

function print() {
    console.log(...arguments) //eslint-disable-line no-console
}

class Game {
    constructor(players, winningPoints = 6, placeSize = 12) {
        this.winningPoints = winningPoints
        this.placeSize = placeSize

        this._initGame()
        this.addPlayers(players)
        this.currentPlayerIndex = 0
        this.currentPlayerName = this.players[this.currentPlayerIndex]

        debug(`Game initialized with ${players}, ${winningPoints}, ${placeSize}`)
    }

    addPlayers(newPlayers) {
        const currentNumberOfPlayers = this.players.length
        this.players.push(...newPlayers)

        newPlayers.forEach((player, index) => {
            index += currentNumberOfPlayers
            this.places[index] = 0
            this.purses[index] = 0
            this.inPenaltyBox[index] = false

            print(`${player} is added!`)
        })
        print(`There are ${this.players.length} players in the game!`)
    }

    _initGame() {
        this._prepareQuestions()
        this.players = []
        this.places = []
        this.purses = []
        this.inPenaltyBox = []
    }

    _prepareQuestions() {
        this.questions = new Map()
        QUESTION_TYPES.forEach(type => {
            let qs = []
            for(let i = 0; i < 50; i++){
                qs.push(`${type} Question ${i}`)
            }
            this.questions.set(type, qs)
        })
    }

    getQuestion(category){
        return this.questions.get(category).shift()
    }

    currentCategory(place) {
        return QUESTION_TYPES[place % QUESTION_TYPES.length]
    }

    getPurse(playerIndex) {
        return this.purses[playerIndex]
    }

    play(roll){
        if (this.players.length < 2) {
            throw new Error('At least 2 players required!')
        }

        print(`${this.currentPlayerName} have rolled ${roll}`)

        if (this.inPenaltyBox[this.currentPlayerIndex]){
            if (roll % 2 != 0) {
                print(`${this.currentPlayerName} is getting out of the penalty box`)
                this.inPenaltyBox[this.currentPlayerIndex] = false
            } else {
                print(`${this.currentPlayerName} is not getting out of the penalty box`)
                return
            }
        }

        this.places[this.currentPlayerIndex] += roll
        if(this.places[this.currentPlayerIndex] >= this.placeSize){
            this.places[this.currentPlayerIndex] -= this.placeSize
        }

        print(`${this.currentPlayerName}'s new location is ${this.places[this.currentPlayerIndex]}`)
        const category = this.currentCategory(this._getCurrentPlace())
        print(`The category is ${category}`)
        print(this.getQuestion(category))
    }

    checkGameOver() {
        return this.purses[this.currentPlayerIndex] == this.winningPoints
    }

    correctAnswer() {
        if(!this.inPenaltyBox[this.currentPlayerIndex]){
            print('Answer was correct!!!!')
            this.purses[this.currentPlayerIndex] += 1
            print(`${this.currentPlayerName} now has ${this.purses[this.currentPlayerIndex]} Gold Coins`)
        }

        if (this.checkGameOver()) {
            print(`Game over! ${this.currentPlayerName} won!`)
            return true
        }

        this._next()
        return false
    }

    wrongAnswer() {
        print('Question was incorrectly answered')
        print(`${this.currentPlayerName} was sent to the penalty box`)
        this.inPenaltyBox[this.currentPlayerIndex] = true

        this._next()
        return false
    }

    _next() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
        this.currentPlayerName = this.players[this.currentPlayerIndex]
    }

    // returns the place of the current player
    _getCurrentPlace() {
        return this.places[this.currentPlayerIndex]
    }

    static dice() {
        return Math.floor(Math.random() * 6)
    }
}

module.exports = Game
