window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        mode: Phaser.Scale.Fit,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 192,
        height: 108,
        scene: {
            preload: preload,
            create: create
        }
    };
    
    const game = new Phaser.Game(config);

    function preload() {
        this.load.image('background', '/images/Game_Textures/Map/bg.png');
    }

    function create() {
        this.add.image('background').setOrigin(0).setDisplaySize(window.innerWidth, window.innerHeight);
        // Calculate the position for the centered rectangle
        const rectWidth = config.width / 2;
        const rectHeight = config.height / 2;
        const rectX = config.width / 2;
        const rectY = config.height - (rectHeight/2) - 100;

        // Create a rectangle and add it to the scene
        const rectangle = this.add.rectangle(rectX, rectY, rectWidth, rectHeight, 0x00ff00);
    }
}