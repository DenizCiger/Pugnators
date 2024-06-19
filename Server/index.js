const fs = require('fs');

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
            player.state = 'walkLeft';
        }
        if (player.pressedKeys.right) {
            if (player.moveVelos.x < maxSpeeds.walk) {
                player.moveVelos.x += moveVeloConsts.walk.x;
            } else {
                player.moveVelos.x = maxSpeeds.walk;
            }
            player.state = 'walkRight';
        }
    } else {
        if (Math.abs(player.moveVelos.x) < 0.1) {
            player.moveVelos.x = 0;
        } else {
            player.moveVelos.x *= 0.2;
        }
        if (player.moveVelos.x == 0 && player.isGrounded())
        {
            player.state = 'idle';
        }
    }

    // Fall handling
    const onWall = player.isOnWall();
    // Player is running against a wall
    if (((onWall == -1 || onWall == 2) && player.pressedKeys.left) ||
        ((onWall == 1 || onWall == 2) && player.pressedKeys.right)) {
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
        player.state = 'wallSlide' + (onWall == 1 ? 'Right' : 'Left');
    } else {
        // Gravity handling
        player.moveVelos.y += moveVeloConsts.gravity.y;
        if (player.moveVelos.y > maxSpeeds.fall) {
            player.moveVelos.y = maxSpeeds.fall;
        }
        if (player.moveVelos.y > 0 && player.isGrounded()) {
            player.moveVelos.y = 0;
            player.state = 'idle';
        }

        if (player.moveVelos.y > 0 && !player.pressedKeys.jump && player.state != 'wallJumpLeft' && player.state != 'wallJumpRight')
        {
            player.state = 'fall';
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
    const x = player.hitbox.position.x;
    const y = player.hitbox.position.y;
    const width = player.hitbox.width;
    const height = player.hitbox.height;

    if (x > 480+width) {
        player.position.x = -width;
    }
    if (y > 270+height) {
        player.position.y = -height;
    }
    if (x < -width) {
        player.position.x = 480+width;
    }
    if (y < -height) {
        player.position.y = 270+height;
    }
}
// Update player position
function updatePosition(player) {
    updateVelocity(player);

    const solids = obstacles.filter(obstacle => !obstacle.isPassable);
    let steps = Math.max(Math.abs(player.moveVelos.x), Math.abs(player.moveVelos.y));
    
    moveInSteps(player, steps, solids)
}
// Move player in steps for accurate collision detection
function moveInSteps(player, steps, solids) {
    for (let i = 0; i < steps; i++) {
        let oldPosition = { x: player.position.x, y: player.position.y };
        
        player.position.x += player.moveVelos.x / steps;
        if (collidesWithAny(player.hitbox, solids)) {
            player.position.x = oldPosition.x;
            player.moveVelos.x = 0;
        } else {
            fixOutOfBounds(player);
        }

        player.position.y += player.moveVelos.y / steps;
        if (collidesWithAny(player.hitbox, solids)) {
            player.position.y = oldPosition.y;
            player.moveVelos.y = 0;
        } else {
            fixOutOfBounds(player);
        }

        player.hitbox.updatePosition(player.position);
    }
}
// Random color generator
function randomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

/*--------------------*/
/*   Game constants   */
/*--------------------*/

const preLoadGameData = JSON.parse(fs.readFileSync('gameData.json'));
const wallCheckTolerance = 2;
const groundCheckTolerance = 2;
const moveVeloConsts = {
    jump:       { x:  0,    y: -12 },
    gravity:    { x:  0,    y:   1.5 },
    walk:       { x:  5,    y:   0 },
    wallSlideAcceleration:  { x:  0,    y:   .5 },
    wallJump:   { x:  -15,    y: -10 }
};
const maxSpeeds = {
    fall:      25,
    walk:       8,
    wallSlide:  2.5,
};

/*------------------*/
/*   Game classes   */
/*------------------*/

class Hitbox {
    constructor({
        position = { x: 0, y: 0 },
        color = 'white',
        width = 0,
        height = 0
    }) {
        this.position = position;
        this.color = color;
        this.width = width;
        this.height = height;
    }
    updatePosition(newPosition) {
        this.position = newPosition;
    }
}
class Attack extends Hitbox {
    constructor({
        position = { x: 0, y: 0 },
        color = 'red',
        width = 0,
        height = 0,
        damage = 0,
        knockback = { x: 0, y: 0 },
        hitstun = 0,
        canMove = true,
        offset = { x: 0, y: 0 }
    }) {
        super({
            position,
            color,
            width,
            height
        });

        this.damage = damage;
        this.knockback = knockback;
        this.hitstun = hitstun;
        this.canMove = canMove;
        this.offset = offset;
    }
}
class Sprite {
    constructor({
        position = { x: 0, y: 0 },
        color,
        spriteFileLoc = '../null.png',
    }) {
        this.position = position;
        this.color = color;
        this.spriteFileLoc = spriteFileLoc;
    }
    draw() {
        // Draw sprite
    }
}
class Fighter {
    constructor({
        characterType,
        position = { x: 0, y: 0 },
        hitboxColor = 'white',
        hitboxWidth = 24,
        hitboxHeight = 48
    }) {
        
        this.characterType = characterType;
        this.position = position;
        this.pressedKeys = {
            space: false,
            up: false,
            left: false,
            down: false,
            right: false,
            jump: false,
            light: false,
            heavy: false,
            special: false,
        };

        
        this.moveVelos = {
            x: 0,
            y: 0
        };
        this.performedJumps = 0;
        this.max_jumps = 2;
        this.canMove = false;
        this.state = 'idle';
        this.damage = Math.floor(Math.random() * 1000);
        
        this.hitbox = new Hitbox({
            position: { x: this.position.x, y: this.position.y },
            color: hitboxColor,
            width: hitboxWidth,
            height: hitboxHeight
        });
        this.currentAttack  = new Attack({
            position: {
                x: this.position.x,
                y: this.position.y
            },
            color: 'red',
            width: 0,
            height: 0,
        });
    }

    jump() {
        if (this.performedJumps < this.max_jumps) {
            const onWall = this.isOnWall();
            if (onWall != 0) {
                this.moveVelos.x = moveVeloConsts.wallJump.x*onWall;
                this.state = 'wallJump' + (onWall == 1 ? 'Right' : 'Left')
            } else {
                this.state = 'jump';
            }
            this.moveVelos.y = moveVeloConsts.jump.y;
            this.performedJumps += 1;
            this.pressedKeys.jump = false; // Prevents holding space to jump higher
        }
    }
    isGrounded() {
        let potentialGrounds = obstacles.filter(obstacle => !obstacle.isPassable);
        let groundCheck = {
            position: { x: this.hitbox.position.x, y: this.hitbox.position.y + this.hitbox.height+groundCheckTolerance },
            width: this.hitbox.width,
            height: wallCheckTolerance
        };
        return collidesWithAny(groundCheck, potentialGrounds);
    }
    isOnWall() {
        // -1 = left, 0 = none, 1 = right, 2 = both
        let onWall = 0;
        let potentialWalls = obstacles.filter(obstacle => !obstacle.isPassable);

        let leftHitbox = {
            position: { x: this.hitbox.position.x - wallCheckTolerance, y: this.hitbox.position.y },
            width: wallCheckTolerance,
            height: this.hitbox.height
        };
        let rightHitbox = {
            position: { x: this.hitbox.position.x + this.hitbox.width, y: this.hitbox.position.y },
            width: wallCheckTolerance,
            height: this.hitbox.height
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
            this.performedJumps = 0;
        }
    }
    attack(category, type) {
        const attackData  = preLoadGameData.characters[this.characterType].attacks[category][type];
        const current = attackData.hitboxes[0];

        this.currentAttack = new Attack({
            position: {
                x: this.position.x + current.offset.x,
                y: this.position.y + current.offset.y
            },
            width:     current.width,
            height:    current.height,
            damage:    current.damage,
            knockback: current.knockback,
            hitstun:   current.hitstun,
            canMove:   current.canMove,
            offset:    current.offset
        });
        console.log(this.currentAttack)
    }
}
class Obstacle extends Hitbox{
    constructor({
        position = { x: 0, y: 0 },
        color,
        width = 280,
        height = 20,
        isPassable = false
    }) {
        super({
            position, 
            color,
            width,
            height
        });

        this.isPassable = isPassable;
    }
}

/*--------------------*/
/*   Game variables   */
/*--------------------*/

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
    new Obstacle({
        position: { x: 440, y: -50 },
        color: 'black',
        width: 20,
        height: 400
    }),
];

