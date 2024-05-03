// Player.js

import { animations } from './animations.js';

class Player {
  constructor(imageSrc, canvas, ctx) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.animations = animations;
    this.currentState = 'idle';
    this.startTime = 0;
    this.loop = true;
    this.horizontallyPaused = false;
    this.spriteWidth = 575;
    this.spriteHeight = 523;
    this.CANVAS_WIDTH = canvas.width;
    this.CANVAS_HEIGHT = canvas.height;
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = 100;
    this.y = 100;
    this.previousAnimation = null;
  }

  updateAnimation(animation) {
    this.currentState = animation;
    this.startTime = 0;
  }

  playOnce(animation, returnAnimation) {
    this.previousAnimation = this.currentState;
    this.updateAnimation(animation);

    setTimeout(() => {
      this.updateAnimation(returnAnimation);
    }, this.animations[animation].times.reduce((a, b) => a + b, 0));
  }

  animateLooping(players) {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    players.forEach(player => {
        if (player.loop) {
            let animationIndex = Object.keys(player.animations).indexOf(player.currentState);
            let animation = player.animations[player.currentState];
            let width = animation.width;
            let height = animation.height;

            // Assign a separate startTime for each player
            if (!player.startTime) {
                player.startTime = performance.now();
            }

            // Calculate elapsed time since animation started
            let elapsedTime = performance.now() - player.startTime;

            // Calculate the total duration of all frames
            let totalDuration = animation.times.reduce((a, b) => a + b, 0);

            // Normalize elapsed time to fit within the total duration
            elapsedTime = elapsedTime % totalDuration;

            // Calculate the position of the current frame based on elapsed time
            let cumulativeTime = 0;
            let position = 0;
            for (let i = 0; i < animation.frames; i++) {
                cumulativeTime += animation.times[i % animation.times.length];
                if (elapsedTime < cumulativeTime) {
                    position = i;
                    break;
                }
            }

            let frameX = width * position;
            let frameY = animationIndex * height;

            // Draw the player's sprite
            player.ctx.drawImage(player.image, frameX, frameY, width, height, player.x, player.y, width / 2, height / 2);
        } else {
            // Handle non-looping animations here, if needed
        }
    });

    // Schedule the next frame
    requestAnimationFrame(() => this.animateLooping(players));
  } 
  
  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

export { Player };
