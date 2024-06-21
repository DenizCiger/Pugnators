const socket = io('https://socket.wohlschlager.net:443');
// const socket = io('localhost:8443');

// Game variables
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const availableKeys = {
    jump:  32,  // Space
    up:    87,  // W
    left:  65,  // A
    down:  83,  // S
    right: 68,  // D
    light: 74,  // J
    heavy: 75,  // K
    special: 76,  // L
};
const pressedKeys = {
    jump: false,
    up: false,
    left: false,
    down: false,
    right: false,
    light: false,
    heavy: false,
    special: false,
};

// Draw everything on the canvas
function drawCanvas(players, map) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.5; // Set transparency

    // Draw map
    for (let i = 0; i < map.length; i++) {
        ctx.fillStyle = map[i].color;
        ctx.fillRect(map[i].x, map[i].y, map[i].width, map[i].height);
    }
    // Draw players
    for (let i = 0; i < players.length; i++) {
        const pH = players[i].hitbox;
        const att = players[i].attack;

        ctx.fillStyle = players[i].color;
        ctx.fillRect(players[i].x, players[i].y, pH.width, pH.height);
        ctx.fillStyle = att.color;
        ctx.fillRect(att.position.x, att.position.y, att.width, att.height);
    }
    
    ctx.globalAlpha = 1; // Reset transparency
}
// Update the percentage display
function updatePercentage(players) {
    // Get the player list container
    const playerListContainer = document.getElementById("playerList");
    playerListContainer.innerHTML = ""; // Clear the container

    // Iterate over the players and create/update the percentage displays
    players.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.textContent = `Player ${index + 1}: ${player.damage}%`;
        playerListContainer.appendChild(playerDiv);
    });
}
// Handle position updates
socket.on('update', (data) => {
    // Extract data
    const players = data.players;
    const map = data.map;
    
    drawCanvas(players, map);
    updatePercentage(players);
});
// Create a reverse lookup object
const keyMappings = Object.fromEntries(
    Object.entries(availableKeys).map(([action, keyCode]) => [keyCode, action])
);
// Handle key presses
window.addEventListener('keydown', (event) => {
    const action = keyMappings[event.keyCode];
    if (action) {
        pressedKeys[action] = true;
        socket.emit('keyPressUpdate', pressedKeys);
    }
});
// Handle key releases
window.addEventListener('keyup', (event) => {
    const action = keyMappings[event.keyCode];
    if (action) {
        pressedKeys[action] = false;
        socket.emit('keyPressUpdate', pressedKeys);
    }
});