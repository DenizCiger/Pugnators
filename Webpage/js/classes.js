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
        if (this.movementVelocity.x > 0) {
            this.direction = 0;
        } else if (this.movementVelocity.x < 0) {
            this.direction = 180;
        }

        if (this.direction == 180) {
            this.flipHorizontally = true;
        } else {
            this.flipHorizontally = false
        }

        this.draw();
        // this.drawHitbox();

        if (this.isAttacking && this.currentFrame == this.animationData.numberOfFrames-1) {
                this.isAttacking = false;
        }

        this.animateFrames();
        this.updateSides()

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

    updateSides() {
        this.topSide = this.position.y;
        this.bottomSide = this.position.y + this.height;
        this.leftSide = this.position.x;
        this.rightSide = this.position.x + this.width;
    }

    updateVelocities() {
        var previousPosition = {x: this.position.x, y: this.position.y};

        if (this.movementVelocity.x > maxXMovementVelocity) {
            this.movementVelocity.x = maxXMovementVelocity;
        } else if (this.movementVelocity.x < -maxXMovementVelocity) {
            this.movementVelocity.x = -maxXMovementVelocity;
        }

        if (Math.abs(this.movementVelocity.x) < horizontalAcceleration) {
            this.movementVelocity.x = 0;
        }
        
        this.fullVelocity.x = this.jumpVelocity.x + this.movementVelocity.x + this.knockbackVelocity.x;
        this.fullVelocity.y = this.jumpVelocity.y + this.movementVelocity.y + this.knockbackVelocity.y;

        this.position.x += this.fullVelocity.x;

        if (this.position.x >= canvas.width) {
            this.position.x = 0
        } else if (this.position.x+this.width <= 0) {
            this.position.x = canvas.width - this.width-1 
        }
        if (this.checkCollisionWithWholeMap(map)) {

            if (
                this.movementVelocity.y > gravity
            ) {
                this.canWallJump = true;
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

            if (!this.checkBottomMapCollision(map[0]) || this.position.y + this.height >= canvas.height) {
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
        ctx.fillStyle = 'cyan';
        ctx.globalAlpha = 0.5
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Base hitbox
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y+this.height-10, this.width, 10); // Foot hitbox
        ctx.globalAlpha = 1
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
            if (this.direction == 0) {
                this.jumpVelocity.x = -wallJumpXForce;
            }
            else {
                this.jumpVelocity.x = wallJumpXForce;
            }
        }
    }

    logCoords() {
        console.log("X: {0} Y:{1}", this.position.x, this.position.y)
        console.log("PrintX: {0} PrintY:{1}", (this.position.x - this.animationData.offset.x * this.pixelMultiplier), (this.position.y - this.animationData.offset.y * this.pixelMultiplier))
        console.log("Weird: {0}", (canvas.width-this.position.x));
    }

    checkBottomMapCollision(ground) {
        return this.bottomSide >= ground.position.y + ground.height;
    }

    checkCollisionWithWholeMap(mapArray) {
        var detectedCollision = false;

        for (let i = 0; i < mapArray.length && detectedCollision == false; i++) {
            detectedCollision |= checkRectangleCollision(
                                    this.position.x, this.position.y, this.width, this.height,
                                    mapArray[i].position.x, mapArray[i].position.y, mapArray[i].width, mapArray[i].height
                                );
        }

        return detectedCollision;
    }

    checkIsGrounded(mapArray) {
        var detectedCollision = false;

        for (let i = 0; i < mapArray.length && detectedCollision == false; i++) {
            detectedCollision |= checkRectangleCollision(
                                    this.position.x, this.position.y + this.height, this.width, this.height+1,
                                    mapArray[i].position.x, mapArray[i].position.y, mapArray[i].width, mapArray[i].height
                                );
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
        return (this.rightSide >= wall.leftSide && this.leftSide <= wall.leftSide) ||
        (this.leftSide <= wall.rightSide && this.rightSide >= wall.rightSide)
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
            position: position,
            pixelMultiplier: pixelMultiplier,
            width: width*pixelMultiplier,
            height: height*pixelMultiplier
        });

        this.color = color;
        this.dropThrough = dropThrough;
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