/*-------------------------*/
/*   Connection handling   */
/*-------------------------*/

io.on('connection', (socket) => {
    console.log('A user connected');
    sockets[socket.id] = socket;
    players[socket.id] = new Fighter({
        characterType: 'Nerd',
        position: { x: 100, y: 0 },
        hitboxColor: randomColor()
    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete sockets[socket.id];
        delete players[socket.id];
    });
    // Handle incoming key presses
    socket.on('keyPressUpdate', (pressedKeys) => {
        const player = players[socket.id];
        const oldPressedKeys = player.pressedKeys;
        player.pressedKeys = pressedKeys;

        if (oldPressedKeys.light != player.pressedKeys.light && player.pressedKeys.light) {
            player.attack('light', 'nlight');
        }
    });

});

/*---------------*/
/*   Game loop   */
/*---------------*/

setInterval(() => {
    const pack = [];
    const playerData = [];
    const mapData = [];

    // Update player physics
    for (const player of Object.values(players)) {
        updatePosition(player);

        // Saving relevant player data
        playerData.push({
            x: player.position.x,
            y: player.position.y,
            color: player.hitbox.color,
            hitbox: player.hitbox,
            state: player.state,
            damage: player.damage
        });
    }

    for (const obstacle of obstacles) {
        mapData.push({
            x: obstacle.position.x,
            y: obstacle.position.y,
            color: obstacle.color,
            width: obstacle.width,
            height: obstacle.height
        });
    }

    for (const socket of Object.values(sockets)) {
        socket.emit('update', { players: playerData, map: mapData});
    }
}, 1000/60);

/*---------------------*/
/*   Starting Server   */
/*---------------------*/

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});