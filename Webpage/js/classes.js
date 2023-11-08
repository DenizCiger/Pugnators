class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.position = position;
        this.width = 64;
        this.height = 128;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.offset = offset;
    };

    update(){
        this.draw();
    };

    draw() {
        c.imageSmoothingEnabled = false;

        c.drawImage(       
            this.image,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.scale*this.image.width,
            this.scale*this.image.height
        );
    };
}