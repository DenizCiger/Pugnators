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

        this.topSide = this.position.y;
        this.bottomSide = this.position.y + this.height;
        this.leftSide = this.position.x;
        this.rightSide = this.position.x + this.width;

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
        this.movementVelocity = { x: 0, y: 0 };
        this.jumpVelocity = { x: 0, y: 0 };
        this.knockbackVelocity = { x: 0, y: 0 };
        this.fullVelocity = { x: 0, y: 0 };
        this.direction = 0;
        this.availableJumps = 2;
        this.color = color;
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        };
        this.isAttacking = false;
        this.currentAttack = '';
        this.percentage = Math.floor(Math.random() * 400);

        this.canWallJump = false;
        this.isWallJumping = false;
        this.isOnGround = false;
        this.maxGravityVelocity = maxYMovementVelocity;

        this.hitboxes = [];
        this.againstWall = 0;
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
        this.direction = this.movementVelocity.x > 0 ? 0 : (this.movementVelocity.x < 0 ? 180 : this.direction);
        this.flipHorizontally = (this.direction == 180);

        this.updateHitboxes();
        this.draw();
        this.drawHitbox();

        if (this.isAttacking && this.currentFrame == this.animationData.numberOfFrames-1) {
                this.isAttacking = false;
        }

        this.animateFrames();

        if (!this.isLoadingImage) {
            if (!this.isAttacking) {

                if (this.movementVelocity.x !== 0 && this.state !== 'running') {
                    this.setState('running');
                } else if (this.movementVelocity.x === 0 && this.state !== 'idle') {
                    this.setState('idle');
                }
            } else {
                this.setState(this.currentAttack);
            }
        }
        
        this.updateVelocities()
    }

    updateHitboxes() {
        this.hitboxes = [
            /* Base */
            new Hitbox ({
                position: this.position,
                height: this.height,
                width: this.width,
                color: 'cyan'
            }),
            /* Foot */
            new Hitbox ({
                position: {
                    x: this.position.x,
                    y: this.position.y+this.height-5
                },
                height: 10,
                width: this.width,
                color: 'blue'
            }),
            /* Left Side */
            new Hitbox ({
                position: {
                    x: this.position.x-5,
                    y: this.position.y
                },
                height: this.height,
                width: 10,
                color: 'green'
            }),
            /* Right Side */
            new Hitbox ({
                position: {
                    x: this.position.x+this.width-5,
                    y: this.position.y
                },
                height: this.height,
                width: 10,
                color: 'green'
            }),
        ]
    }

    updateVelocities() {
        /* Saving position before collision */
        var previousPosition = {x: this.position.x, y: this.position.y};

        /* Limiting the horizontal movement velocity */
        this.movementVelocity.x = Math.max(-maxXMovementVelocity, Math.min(this.movementVelocity.x, maxXMovementVelocity));

        /* Set horizontal velocity to zero if it's below the acceleration threshold */
        this.movementVelocity.x = Math.abs(this.movementVelocity.x) < horizontalAcceleration ? 0 : this.movementVelocity.x;

        /* Calculating overall velocity to apply */
        this.fullVelocity.x = this.jumpVelocity.x + this.movementVelocity.x + this.knockbackVelocity.x;
        this.fullVelocity.y = this.jumpVelocity.y + this.movementVelocity.y + this.knockbackVelocity.y;

        /* Updating X-Position */
        this.position.x += this.fullVelocity.x;

        /* Wrap around horizontally when reaching canvas boundaries */
        this.position.x = this.position.x >= canvas.width ? 0 : (this.position.x + this.width <= 0 ? canvas.width - this.width - 1 : this.position.x);

        /* New Position is colliding with something */
        if (this.checkCollisionWithWholeMap(map)) {
            if (this.movementVelocity.y > gravity) {
                this.maxGravityVelocity = maxYMovementVelocity * wallSlideFriction;
                this.availableJumps = 2;
            }
            else {
                this.canWallJump = false;
                this.maxGravityVelocity = maxYMovementVelocity;
            }

            this.position.x = previousPosition.x
            this.movementVelocity.x = 0;
            this.jumpVelocity.x = 0;
            this.knockbackVelocity.x *= -1;
        }
        else {
            this.canWallJump = false;
            this.maxGravityVelocity = maxYMovementVelocity;
        }

        this.position.y += this.fullVelocity.y;

        if (this.position.y >= canvas.height) {
            this.position.y = 0;
        }
        else if (this.position.y+this.height <= 0) {
            this.position.y = canvas.height-1;
        }
        
        if (this.checkCollisionWithWholeMap(map)) {
            this.position.y = previousPosition.y
            this.movementVelocity.y = 0;
            this.jumpVelocity.y = 0;
            this.knockbackVelocity.y *= -1;

            if (this.checkIsGrounded(map)) {
                this.availableJumps = 2;
                this.isOnGround = true;
                this.jumpVelocity.x = 0;
            }
            else {
                this.isOnGround = false;
            }

        } else {
            if (this.checkIsGrounded(map)) {
            } else {
                this.isOnGround = false;
            }
            if (this.movementVelocity.y + gravity < this.maxGravityVelocity) {
                if (!this.canWallJump) {
                    this.movementVelocity.y += gravity;
                }
                else {
                    this.movementVelocity.y += gravity * wallSlideFriction;
                }
            } else {
                this.movementVelocity.y = this.maxGravityVelocity
            }
        }

        this.jumpVelocity.x *= 0.96;

        if (Math.abs(this.jumpVelocity.x) < 0.5) {
            this.jumpVelocity.x = 0
        }
    }

    drawHitbox() {
        for (let i = 0; i < this.hitboxes.length; i++) {
            this.hitboxes[i].draw();
        }
    }

    attack(attackType) {
        this.isAttacking = true;
        this.currentAttack = attackType
        setTimeout(() => {
            this.currentAttack = '';
        }, 100);
    }

    jump() {
        this.movementVelocity.y = -9;
        keyPressed[keys.jump] = false;
        this.availableJumps--;

        if (this.canWallJump) {
            this.isWallJumping = true;
            if (this.againstWall == -1) {
                this.jumpVelocity.x = -wallJumpXForce;
            }
            else if (this.againstWall == 1){
                this.jumpVelocity.x = wallJumpXForce;
            }
        }
    }

    logCoords() {
        console.log("X: {0} Y:{1}", this.position.x, this.position.y)
        console.log("PrintX: {0} PrintY:{1}", (this.position.x - this.animationData.offset.x * this.pixelMultiplier), (this.position.y - this.animationData.offset.y * this.pixelMultiplier))
        console.log("Weird: {0}", (canvas.width-this.position.x));
    }

    checkCollisionWithWholeMap(mapArray) {
        var detectedCollision = false;

        for (let i = 0; i < mapArray.length && detectedCollision == false; i++) {
            detectedCollision |= this.hitboxes[0].collidesWith(mapArray[i]);
        }

        return detectedCollision;
    }

    checkIsGrounded(mapArray) {
        var detectedCollision = false;

        for (let i = 0; i < mapArray.length && detectedCollision == false; i++) {
            detectedCollision |= this.hitboxes[1].collidesWith(mapArray[i]);                
        }
        return detectedCollision;
    }

    isAgainstAnyWall(mapArray) {
        var detectedCollision = false;
        for (let i = 0; i < mapArray.length && detectedCollision == false; i++) {
            detectedCollision |= this.isAgainstWall(mapArray[i]);
        }

        return detectedCollision;
    }

    isAgainstWall(wall) {
        /* Wall on the side */
        if (this.hitboxes[2].collidesWith(wall) || this.hitboxes[3].collidesWith(wall)) {
            this.againstWall = this.hitboxes[2].collidesWith(wall) ? -1 : 1;
            canWallJump = true;
            return true;
        }
        
        /* No Wall collision */
        this.againstWall = 0;
        return false;
        
    }
}

