class Sprite {
    constructor({
        printPosition = {
            x: 0,
            y: 0
        },
        scale = 1,
        pixelMultiplier = 4,
        animationData = {
            imageSrc: null,
            offset: {
                x: 0,
                y: 0
            },
            numberOfFrames: 1 
        },
        height,
        width
    }) {
        this.printPosition = printPosition;
        this.pixelMultiplier = pixelMultiplier;
        this.scale = scale * this.pixelMultiplier;
        this.animationData = animationData;

        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.flipHorizontally = false;

        this.image = new Image();
        this.image.src = this.animationData.imageSrc;

        this.height = height;
        this.width = width;
    }

    setAnimationData({
        animationSprite = null,
    }) {
        this.currentFrame = 0;

        this.image = animationSprite.image;
        this.animationData.imageSrc = animationSprite.readSrc;
        this.animationData.offset = animationSprite.offset;
        this.animationData.numberOfFrames = animationSprite.numberOfFrames;
        this.animationData.framesHold = animationSprite.framesHold;
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
                    this.printPosition.x - this.animationData.offset.x * this.pixelMultiplier,
                    this.printPosition.y - this.animationData.offset.y * this.pixelMultiplier,
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
            printPosition: position,
            pixelMultiplier: pixelMultiplier,
            height: height * pixelMultiplier,
            width: width * pixelMultiplier
        });

        this.position = position;
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
        this.animations = []

        this.hitboxes = [];
        this.againstWall = 0;
        this.load()
        this.setState('idle');
    }
    // Load the character's animations
    load() {
        var info = characterData[this.characterType]

        for (const [actionName, index] of Object.entries(actionIndexMap)) {
            const actionDetails = info.find(action => action.actionName === actionName);
            
            if (actionDetails) {
                this.animations[index] = new AnimationSprite ({
                                                                imageSrc: actionDetails.animationSrc,
                                                                numberOfFrames: actionDetails.numberOfFrames,
                                                                offset: actionDetails.offset,
                                                                framesHold: actionDetails.framesHold
                                                            });
            }
        }

    }
    // Set the state of the character
    setState(newState) {
        this.state = newState;
        this.action = characterData[this.characterType].find(a => a.actionName === this.state);
        if (this.action && actionIndexMap[this.state] !== undefined) {
            let index = actionIndexMap[this.state];
            this.setAnimationData({
                animationSprite: this.animations[index]
            });
        }
    }
    // Update the character's position and state
    update() {
        this.direction = this.movementVelocity.x > 0 ? 0 : (this.movementVelocity.x < 0 ? 180 : this.direction);
        this.flipHorizontally = (this.direction == 180);

        this.updateHitboxes();
        this.draw();
        // this.drawHitbox();

        this.isAttacking = (this.isAttacking && this.currentFrame == this.animationData.numberOfFrames-1) ? false : this.isAttacking;

        this.animateFrames();

        if (!this.isAttacking) {

            if (this.movementVelocity.x !== 0 && this.state !== 'running') {
                this.setState('running');
            } else if (this.movementVelocity.x === 0 && this.state !== 'idle') {
                this.setState('idle');
            }
        } else {
            this.setState(this.currentAttack);
        }
        
        this.updateVelocities()
    }
    // Update the character's hitboxes
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
    // Update the character's velocity
    updateVelocities() {
        /* Saving position before collision */
        var previousPosition = {x: this.position.x, y: this.position.y};

        /* Limiting the horizontal movement velocity */
        this.movementVelocity.x = Math.max(-maxXMovementVelocity, Math.min(this.movementVelocity.x, maxXMovementVelocity));

        /* Set horizontal movement velocity to zero if it's below the acceleration threshold */
        this.movementVelocity.x = Math.abs(this.movementVelocity.x) < horizontalAcceleration ? 0 : this.movementVelocity.x;

        /* Calculating overall velocity to apply */
        this.fullVelocity.x = this.jumpVelocity.x + this.movementVelocity.x + this.knockbackVelocity.x;
        this.fullVelocity.y = this.jumpVelocity.y + this.movementVelocity.y + this.knockbackVelocity.y;

        /* Updating X-Position */
        this.position.x += this.fullVelocity.x;

        /* Wrap around horizontally when reaching canvas boundaries */
        this.position.x = this.position.x >= canvas.width ? 0 : (this.position.x + this.width <= 0 ? canvas.width - this.width - 1 : this.position.x);

        /* Handle collision with the obstacles */
        if (this.checkCollisionWithWholeobstacles(obstacles)) {
            this.canWallJump = this.movementVelocity.y > gravity; // TODO: Find out why tf everything breaks when I move this???
            this.maxGravityVelocity = this.canWallJump ? maxYMovementVelocity * wallSlideFriction : maxYMovementVelocity;
            this.availableJumps = this.canWallJump ? 2 : 0;

            this.position.x = this.checkCollisionWithWholeobstacles(obstacles) ? previousPosition.x : this.position.x;
            this.movementVelocity.x = this.jumpVelocity.x = 0;
            this.knockbackVelocity.x *= -this.checkCollisionWithWholeobstacles(obstacles);
        }
        else {
            this.canWallJump = false;
            this.maxGravityVelocity = maxYMovementVelocity;
        }

        /* Updating Y-Position */
        this.position.y += this.fullVelocity.y;

        /* Wrap around vertically when reaching canvas boundaries */
        this.position.y = this.position.y >= canvas.height ? 0 : (this.position.y + this.height <= 0 ? canvas.height - 1 : this.position.y);
        
        /* Handle collision with the obstacles */
        if (this.checkCollisionWithWholeobstacles(obstacles)) {
            this.position.y = previousPosition.y;
            this.movementVelocity.y = this.jumpVelocity.y = 0;
            this.knockbackVelocity.y *= -1;

            if (this.checkIsGrounded(obstacles)) {
                this.availableJumps = 2;
                this.isOnGround = true;
                this.jumpVelocity.x = 0;
            } else {
                this.isOnGround = false;
            }
        } else {
            this.isOnGround = !this.checkIsGrounded(obstacles);
            this.movementVelocity.y += (!this.canWallJump ? gravity : gravity * wallSlideFriction);
            this.movementVelocity.y = Math.min(this.movementVelocity.y, this.maxGravityVelocity);
        }

        this.jumpVelocity.x *= 0.96; // TODO: Find out what this is and why

        /* Set horizontal velocity from walljumps to zero if it's below the acceleration threshold */
        this.jumpVelocity.x = (Math.abs(this.jumpVelocity.x) < 0.5) ? 0 : this.jumpVelocity.x;
    }
    // Draw the character's hitbox
    drawHitbox() {
        for (let i = 0; i < this.hitboxes.length; i++) {
            this.hitboxes[i].draw();
        }
    }
    // Handle the character's attack
    attack(attackType) {
        this.isAttacking = true;
        this.currentAttack = attackType
        setTimeout(() => {
            this.currentAttack = '';
        }, 100);
    }
    // Handle jumping logic
    jump() {
        // Initiate jump action
        this.movementVelocity.y = -9;
        keyPressed[keys.jump] = false;
        this.availableJumps--;

        // Check for wall jump
        if (this.canWallJump) {
            console.log(this.againstWall); // TODO: find out why 'againstWall' is 0
            this.isWallJumping = true;
            this.jumpVelocity.x = this.againstWall * wallJumpXForce;
        }
    }
    // Send coordinate info to Console
    logCoords() {
        console.log("X: {0} Y:{1}", this.position.x, this.position.y)
        console.log("PrintX: {0} PrintY:{1}", (this.position.x - this.animationData.offset.x * this.pixelMultiplier), (this.position.y - this.animationData.offset.y * this.pixelMultiplier))
        console.log("Weird: {0}", (canvas.width-this.position.x));
    }
    // Check for collision between hitbox and obstacles elements
    checkCollisionWithWholeobstacles(obstaclesArray) {
        return obstaclesArray.some(element => this.hitboxes[0].collidesWith(element));
    }
    // Check for collision between hitbox and obstaclesArray elements
    checkIsGrounded(obstaclesArray) {
        return obstaclesArray.some(element => this.hitboxes[1].collidesWith(element));
    }
    // Player standing close to any wall
    isAgainstAnyWall(obstaclesArray) {
        var detectedCollision = false;
        for (let i = 0; i < obstaclesArray.length && detectedCollision == false; i++) {
            detectedCollision |= this.isAgainstWall(obstaclesArray[i]);
        }

        return detectedCollision;
    }
    // Player standing close to a certain wall
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

