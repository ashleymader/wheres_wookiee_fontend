const gamesEndpoint = 'http://localhost:3000/api/v1/games'
const playersEndpoint = 'http://localhost:3000/api/v1/players'
const timerDisplay = document.querySelector('.display_time_left')

document.addEventListener('DOMContentLoaded', () => {
});

window.addEventListener('load', () => {
    console.log('The page has fully loaded');
    let areas = document.querySelectorAll('area')
    document.querySelector('#sendFirstClick').click()
    }
);


let characterCount = 0
// let numOfCharacters = 5
img = document.querySelector('.spacephoto')
let score = 0 
let username 
let player_id
let countdown 
let characterClick = 0 //not sure if needed now that I'm removing the node on click

//instruction modal/form - must click button to trigger start
const startForm = document.querySelector("#userForm")
startForm.addEventListener('submit', e => userFormHandler(e))

//user form handler
function userFormHandler(e) {
    e.preventDefault()
    username = e.target.username.value
    postUser(username)
}
//send user to db
function postUser(username) {

    fetch(playersEndpoint, {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({
            username: username
        })
    })
    .then(resp => resp.json())
    .then(user => { 
        player_id = user.data.id
        username = user.data.attributes.username
    })
}

goButton.addEventListener('click', e => { 
    document.querySelector('#sendFirstClick').click()
    timer(90)
})

//listening for clicks on imageMap characters
img.addEventListener("click", e => { 
    if (e.target.localName === "area") {
        let characterID = e.target.id
        let targetCharacter = e.target
        let foundSound = new Audio()
        foundSound.src = "assets/sounds/confirmation.mp3"
        foundSound.play()

        targetCharacter.parentNode.removeChild(targetCharacter) //makes user unable to click same character many times

        score+=100
        updateScore() 

        characterCount++
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


//endModal 
function endGame() { 
    let formModal = document.querySelector('#form')

    formModal.innerHTML = `
        <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Submit Your Score to the Leaderboard</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="finalForm">
                <div class="modal-body" >
                    <label for="username">Username: ${username}</label>
                    <input type="hidden" id="username">
                    </br>
                    <label for="score">Your High Score: ${score} </label>
                    <input type="hidden" id="score" value="${score}">
                    <input type="hidden" id="player_id" value="${player_id}">
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-success">Submit</button>
                </div>

            </form>
        </div>
        </div> `

    //activating hidden button to open modal
    document.querySelector('#sendClick').click()

    //submit form with score and username
    const finalForm = document.querySelector("#finalForm")
    finalForm.addEventListener("submit", function(e){
        e.preventDefault()
        postScore()  
        getHighScores()
    })
}



//post users score to db 
function postScore() {
    let body = {
      player_id: player_id,
      score: score
    }
    fetch(gamesEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(resp => resp.json())
    
    .then(json => console.log(json, " this is the post"))
}


  //show high scores 
function getHighScores() {
    setTimeout(function(){
        fetch(gamesEndpoint)
        .then(res => res.json())
        .then(allGames => {
            console.log(allGames, "this is the get")
            allGames.data.forEach(game => {
                const gameMarkup = `
                <div data-id=${game.id}>
                <h3>${game.attributes.player.username} - ${game.attributes.score} </h3>
                `
                document.querySelector('#eachGameScore').innerHTML += gameMarkup
            })
        })
    }, 100)
    postScoresToPage()
}

// I THINK I NEED TO PULL THE MARKUP OUT AN THEN MAKE ANOTHER FUNCTION FOR THE BUTTON THAT WAY I CAN SEE THE CURRENT USERS SCORE ON THE SCOREBOARD

function postScoresToPage(){
    //activating hidden button to open modal
    document.querySelector('#scoreboardClick').click()
}

//reset game after exit scoreboard 
const exitButton = document.querySelector("#exitButton")
exitButton.addEventListener('click', e => {
    location.reload();
    return false;
})