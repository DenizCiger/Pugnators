// Websocket server for handling key presses and releases
const PORT = 8443;
const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: { origin: '*' }
});

/*--------------------*/
/*   Game functions   */
/*--------------------*/

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

    // Wall slide handling
    if (player.isOnWall() != 0) {
        // Jumping against wall
        if (player.moveVelos.y < 0) {
            player.moveVelos.y += moveVeloConsts.gravity.y;
        } else {
            // Wall slide acceleration
            if (player.moveVelos.y < maxSpeeds.wallSlide) {
                player.moveVelos.y += moveVeloConsts.wallSlideAcceleration.y;
            } else {
                player.moveVelos.y = maxSpeeds.wallSlide;
            }
        }
    }
    else {
        // Gravity handling
        if (player.moveVelos.y < maxSpeeds.fall) {
            player.moveVelos.y += moveVeloConsts.gravity.y;
        } else {
            player.moveVelos.y = maxSpeeds.fall;
        }
    }
    
    player.rechargeJumps();

    // Jump handling
    if (player.pressedKeys.jump) {
        player.jump();
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

/*--------------------*/
/*   Game constants   */
/*--------------------*/

const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'orange'];
const wallCheckTolerance = 7;
const groundCheckTolerance = 5;
const moveVeloConsts = {
    jump:       { x:  0,    y: -12 },
    gravity:    { x:  0,    y:   1.5 },
    walk:       { x:  6,    y:   0 },
    wallSlideAcceleration:  { x:  0,    y:   .5 },
    wallJump:   { x:  10,    y: -10 }
};
const maxSpeeds = {
    fall:      25,
    walk:       8,
    wallSlide:  2.5,
};

/*------------------*/
/*   Game classes   */
/*------------------*/
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
        this.width = 24;
        this.height = 48;
        this.moveVelos = {
            x: 0,
            y: 0
        };
        this.performedJumps = 0;
        this.max_jumps = 2;
    }

    jump() {
        if (this.performedJumps < this.max_jumps) {
            if (this.isOnWall() != 0) {
                this.moveVelos.x = moveVeloConsts.wallJump.x * this.isOnWall();
            }
            this.moveVelos.y = moveVeloConsts.jump.y;
            this.performedJumps += 1;
            this.pressedKeys.jump = false; // Prevents holding space to jump higher
        }
    }

    isGrounded() {
        let potentialGrounds = obstacles.filter(obstacle => !obstacle.isPassable);
        let groundCheck = {
            position: { x: this.position.x, y: this.position.y + this.height-wallCheckTolerance },
            width: this.width,
            height: wallCheckTolerance*2
        };
        return collidesWithAny(groundCheck, potentialGrounds);
    }

    isOnWall() {
        // -1 = left, 0 = none, 1 = right, 2 = both
        let onWall = 0;
        let potentialWalls = obstacles.filter(obstacle => !obstacle.isPassable);

        let leftHitbox = {
            position: { x: this.position.x - wallCheckTolerance, y: this.position.y },
            width: wallCheckTolerance*2,
            height: this.height
        };
        let rightHitbox = {
            position: { x: this.position.x + this.width, y: this.position.y },
            width: wallCheckTolerance*2,
            height: this.height
        };

        if (collidesWithAny(leftHitbox, potentialWalls)) {
            onWall = -1;
        }
        if (collidesWithAny(rightHitbox, potentialWalls)) {
            onWall = onWall == -1 ? 2 : 1;
        }

        return onWall;
    }

    rechargeJumps() {
        if (this.isGrounded() || this.isOnWall() != 0){
            console.log('Grounded', this.isGrounded(), 'On wall', this.isOnWall());
            this.performedJumps = 0;
        }
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
    new Obstacle({
        position: { x: 220, y: 100 },
        color: 'black',
        width: 20,
        height: 100
    }),
];


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