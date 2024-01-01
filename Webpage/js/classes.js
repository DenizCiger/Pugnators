class Sprite {
    constructor({
        position = { x: 0, y:0 },
        scale = 1,
        pixelMultiplier = 4,
        animationData = { imageSrc: null, offset : { x: 0, y: 0}, numberOfFrames: 1 }
    }) {
        this.position = position;
        this.pixelMultiplier = pixelMultiplier;
        this.scale = scale * this.pixelMultiplier;
        this.animationData = animationData;

        this.currentFrame = 0;
        this.framesElapsed = 0;

        this.image = new Image();
        this.animationData = animationData;

        if (this.animationData.imageSrc) {
            this.setAnimationData({ imageSrc: this.animationData.imageSrc, offset: this.animationData.offset, numberOfFrames: this.animationData.numberOfFrames });
        }
    }

    setAnimationData({
        imageSrc,
        offset = { x: 0, y: 0 },
        numberOfFrames = 1
    }) {
        this.animationData.imageSrc = imageSrc;
        this.animationData.offset = offset;
        this.animationData.numberOfFrames = numberOfFrames

        this.image.onload = () => {
            // Now that the image has loaded, you can access its width and height
            console.log(this.image.width); // This should display the correct width
        };
    
        this.image.src = imageSrc;
    }
    
    draw() {
        if (this.animationData.imageSrc) {

            c.drawImage(
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
    } 

    update() {
        this.draw();
        this.framesElapsed++;

        if (this.framesElapsed % this.animationData.framesHold === 0) {         
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
        characterType,
        position = {x: 0, y: 0},
        movementVelocity = {x: 0, y: 0},
        color,
        pixelMultiplier = 4
    }) {
        
        super({
            position,
            pixelMultiplier
        });
        
        this.state = 'info';
        this.characterType = characterType;
        this.action = characterData[this.characterType].find(a => a.actionName === this.state);

        this.scale = this.action.scale * pixelMultiplier;
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
        
        this.setState('idle');
    }

    setState(newState) {
        this.state = newState;
        // Logic to update animation data based on the new state
        this.action = characterData[this.characterType].find(a => a.actionName === this.state);
        if (this.action) {
          this.setAnimationData({
            imageSrc: this.action.animationSrc,
            offset:   this.action.offset,
            numberOfFrames: this.action.numberOfFrames
          });
        }
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