class Sprite {
    constructor({ position = {x: 0, y:0}, imageSrc, scale = 1, numberOfFrames = 1, framesHold = 5, offset = {x: 0, y: 0}}, pixelMultiplier = 4) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        
        this.numberOfFrames = numberOfFrames;
        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.offset = offset;
        this.pixelMultiplier = pixelMultiplier
        this.offset.x = this.offset.x * this.pixelMultiplier;
        this.offset.y = this.offset.y * this.pixelMultiplier;
    }

    draw() {
        c.drawImage(
            this.image,
            this.currentFrame * this.image.width / this.numberOfFrames,
            0,
            this.image.width / this.numberOfFrames,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.image.width * this.scale / this.numberOfFrames,
            this.image.height * this.scale
        );
    } 

    update() {
        this.draw();
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {         
            if (this.currentFrame < this.numberOfFrames - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }
}



class Fighter extends Sprite {
    constructor({
        position = {x: 0, y: 0},
        movementVelocity,
        color = 'red',
        imageSrc,
        scale = 1,
        numberOfFrames = 1,
        framesHold = 5,
        offset = {x: 0, y: 0},
        pixelMultiplier = 4
    }) {
        super({
            position,
            imageSrc,
            scale,
            numberOfFrames,
            framesHold,
            offset,
            pixelMultiplier
        });

        console.log(this);
        console.log(this.image.src);

        this.movementVelocity = movementVelocity;
        this.height = 32 * this.pixelMultiplier;
        this.width =  12 * this.pixelMultiplier;
        this.direction = 0;
        this.availableJumps = 2;
        this.color = color;
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        };
        this.isAttacking = false;
        this.percentage = Math.floor(Math.random() * 1000);
    }

    update() {
        this.draw();
        this.drawHitbox();
        this.position.y += this.movementVelocity.y;
        
        if (this.position.x + this.width + this.movementVelocity.x >= canvas.width || this.position.x + this.movementVelocity.x <= 0) {
            this.movementVelocity.x = 0;
        } else {
            this.position.x += this.movementVelocity.x;
        }

        if (this.position.y + this.height + this.movementVelocity.y >= canvas.height) {
            this.movementVelocity.y = 0;
            this.availableJumps = 2;
        } else {
            this.movementVelocity.y += gravity;
        }
    }

    drawHitbox() {
        c.fillStyle = this.color;
        c.globalAlpha = 0.5
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.globalAlpha = 1
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}