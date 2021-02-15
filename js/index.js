const gamesEndpoint = 'http://localhost:3000/api/v1/games'
const playersEndpoint = 'http://localhost:3000/api/v1/players'

document.addEventListener('DOMContentLoaded', () => {
    getGames()
    // console.log('DOC LOADED');
    // console.log(wookiee.coords, 'doc load coords')
});

window.addEventListener('load', () => {
    console.log('The page has fully loaded');
    let areas = Array.from(document.querySelectorAll('area'))

    let testWookiee = document.getElementsByTagName('area')[0]
    testWookiee.onclick = function() {
        console.log("WE DID IT")
    }
});

function getGames() {
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

// areas = Array.from(document.querySelectorAll('area'))
img = document.querySelector('.spacephoto')
wookiee = document.getElementById('wookiee')

// function characterArea() {areas.forEach(area => {console.log(area.alt, area.coords)})}



