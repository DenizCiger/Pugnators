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
    imageSrc: './images/Game-Textures/Copy/Glacial-mountains/background_glacial_mountains_lightened.png',
    scale: 5
});

// Players
const player1 = new Fighter({
    position: { x: 0, y: 100 },
    movementVelocity: { x: 0, y: 0 },
    imageSrc: './images/Game-Textures/Characters/Troller/Troller.png',
    scale: 4,
    offset: { x: 9, y: 0 }
});
const player2 = new Fighter({
    position: { x: 400, y: 100 },
    movementVelocity: { x: 0, y: 0 },
    imageSrc: './images/Game-Textures/Characters/Nerd/Nerd.png',
    color: 'blue',
    scale: 4,
    offset: { x: 10, y: 0 }
});

// Animation function
function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    background.update();
    player1.update();
    player2.update();

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

    percentageDisplays[0].textContent = player1.percentage + "%";
    percentageDisplays[1].textContent = player2.percentage + "%";
}

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
