const socket = io('https://socket.wohlschlager.net:443');
// const socket = io('localhost:8443');

// Game variables
const ctx = document.getElementById('game').getContext('2d');
const availableKeys = {
    jump:  32,  // Space
    up:    87,  // W
    left:  65,  // A
    down:  83,  // S
    right: 68,  // D
};
const pressedKeys = {
    jump: false,
    up: false,
    left: false,
    down: false,
    right: false,
};

// Handle position updates
socket.on('update', (data) => {
    // Clear the canvas
    ctx.clearRect(0, 0, 800, 600);
    // Log data
    console.log(data)
    // Extract data
    const players = data.players;
    const map = data.map;


    ctx.globalAlpha = 0.5; // Set transparency

    // Draw map
    for (let i = 0; i < map.length; i++) {
        ctx.fillStyle = map[i].color;
        ctx.fillRect(map[i].x, map[i].y, map[i].width, map[i].height);
    }
    // Draw players
    for (let i = 0; i < players.length; i++) {
        const pH = players[i].hitbox;

        ctx.fillStyle = players[i].color;
        ctx.fillRect(players[i].x, players[i].y, pH.width, pH.height);
    }
    
    ctx.globalAlpha = 1;
});

// Handle incoming key presses
window.addEventListener('keydown', (event) => {
    if (event.keyCode === availableKeys.space) {
        pressedKeys.space = true;
    }
    if (event.keyCode === availableKeys.up) {
        pressedKeys.up = true;
    }
    if (event.keyCode === availableKeys.left) {
        pressedKeys.left = true;
    }
    if (event.keyCode === availableKeys.down) {
        pressedKeys.down = true;
    }
    if (event.keyCode === availableKeys.right) {
        pressedKeys.right = true;
    }
    if (event.keyCode === availableKeys.jump) {
        pressedKeys.jump = true;
    }



    socket.emit('keyPressUpdate', pressedKeys);
});
// Handle incoming key releases
window.addEventListener('keyup', (event) => {
    if (event.keyCode === availableKeys.space) {
        pressedKeys.space = false;
    }
    if (event.keyCode === availableKeys.up) {
        pressedKeys.up = false;
    }
    if (event.keyCode === availableKeys.left) {
        pressedKeys.left = false;
    }
    if (event.keyCode === availableKeys.down) {
        pressedKeys.down = false;
    }
    if (event.keyCode === availableKeys.right) {
        pressedKeys.right = false;
    }
    if (event.keyCode === availableKeys.jump) {
        pressedKeys.jump = false;
    }

    socket.emit('keyPressUpdate', pressedKeys);
});