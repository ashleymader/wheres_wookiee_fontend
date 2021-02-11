const gamesEndpoint = 'http://localhost:3000/api/v1/games'
const playersEndpoint = 'http://localhost:3000/api/v1/players'

document.addEventListener('DOMContentLoaded', () => {
    getGames()
    
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

// function showCoords(event) {
//     var x = event.clientX;
//     var y = event.clientY;
//     var coords = "X coords: " + x + ", Y coords: " + y;
//     document.getElementById("demo").innerHTML = coords;
// }
// function image(objectClicked) {
//     console.log(objectClicked);
// }