class Obstacle {
    constructor({
        position = { x: 0, y: 0 },
        pixelMultiplier = 4,
        dropThrough = false,
        height = 10,
        width = 40,
    }) {

        this.position = position,
        this.pixelMultiplier = pixelMultiplier,
        this.width = width*pixelMultiplier,
        this.height = height*pixelMultiplier

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
        // this.drawHitbox();
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
    // Draw the hitbox
    draw () {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.globalAlpha = 1
    }
    // Check for collision with another hitbox
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

class AnimationSprite {
    constructor({
        imageSrc,
        numberOfFrames = 1,
        offset = { x: 0, y: 0 },
        framesHold = 10,
        width = -1
    }) {
        this.numberOfFrames = numberOfFrames;
        this.offset = offset;
        this.framesHold = framesHold;
        this.readSrc = imageSrc;
        
        this.image = new Image();
        this.image.src = this.readSrc;
        this.width = width > 0 ? width : this.image.width;
    }
}

class Camera {
    constructor({
        position = { x: 0, y: 0 },
        pixelMultiplier = 4,
        width = canvas.width,
        height = canvas.height,
        zoom = 1
    }) {
        this.position = position;
        this.centerPosition = { x: canvas.width / 2, y: canvas.height / 2 };
        this.pixelMultiplier = pixelMultiplier;
        this.width  = width  /4;
        this.height = height /4;
        this.zoom = zoom;
    }
    // Update the camera's position
    update() {
        this.updatePosition(players);
        this.draw();
    }

    draw() {
        // Print center as circle
        ctx.beginPath();
        ctx.arc(this.centerPosition.x, this.centerPosition.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
        // Print border as rectangle
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width/this.zoom, this.height/this.zoom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }

    updatePosition(players) {
        let x = 0;
        let y = 0;

        players.forEach(player => {
            x += player.position.x + player.width / 2;
            y += player.position.y + player.height / 2;
        });

        x /= players.length;
        y /= players.length;

        this.fixOutOfMapBorder(x, y);
        
        this.resizeFix(players);
    }

    // Fix the camera's zoom level
    resizeFix(players) {
        let distX = 0;
        let distY = 0;
        players.forEach(player => {
            let relevantPlayerPos = {
                x: player.position.x + player.width / 2,
                y: player.position.y + player.height / 2
            };

            let distX = Math.abs(relevantPlayerPos.x - this.centerPosition.x) - this.width / this.zoom / 2;
            let distY = Math.abs(relevantPlayerPos.y - this.centerPosition.y) - this.height / this.zoom / 2;

            if (distX > 0 || distY > 0) {
                let scaleX = distX / (this.width / this.zoom);
                let scaleY = distY / (this.height / this.zoom);
                let scale = Math.max(scaleX, scaleY);
                this.zoom /= 1 + scale;
            }
        });

        // Limit the zoom level
        if (this.zoom < minCameraZoomLevel) {
            this.zoom = minCameraZoomLevel;
        } else if (this.zoom > maxCameraZoomLevel) {
            this.zoom = maxCameraZoomLevel;
        }
    }

    fixOutOfMapBorder(x, y) {
        if (x-(this.width/this.zoom)/2 < 0) {
            this.position.x = 0;
        }
        else if (x+(this.width/this.zoom)/2 > canvas.width) {
            this.position.x = canvas.width - this.width/this.zoom;
        }
        else {
            this.position.x = x - (this.width/this.zoom)/2;
        }

        this.centerPosition.x = this.position.x + (this.width/this.zoom)  / 2;

        if (y-(this.height/this.zoom)/2 < 0) {
            this.position.y = 0;
        }
        else if (y+(this.height/this.zoom)/2 > canvas.height) {
            this.position.y = canvas.height - this.height/this.zoom;
        }
        else {
            this.position.y = y - (this.height/this.zoom)/2;
        }

        this.centerPosition.y = this.position.y + (this.height/this.zoom) / 2;

    }
}