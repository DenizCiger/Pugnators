class Sprite {
    constructor({ position, imageSrc}) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    } 

    update() {
        this.draw();
    }
}



class Fighter {
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
        this.percentage = Math.floor(Math.random() * 1000);;
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