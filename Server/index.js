// Websocket server for handling key presses and releases
const PORT = 8443;
const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: { origin: '*' }
});

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
            right: false
        };
        this.width = 20;
        this.height = 60;
        this.moveVelos = {
            x: 0,
            y: 0
        };
    }

    collidesWith(other) {
        for (const element of other) {
            if (this.position.x < element.position.x + element.width &&
                this.position.x + this.width > element.position.x &&
                this.position.y < element.position.y + element.height &&
                this.position.y + this.height > element.position.y) {
                return true;
            }
        }
        return false;
    }
}

class Obstacle {
    constructor({
        position = { x: 0, y: 0 },
        color,
        width = 200,
        height = 20
    }) {
        this.position = position;
        this.color = color;
        this.width = width;
        this.height = height;
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
    jump:       { x:  0,    y: -15 },
    gravity:    { x:  0,    y:   1 },
    walk:      { x:  4,    y:   0 },
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
                player.moveVelos.x /= 1.1;
            }
        }

        // Gravity handling
        if (player.moveVelos.y < maxSpeeds.fall) {
            player.moveVelos.y += moveVeloConsts.gravity.y;
        } else {
            player.moveVelos.y = maxSpeeds.fall;
        }

        player.position.x += player.moveVelos.x;
        player.position.y += player.moveVelos.y;

        // Out of bounds handling
        if (player.position.x > 480) {
            player.position.x = -20;
        }
        if (player.position.y > 270) {
            player.position.y = -20;
        }
        if (player.position.x < -20) {
            player.position.x = 480;
        }
        if (player.position.y < -20) {
            player.position.y = 270;
        }

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