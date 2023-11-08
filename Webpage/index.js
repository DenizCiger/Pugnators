const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1920;
canvas.height = 1080;

c.fillStyle = "#ccc";
c.fillRect(0,0,canvas.width, canvas.height);

const player = new Sprite({
    position:
    {
        x: 400,
        y: 100
    },
    imageSrc: './images/Game_Textures/Characters/Troller/Troller.png',
    scale: 3    
});

function animate() {
    window.requestAnimationFrame(animate);
    player.update();
}

animate()