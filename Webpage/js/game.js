const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

var p1percentageDisplay = document.getElementById('percentage1')
var p2percentageDisplay = document.getElementById('percentage2')
var p3percentageDisplay = document.getElementById('percentage3')
var p4percentageDisplay = document.getElementById('percentage4')

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './images/Game-Textures/Copy/Glacial-mountains/background_glacial_mountains_lightened.png'
});

const player1 = new Fighter({
    position: {
        x: 0,
        y: 100
    },
    movementVelocity: {
        x: 0,
        y: 0
    },
    color: 'blue'
});

const player2 = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    movementVelocity: {
        x: 0,
        y: 0
    },
    color: 'green'
});

const keys = {
    left: 'a',
    right: 'd',
    jump: ' ',
    attackNormal: 'j'
};

const keyPressed = {};

let lastMoveKeyPressed;

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    background.update();
    player1.update();
    player2.update();

    player1.movementVelocity.x = 0;

    if (keyPressed[keys.left] && lastMoveKeyPressed === keys.left) {
        player1.movementVelocity.x = -2;
        player1.direction = 180
    } else if (keyPressed[keys.right] && lastMoveKeyPressed === keys.right) {
        player1.movementVelocity.x = 2;
        player1.direction = 0
    }

    if (keyPressed[keys.jump] && player1.availableJumps > 0) {
        player1.movementVelocity.y = -9;
        keyPressed[keys.jump] = false
        player1.availableJumps--;
    }

    p1percentageDisplay.textContent = player1.percentage + "%"
    p2percentageDisplay.textContent = player2.percentage + "%"
}

animate();

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
