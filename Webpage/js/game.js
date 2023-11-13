window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        mode: Phaser.Scale.Fit,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
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
    }
}