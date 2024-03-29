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
            numberOfFrames: 1,
            frameTime: [100]
        },
        height,
        width
    }) {
        this.printPosition = printPosition;
        this.pixelMultiplier = pixelMultiplier;
        this.scale = scale * this.pixelMultiplier;
        this.animationData = animationData;

        this.currentFrame = 0;
        this.elapsedMillies = 0;
        this.lastAnimationCall = null;
        
        this.image = new Image();
        this.image.src = this.animationData.imageSrc ? this.animationData.imageSrc : "./null.png";
        
        this.height = height;
        this.width = width;
        this.flipHorizontally = false;

    }

    setAnimationData({ animationSprite = null }) {
        this.currentFrame = 0;

        this.image = animationSprite.image;
        this.animationData.imageSrc = animationSprite.readSrc;
        this.animationData.offset = animationSprite.offset;
        this.animationData.frameTime = animationSprite.frameTime;
        // console.log(animationSprite);
        this.animationData.numberOfFrames = animationSprite.frameTime.length;
    }
    
    animateFrames() {
        if (!this.animationData.numberOfFrames) {
            this.animationData.numberOfFrames = 1;
        }

        if (!this.animationData.frameTime) {
            this.animationData.frameTime = [];

            for (let i = 0; i < this.animationData.numberOfFrames; i++) {
                this.animationData.frameTime.push(100);
            }
        }

        const currentTime = Date.now();

        if (this.lastAnimationCall !== null)
        {
            this.elapsedMillies += currentTime - this.lastAnimationCall;
        }

        while (this.elapsedMillies > this.animationData.frameTime[this.currentFrame]) {
            this.elapsedMillies -= this.animationData.frameTime[this.currentFrame];
            this.currentFrame = (this.currentFrame + 1) % this.animationData.numberOfFrames;
        }

        this.lastAnimationCall = Date.now();
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
        pixelMultiplier = 2,
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
        
        this.respawnPos = {
            x: this.position.x,
            y: this.position.y
        }
        this.isRespawning = false;
        this.canMove = false;

        this.hitboxes = [];
        this.againstWall = 0;
        this.load()
        this.setState('idle');
        this.spawn();
    }
    // Load the character's animations
    load() {
        var info = characterData[this.characterType]

        for (const [actionName, index] of Object.entries(actionIndexMap)) {
            const actionDetails = info.find(action => action.actionName === actionName);

            if (actionDetails) {
                this.animations[index] = new AnimationSprite ({
                                                                imageSrc: actionDetails.animationSrc ? actionDetails.animationSrc : "",
                                                                offset: actionDetails.offset         ? actionDetails.offset : { x: 0, y: 0 },
                                                                frameTime: actionDetails.frameTime   ? actionDetails.frameTime : [100],
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
            if (Math.abs(this.movementVelocity.y) <= gravity) { // Jumping has priority over running
                if (this.movementVelocity.x !== 0 && this.state !== 'running') { // Running has priority over idle
                    this.setState('running');
                } else if (this.movementVelocity.x === 0 && this.state !== 'idle') { // Idle has priority over running
                    this.setState('idle');
                }
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
        const previousPosition = {x: this.position.x, y: this.position.y};

        /* Limiting the horizontal movement velocity */
        this.movementVelocity.x = Math.max(-maxXMovementVelocity, Math.min(this.movementVelocity.x, maxXMovementVelocity));

        /* Set horizontal movement velocity to zero if it's below the acceleration threshold */
        this.movementVelocity.x = Math.abs(this.movementVelocity.x) < horizontalAcceleration ? 0 : this.movementVelocity.x;

        /* Calculating overall velocity to apply */
        this.fullVelocity.x = this.jumpVelocity.x + this.movementVelocity.x + this.knockbackVelocity.x;
        this.fullVelocity.y = this.jumpVelocity.y + this.movementVelocity.y + this.knockbackVelocity.y;

        /* Updating X-Position */
        this.position.x += this.fullVelocity.x;

        /* Kill player when going out of x-boundaries */
        if (this.position.x >= canvas.width || this.position.x + this.width <= 0) {
            this.die(previousPosition);
        }

        /* Handle collision with the obstacles */
        if (this.checkCollisionWithAllObstacles(obstacles)) {
            this.canWallJump = this.movementVelocity.y > gravity; // TODO: Find out why tf everything breaks when I move this???
            this.maxGravityVelocity = this.canWallJump ? maxYMovementVelocity * wallSlideFriction : maxYMovementVelocity;
            this.availableJumps = this.canWallJump ? 2 : 0;

            this.position.x = this.checkCollisionWithAllObstacles(obstacles) ? previousPosition.x : this.position.x;
            this.movementVelocity.x = this.jumpVelocity.x = 0;
            this.knockbackVelocity.x *= -this.checkCollisionWithAllObstacles(obstacles);
        }
        else {
            this.canWallJump = false;
            this.maxGravityVelocity = maxYMovementVelocity;
        }

        /* Updating Y-Position */
        this.position.y += this.fullVelocity.y;

        /* Kill player when going out of y-boundaries */
        if (this.position.y >= canvas.height || this.position.y + this.height <= 0) {
            this.die();
        }

        /* Handle collision with the obstacles */
        if (this.checkCollisionWithAllObstacles(obstacles)) {
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
    // Handle dying logic
    die() {
        this.percentage = 0;
        this.spawn();
    }
    // Handle spawning logic
    spawn() {
        this.jumpVelocity.x = 0;
        this.jumpVelocity.y = 0;
        this.movementVelocity.x = 0;
        this.movementVelocity.y = 0;
        this.knockbackVelocity.x = 0;
        this.knockbackVelocity.y = 0;
        this.position.x = this.respawnPos.x
        this.position.y = this.respawnPos.y
        this.availableJumps = 0;
        camera.zoom = maxCameraZoomLevel;
        
        this.isRespawning = true;
        this.canMove = false;
        setTimeout(() => {
            this.isRespawning = false;
            this.canMove = true;
        }, 500);
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
        this.setState('jumping');
        this.movementVelocity.y = -jumpForce;
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
    checkCollisionWithAllObstacles(obstaclesArray) {
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
        offset = { x: 0, y: 0 },
        frameTime = [100],
        width = -1
    }) {
        this.readSrc = imageSrc ? imageSrc : "./null.png";
        this.offset = offset;
        this.frameTime = frameTime;

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
        this.aspectRatio = this.width/this.height;
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

        this.centerPosition.x = x;
        this.centerPosition.y = y;
        this.position.x = x - (this.width/this.zoom)/2;
        this.position.y = y - (this.height/this.zoom)/2;
        
        this.resize(players);
    }

    // Fix the camera's zoom level
    resize(players) {
        let distances = [];

        players.forEach(player => {
            let distX = extraViewDistance.x + Math.abs((player.position.x + player.width / 2-this.centerPosition.x));
            let distY = ((extraViewDistance.y + Math.abs(player.position.y + player.width / 2)-this.centerPosition.y)) * this.aspectRatio; //needs some tweaking to look perfect

            distances.push(distX);
            distances.push(distY);
        });

        this.zoom = ((this.width/2)/(Math.max(...distances)));

        // Limit the zoom level
        if (this.zoom < minCameraZoomLevel) {
            this.zoom = minCameraZoomLevel;
        } else if (this.zoom > maxCameraZoomLevel) {
            this.zoom = maxCameraZoomLevel;
        }
    }
}