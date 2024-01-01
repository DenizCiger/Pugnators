// Canvas setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
c.imageSmoothingEnabled = false;

// Constants
const gravity = 0.2;
const keys = {
    left: 'a',
    right: 'd',
    jump: ' ',
    attackNormal: 'j'
};
const keyPressed = {};
let lastMoveKeyPressed;

// Player-Info Displays
const playerInfoDisplays = [
    document.getElementById('playerInfo1'),
    document.getElementById('playerInfo2'),
    document.getElementById('playerInfo3'),
    document.getElementById('playerInfo4')
]

// Player-Icon Displays
const playerIconDisplays = [
    document.getElementById('icon1'),
    document.getElementById('icon2'),
    document.getElementById('icon3'),
    document.getElementById('icon4')
]

// Percentage Displays
const percentageDisplays = [
    document.getElementById('percentage1'),
    document.getElementById('percentage2'),
    document.getElementById('percentage3'),
    document.getElementById('percentage4')
];

// Background
const background = new Sprite({
    position: { x: 0, y: 0 },
    animationData: { imageSrc: './images/Game-Textures/Copy/Glacial-mountains/background_glacial_mountains_lightened.png' },
    scale: 1.25
});

// Obstacles
const map = [
    new Obstacle({
        position: { x: 600, y: 600 },
        height: 30,
        width: 200
    })
]

// Players
let p1Character = 'Troller';
let p2Character = 'Snowy';
let p3Character = 'LeondingChan';
let p4Character = 'Nerd';

const player1 = new Fighter({
    characterType: p1Character,
    position: { x: (200), y: 100 },
    color: 'red'
})
const player2 = new Fighter({
    characterType: p2Character,
    position: { x: 200 +     (canvas.width - 2 * 200) / 3, y: 100 },
    color: 'blue'
})
const player3 = new Fighter({
    characterType: p3Character,
    position: { x: 200 + 2 * (canvas.width - 2 * 200) / 3, y: 100 },
    color: 'green'
})
const player4 = new Fighter({
    characterType: p4Character,
    position: { x: (canvas.width-200), y: 100 },
    color: 'yellow'
})

const playerCharacters = [p1Character, p2Character, p3Character, p4Character];
const players = [player1, player2, player3, player4];

// Animation function
function animate() {
    updateAnimations();

    

    player1.movementVelocity.x = 0;

    if (keyPressed[keys.left] && lastMoveKeyPressed === keys.left) {
        player1.movementVelocity.x = -2;
        player1.direction = 180;
    } else if (keyPressed[keys.right] && lastMoveKeyPressed === keys.right) {
        player1.movementVelocity.x = 2;
        player1.direction = 0;
    }

    if (keyPressed[keys.jump] && player1.availableJumps > 0) {
        player1.movementVelocity.y = -9;
        keyPressed[keys.jump] = false;
        player1.availableJumps--;
    }

    updatePercentageDisplays();
}

hideNonExistentPlayers();
setupUserIcons();
animate();

// Event listeners
window.addEventListener('keydown', (event) => {
    if (Object.values(keys).includes(event.key)) {
        keyPressed[event.key] = true;

        if (event.key === keys.left || event.key === keys.right) {
            lastMoveKeyPressed = event.key;
        }
        if (event.key === keys.attackNormal) {
            player1.attack();
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (Object.values(keys).includes(event.key)) {
        keyPressed[event.key] = false;
    }
});

// Util
function updateAnimations() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    background.update();

    for (let i = 0; i < players.length; i++) {
        players[i].update();
    }

    for (let i = 0; i < map.length; i++) {
        map[i].update();
    }

}

function updatePercentageDisplays() {
    for (let i = 0; i < players.length; i++) {
        // Update the text content of each percentage display element
        percentageDisplays[i].textContent = players[i].percentage + "%";
        percentageDisplays[i].style.color = getColorForPercentage(players[i].percentage);

    }
}

function getColorForPercentage(percentage) {
    switch (true) {
        case percentage >= 200:
          return '#5A0000'; // Dark red for percentages >= 200
        case percentage > 100:
          return '#CA0000'; // Red for percentages > 100
        case percentage > 70:
          return '#FFA500'; // Orange for percentages > 70
        case percentage > 35:
          return '#FFFF00'; // Yellow for percentages > 35
        default:
          return '#FFFFFF'; // White for percentages <= 35
      }
}

function hideNonExistentPlayers() {
    for (let i = 0; i < playerInfoDisplays.length; i++) {
        if (i >= players.length) {
            playerInfoDisplays[i].style.display = 'none';
        }
    }
}

function setupUserIcons() {
    for (let i = 0; i < players.length; i++) {
        playerIconDisplays[i].src = characterData[playerCharacters[i]].find(a => a.actionName === 'info').logoSrc;
    }
}