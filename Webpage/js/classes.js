class Sprite {
    constructor({
        position = { x: 0, y: 0 },
        scale = 1,
        pixelMultiplier = 4,
        animationData = { imageSrc: null, offset: { x: 0, y: 0 }, numberOfFrames: 1 },
        height,
        width
    }) {
        this.position = position;
        this.pixelMultiplier = pixelMultiplier;
        this.scale = scale * this.pixelMultiplier;
        this.animationData = animationData;

        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.flipHorizontally = false;

        this.image = new Image();

        this.height = height;
        this.width = width;

        if (this.animationData.imageSrc) {
            this.setAnimationData({ imageSrc: this.animationData.imageSrc, offset: this.animationData.offset, numberOfFrames: this.animationData.numberOfFrames });
        }
    }

    setAnimationData({
        imageSrc,
        offset = { x: 0, y: 0 },
        numberOfFrames = 1,
        framesHold = 5
    }) {
        this.isLoadingImage = true; // Set loading flag before starting image load
        this.currentFrame = 0;

        this.animationData.imageSrc = imageSrc;
        this.animationData.offset = offset;
        this.animationData.numberOfFrames = numberOfFrames;
        this.animationData.framesHold = framesHold;

        this.image.onload = () => {
            this.isLoadingImage = false; // Reset loading flag when image is loaded
        };

        this.image.src = imageSrc;
    }
    
    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.animationData.framesHold === 0) {
            if (this.currentFrame < this.animationData.numberOfFrames - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }

    draw() {
        if (this.animationData.imageSrc) {
            ctx.save(); // Save the current canvas state
    
            if (this.flipHorizontally) {
                // Flip the image horizontally
                ctx.translate(
                    this.position.x+this.width + this.animationData.offset.x*this.pixelMultiplier,
                    this.position.y
                );
                ctx.scale(-1, 1);

                let width = this.image.width / this.animationData.numberOfFrames;
                let height = this.image.height;

                ctx.drawImage(
                    this.image,
                    this.currentFrame * width,
                    0,
                    width,
                    height,
                    0,
                    0,
                    width * this.scale,
                    height * this.scale
                );
            }
            else {

                ctx.drawImage(
                    this.image,
                    this.currentFrame * this.image.width / this.animationData.numberOfFrames,
                    0,
                    this.image.width / this.animationData.numberOfFrames,
                    this.image.height,
                    this.position.x - this.animationData.offset.x * this.pixelMultiplier,
                    this.position.y - this.animationData.offset.y * this.pixelMultiplier,
                    this.image.width * this.scale / this.animationData.numberOfFrames,
                    this.image.height * this.scale
                );
            }
    
            ctx.restore(); // Restore the saved canvas state
        }
    } 

    update() {
        this.draw();
        this.animateFrames();
    }

}

class Fighter extends Sprite {
    constructor({
        characterType,
        position = { x: 0, y: 0 },
        movementVelocity = { x: 0, y: 0 },
        color,
        pixelMultiplier = 4,
        height = 48,
        width = 18
    }) {

        super({
            position: position,
            pixelMultiplier: pixelMultiplier,
            height: height * pixelMultiplier,
            width: width * pixelMultiplier
        });

        this.state = 'info';
        this.characterType = characterType;
        this.action = characterData[this.characterType].find(a => a.actionName === this.state);

        this.scale = this.action.scale * pixelMultiplier;
        this.movementVelocity = movementVelocity;
        this.direction = 0;
        this.availableJumps = 2;
        this.color = color;
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        };
        this.isAttacking = false;
        this.percentage = Math.floor(Math.random() * 400);

        this.setState('idle');
    }

    setState(newState) {
        this.state = newState;
        this.action = characterData[this.characterType].find(a => a.actionName === this.state);
        if (this.action) {
            this.setAnimationData({
                imageSrc: this.action.animationSrc,
                offset: this.action.offset,
                numberOfFrames: this.action.numberOfFrames,
                framesHold: this.action.framesHold
            });
        }
    }

    update() {
        if (this.direction == 180) {
            this.flipHorizontally = true;
        } else {
            this.flipHorizontally = false
        }

        this.draw();
        this.drawHitbox();
        this.animateFrames();

        if (!this.isLoadingImage) {
            if (this.movementVelocity.x !== 0 && this.state !== 'running') {
                this.setState('running');
            } else if (this.movementVelocity.x === 0 && this.state !== 'idle') {
                this.setState('idle');
            }
        }

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
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.globalAlpha = 1
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }

    logCoords() {
        console.log("X: {0} Y:{1}", this.position.x, this.position.y)
        console.log("PrintX: {0} PrintY:{1}", (this.position.x - this.animationData.offset.x * this.pixelMultiplier), (this.position.y - this.animationData.offset.y * this.pixelMultiplier))
        console.log("Weird: {0}", (canvas.width-this.position.x));
    }
}

class Obstacle extends Sprite {
    constructor({
        position = { x: 0, y: 0 },
        pixelMultiplier = 4,
        color = 'purple',
        dropThrough = false,
        height = 10,
        width = 40,
    }) {

        super({
            position,
            pixelMultiplier
        });

        this.color = color;
        this.dropThrough = dropThrough;
        this.height = height * this.pixelMultiplier;
        this.width = width * this.pixelMultiplier;
    }

    update() {
        this.draw();
        this.drawHitbox();
    }

    drawHitbox() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.globalAlpha = 1
    }
}
