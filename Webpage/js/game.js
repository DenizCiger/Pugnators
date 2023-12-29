const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 1080;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite {
    constructor({ position, movementVelocity, color = 'red' }) {
        this.position = position;
        this.movementVelocity = movementVelocity;
        this.height = 150;
        this.width = 50;
        this.direction = 0;
        this.availableJumps = 2;
        this.color = color;
        this.lastKey;
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        };
        this.isAttacking = false;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // attack box

        if (this.isAttacking) {

            c.fillStyle = 'red'
            c.globalAlpha = 0.5
            
            if (this.direction == 0)
            {
                c.fillRect (
                    this.attackBox.position.x, this.attackBox.position.y,
                    this.attackBox.width,
                    this.attackBox.height
                )
            }
            else {
                c.fillRect (
                    this.attackBox.position.x - (this.attackBox.width/2),
                    this.attackBox.position.y, this.attackBox.width,
                    this.attackBox.height
                )
            }
            c.globalAlpha = 1;
        } 
    }

    update() {
        this.draw();
        this.position.y += this.movementVelocity.y;
        
        if (this.position.x + this.width + this.movementVelocity.x >= canvas.width || this.position.x + this.movementVelocity.x <= 0) {
        }
        else{
            this.position.x += this.movementVelocity.x;
        }

        if (this.position.y + this.height + this.movementVelocity.y >= canvas.height) {
            this.movementVelocity.y = 0;
            this.availableJumps = 2;
        } else {
            this.movementVelocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}

const player = new Sprite({
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

const enemy = new Sprite({
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
    player.update();
    enemy.update();

    player.movementVelocity.x = 0;

    if (keyPressed[keys.left] && lastMoveKeyPressed === keys.left) {
        player.movementVelocity.x = -2;
        player.direction = 180
    } else if (keyPressed[keys.right] && lastMoveKeyPressed === keys.right) {
        player.movementVelocity.x = 2;
        player.direction = 0
    }

    if (keyPressed[keys.jump] && player.availableJumps > 0) {
        player.movementVelocity.y = -9;
        keyPressed[keys.jump] = false
        player.availableJumps--;
    }
}

animate();

window.addEventListener('keydown', (event) => {
    if (Object.values(keys).includes(event.key)) {
        keyPressed[event.key] = true;

        if (event.key === keys.left || event.key === keys.right) {
            lastMoveKeyPressed = event.key;
        }
        if (event.key === keys.attackNormal) {
            player.attack();
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (Object.values(keys).includes(event.key)) {
        keyPressed[event.key] = false;
    }
});
