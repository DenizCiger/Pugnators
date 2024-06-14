// Websocket server for handling key presses and releases
const PORT = 8443;
const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: { origin: '*' }
});


// Collision detection
function collides(a, b) {
    return a.position.x < b.position.x + b.width &&
           a.position.x + a.width > b.position.x &&
           a.position.y < b.position.y + b.height &&
           a.position.y + a.height > b.position.y;
}
// Collision detection with array
function collidesWithAny(a, b) {
    for (const element of b) {
        if (collides(a, element)) {
            return true;
        }
    }
    return false;
}
// Update player velocity
function updateVelocity(player) {
    // Walk handling
    if (player.pressedKeys.left != player.pressedKeys.right) {  
        if (player.pressedKeys.left) {
            if (player.moveVelos.x > -maxSpeeds.walk) {
                player.moveVelos.x -= moveVeloConsts.walk.x;
            } else {
                player.moveVelos.x = -maxSpeeds.walk;
            }
        }
        if (player.pressedKeys.right) {
            if (player.moveVelos.x < maxSpeeds.walk) {
                player.moveVelos.x += moveVeloConsts.walk.x;
            } else {
                player.moveVelos.x = maxSpeeds.walk;
            }
        }
    } else {
        if (Math.abs(player.moveVelos.x) < 0.1) {
            player.moveVelos.x = 0;
        } else {
            player.moveVelos.x /= 3;
        }
    }

    // Gravity handling
    if (player.moveVelos.y < maxSpeeds.fall) {
        player.moveVelos.y += moveVeloConsts.gravity.y;
    } else {
        player.moveVelos.y = maxSpeeds.fall;
    }

    // Jump handling
    if (player.pressedKeys.jump) {
        player.moveVelos.y = moveVeloConsts.jump.y;
    }
}
// Fix out of bounds player position
function fixOutOfBounds(player) {
    if (player.position.x > 480+player.width) {
        player.position.x = -player.width;
    }
    if (player.position.y > 270+player.height) {
        player.position.y = -player.height;
    }
    if (player.position.x < -player.width) {
        player.position.x = 480+player.width;
    }
    if (player.position.y < -player.height) {
        player.position.y = 270+player.height;
    }
}
// Update player position
function updatePosition(player) {
    updateVelocity(player);
    const solids = obstacles.filter(obstacle => !obstacle.isPassable);

    player.position.x += player.moveVelos.x;

    if (collidesWithAny(player, solids)) {
        player.position.x -= player.moveVelos.x;
        player.moveVelos.x = 0;
    }

    player.position.y += player.moveVelos.y;
    if (collidesWithAny(player, solids)) {
        player.position.y -= player.moveVelos.y;
        player.moveVelos.y = 0;
    }

    // Out of bounds handling
    fixOutOfBounds(player);
}

// Game classes
class Fighter {
    constructor({
        characterType,
        position = { x: 0, y: 0 },
        color
    }) {
        this.characterType = characterType;
        this.position = position;
        this.color = color;
        this.pressedKeys = {
            space: false,
            up: false,
            left: false,
            down: false,
            right: false,
            jump: false
        };
        this.width = 20;
        this.height = 50;
        this.moveVelos = {
            x: 0,
            y: 0
        };
    }
}
class Obstacle {
    constructor({
        position = { x: 0, y: 0 },
        color,
        width = 280,
        height = 20,
        isPassable = false
    }) {
        this.position = position;
        this.color = color;
        this.width = width;
        this.height = height;
        this.isPassable = isPassable;
    }
}

// Game variables
let sockets = [];
let players = [];
let obstacles = [
    new Obstacle({
        position: { x: 100, y: 200 },
        color: 'black',
    }),
];
const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'orange'];
const moveVeloConsts = {
    jump:       { x:  0,    y: -10 },
    gravity:    { x:  0,    y:   2 },
    walk:       { x:  6,    y:   0 },
};
const maxSpeeds = {
    fall:      10,
    walk:       8,
};

// Handle incoming connections
io.on('connection', (socket) => {
    console.log('A user connected');
    sockets[socket.id] = socket;
    players[socket.id] = new Fighter({
        characterType: 'Nerd',
        position: { x: 0, y: 0 },
        color: colors[Math.floor(Math.random() * colors.length)]
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete sockets[socket.id];
        delete players[socket.id];
    });
    
    
    // Handle incoming key presses
    socket.on('keyPressUpdate', (pressedKeys) => {
        players[socket.id].pressedKeys = pressedKeys;
    });

});

// Update
setInterval(() => {
    const pack = [];

    // Update player physics
    for (const player of Object.values(players)) {
        updatePosition(player);

        // Saving relevant player data
        pack.push({
            position: player.position,
            color: player.color,
            width: player.width,
            height: player.height
        });
    }

    for (const obstacle of obstacles) {
        pack.push({
            position: obstacle.position,
            color: obstacle.color,
            width: obstacle.width,
            height: obstacle.height
        });
    }

    for (const socket of Object.values(sockets)) {
        socket.emit('update', pack);
    }
}, 1000/60);




// Start the server
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});