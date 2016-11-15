'use strict'
const debug = require('debug')('game')

class Game {
    constructor() {
        this.WINNING_POINTS = 6

        var players          = []
        var places          = []
        var purses          = []
        var inPenaltyBox     = []

        var popQuestions     = []
        var scienceQuestions = []
        var sportsQuestions  = []
        var rockQuestions    = []

        var currentPlayer    = 0
        var isGettingOutOfPenaltyBox = false

        this.getPurse = id => purses[id]

        var didPlayerWin = () => !(purses[currentPlayer] == this.WINNING_POINTS)

        var currentCategory = function(){
            if(places[currentPlayer] == 0)
                return 'Pop'
            if(places[currentPlayer] == 4)
                return 'Pop'
            if(places[currentPlayer] == 8)
                return 'Pop'
            if(places[currentPlayer] == 1)
                return 'Science'
            if(places[currentPlayer] == 5)
                return 'Science'
            if(places[currentPlayer] == 9)
                return 'Science'
            if(places[currentPlayer] == 2)
                return 'Sports'
            if(places[currentPlayer] == 6)
                return 'Sports'
            if(places[currentPlayer] == 10)
                return 'Sports'
            return 'Rock'
        }

        this.createRockQuestion = function(index){
            return 'Rock Question '+index
        }

        for(var i = 0; i < 50; i++){
            popQuestions.push('Pop Question '+i)
            scienceQuestions.push('Science Question '+i)
            sportsQuestions.push('Sports Question '+i)
            rockQuestions.push(this.createRockQuestion(i))
        }

        this.isPlayable = function(howManyPlayers){
            return howManyPlayers >= 2
        }

        this.add = function(playerName){
            players.push(playerName)
            places[this.howManyPlayers() - 1] = 0
            purses[this.howManyPlayers() - 1] = 0
            inPenaltyBox[this.howManyPlayers() - 1] = false

            debug(playerName + ' was added')
            debug('They are player number ' + players.length)

            return true
        }

        this.howManyPlayers = function(){
            return players.length
        }


        var askQuestion = function(){
            if(currentCategory() == 'Pop')
                debug(popQuestions.shift())
            if(currentCategory() == 'Science')
                debug(scienceQuestions.shift())
            if(currentCategory() == 'Sports')
                debug(sportsQuestions.shift())
            if(currentCategory() == 'Rock')
                debug(rockQuestions.shift())
        }

        this.roll = function(roll){
            debug(players[currentPlayer] + ' is the current player')
            debug('They have rolled a ' + roll)

            if(inPenaltyBox[currentPlayer]){
                if(roll % 2 != 0){
                    isGettingOutOfPenaltyBox = true

                    debug(players[currentPlayer] + ' is getting out of the penalty box')
                    places[currentPlayer] = places[currentPlayer] + roll
                    if(places[currentPlayer] > 11){
                        places[currentPlayer] = places[currentPlayer] - 12
                    }

                    debug(players[currentPlayer] + '\'s new location is ' + places[currentPlayer])
                    debug('The category is ' + currentCategory())
                    askQuestion()
                }else{
                    debug(players[currentPlayer] + ' is not getting out of the penalty box')
                    isGettingOutOfPenaltyBox = false
                }
            }else{

                places[currentPlayer] = places[currentPlayer] + roll
                if(places[currentPlayer] > 11){
                    places[currentPlayer] = places[currentPlayer] - 12
                }

                debug(players[currentPlayer] + '\'s new location is ' + places[currentPlayer])
                debug('The category is ' + currentCategory())
                askQuestion()
            }
        }

        this.wasCorrectlyAnswered = function(){
            if(inPenaltyBox[currentPlayer]){
                if(isGettingOutOfPenaltyBox){
                    debug('Answer was correct!!!!')
                    purses[currentPlayer] += 1
                    debug(players[currentPlayer] + ' now has ' +
                        purses[currentPlayer]  + ' Gold Coins.')

                    let winner = didPlayerWin()
                    currentPlayer += 1
                    if(currentPlayer == players.length)
                        currentPlayer = 0

                    return winner
                }else{
                    currentPlayer += 1
                    if(currentPlayer == players.length)
                        currentPlayer = 0
                    return true
                }



            }else{

                debug('Answer was correct!!!!')

                purses[currentPlayer] += 1
                debug(players[currentPlayer] + ' now has ' +
                      purses[currentPlayer]  + ' Gold Coins.')

                let winner = didPlayerWin()

                currentPlayer += 1
                if(currentPlayer == players.length)
                    currentPlayer = 0

                return winner
            }
        }

        this.wrongAnswer = function(){
            debug('Question was incorrectly answered')
            debug(players[currentPlayer] + ' was sent to the penalty box')
            inPenaltyBox[currentPlayer] = true

            currentPlayer += 1
            if(currentPlayer == players.length)
                currentPlayer = 0
            return true
        }
    }
}

module.exports = Game