class Obstacle extends Sprite {
    constructor({
        position = { x: 0, y: 0 },
        pixelMultiplier = 4,
        dropThrough = false,
        height = 10,
        width = 40,
    }) {

        super({
            position: position,
            pixelMultiplier: pixelMultiplier,
            width: width*pixelMultiplier,
            height: height*pixelMultiplier
        });

        this.dropThrough = dropThrough;
        this.hitboxes = [
            new Hitbox ({
                position: this.position,
                height: this.height,
                width: this.width,
                color: 'purple'
            }),
        ]
    }

    update() {
        this.draw();
        this.drawHitbox();
    }

    drawHitbox() {
        this.hitboxes.forEach(hitbox => hitbox.draw());
    }
}

class Hitbox {
    constructor ({
        position = { x: 0, y: 0 },
        height = 10,
        width = 10,
        color = 'blue'
    }) {
        this.position = position;
        this.height = height;
        this.width = width;
        this.color = color;

    }

    draw () {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.globalAlpha = 1
    }

    collidesWith(other) {
        if (
            this.position.x < other.position.x + other.width &&
            this.position.x + this.width > other.position.x &&
            this.position.y < other.position.y + other.height &&
            this.position.y + this.height > other.position.y
          ) {
          return true;
        }
        else {
          return false;
        }
    }
}