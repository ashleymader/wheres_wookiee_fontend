const gamesEndpoint = 'http://localhost:3000/api/v1/games'
const playersEndpoint = 'http://localhost:3000/api/v1/players'
const timerDisplay = document.querySelector('.display_time_left')
const goButton = document.querySelector('#goButton')
const startButton = document.querySelector("#startHere")
const endModalButton = document.querySelector("#submitScore")

document.addEventListener('DOMContentLoaded', () => {
    // timer(90);

});

window.addEventListener('load', () => {
    console.log('The page has fully loaded');
    let areas = document.querySelectorAll('area')
    
    function sendClick(){
        document.querySelector('#sendFirstClick').click()
    }
    sendClick()
    }
);


let characterCount = 0
let numOfCharacters = 5
img = document.querySelector('.spacephoto')
let score = 0 
let username 
let countdown 
let characterClick = 0 //not sure if needed now that I'm removing the node on click


img.addEventListener("click", e => { 
    if (e.target.localName === "area") {
        let characterID = e.target.id
        let targetCharacter = e.target
        let foundSound = new Audio()
        foundSound.src = "assets/sounds/confirmation.mp3"
        foundSound.play()

        targetCharacter.parentNode.removeChild(targetCharacter) //make user unable to click same character many times

        score+=100
        updateScore() 

        characterCount++

        // console.log(characterCount)
        if (characterCount === 5) {
            //PUT SOME METHOD HERE TO END GAME
        }
    }
})

//Countdown clock
function timer(seconds) {
    const now = Date.now()
    const then = now + seconds * 1000 // taking into account milliseconds
    displayTimeLeft(seconds) // the timer waits 1 second before running. This will display the starting time and then countdown like normal

    countdown = setInterval(() => { 
        const secondsLeft = Math.round((then - Date.now()) / 1000)
        
        //make sure timer doesn't go negative but displays 0:00
        if (secondsLeft <= -1) {
            clearInterval(countdown)
            timerDisplay.innerHTML = `<div> GAME OVER </div>`
            return;
        }

        if (characterCount === 1) {
            score+= secondsLeft * 10 //bonus score for finding all characters with time remaining
            updateScore()
            clearInterval(countdown) 
            timerDisplay.innerHTML = `<div> CONGRATULATIONS! </div>`
            endGame()
            return;
        }

        displayTimeLeft(secondsLeft)
    }, 1000)
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60) //rounds down the min
    const remainder = seconds % 60 
    const display = `${minutes}:${remainder < 10 ? '0' : ''}${remainder}`
    timerDisplay.textContent = display 
}


//score
const scoreDisplay = document.querySelector('.score')

function resetScore() {
    score = 0;
    scoreDisplay.innerHTML = `<h1>Score: ${score}</h1>`
}

function updateScore() {
    scoreDisplay.innerHTML = `<h1>Score: ${score}</h1>`
}


//instructions and trigger start 
goButton.addEventListener('click', e => { 
    timer(90)
})


//endModal 
function endGame() { 
    let formModal = document.querySelector('#form')
    function sendClick(){
        document.querySelector('#sendClick').click()
    }

    formModal.innerHTML = `
        <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Please Enter A Username For The Leaderboard</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="finalForm">
                <div class="modal-body" >
                    <label for="username">Username:</label>
                    <input type="text" id="username" placeholder="Enter Username">
                    </br>
                    <label for="score">Your High Score: ${score} </label>
                    <input type="hidden" id="score" value="${score}">
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-success">Submit</button>
                </div>

            </form>
        </div>
        </div> `

    sendClick()

    //submit form with score and username
    const finalForm = document.querySelector("#finalForm")
    console.log(finalForm)
    finalForm.addEventListener("submit", e => postScore(e))
    
    
}




//post users score to db 
function postScore(e) {
    e.preventDefault()
    username = e.target.username.value
    score = e.target.score.value
    // let body = {
    //   username: username,
    //   score: score
    // }
    // return fetch(gamesEndpoint, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Accepts": "application/json"
    //   },
    //   body: JSON.stringify(body)
    // }).then(resp => resp.json())
  }

  //show high scores 
  function getHighScores() {
    fetch(gamesEndpoint)
    .then(res => res.json())
    .then(allGames => {
        console.log(allGames)
        allGames.data.forEach(game => {
            const gameMarkup = `
            <div data-id=${game.id}>
                <h3>${game.attributes.player.username} - ${game.attributes.score} </h3>
            </div>
            `
            document.querySelector('#games-container').innerHTML += gameMarkup
        })
    })
}