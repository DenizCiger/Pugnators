// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Constants
const gravity = 0.2;
const wallSlideFriction = 0.05;
const wallJumpXForce = 10;
const keys = {
  left: 'a',
  right: 'd',
  jump: ' ',
  attackNormal: 'j'
};
const keyPressed = {};
let lastMoveKeyPressed;

const horizontalAcceleration = .8;
const airResistance = 1;
const groundFriction = .5;
const maxYMovementVelocity = 50;
const maxXMovementVelocity = 7;
const maxCameraZoomLevel = 2;
const minCameraZoomLevel = .25;
const gameSpeed = 60; // game loop refresh rate (pictures per second)

// Static variables
let playerInfoDisplays;
let playerIconDisplays;
let percentageDisplays;

let background;
let foreground;
let camera;

let obstacles;
let playerCharacters;
let players;

// Animation function
function animate() {
  updateAnimations();

  if (players[0].canMove) {
    if (keyPressed[keys.left] && lastMoveKeyPressed === keys.left) {
      players[0].movementVelocity.x -= horizontalAcceleration;
    } else if (keyPressed[keys.right] && lastMoveKeyPressed === keys.right) {
      players[0].movementVelocity.x += horizontalAcceleration;
    } else {
      if (players[0].checkIsGrounded(obstacles)) {
        // players[0].drawHitbox();
      }
      players[0].movementVelocity.x *= 1-(players[0].checkIsGrounded(obstacles) ? groundFriction : airResistance);
    }

    if (keyPressed[keys.jump] && players[0].availableJumps > 0) {
      players[0].jump();
    }
  }

  updatePercentageDisplays();

  setTimeout(() => {
    animate();
  }, gameSpeed/10);
}

// Setup functions
function setup() {
  setupDisplays();
  setupMisc();
  setupObstacles();
  setupPlayers();
  hideNonExistentPlayers();
  setupUserIcons();
  animate();
}

function setupDisplays() {
  playerInfoDisplays = getDisplayElements('playerInfo', 4);
  playerIconDisplays = getDisplayElements('icon', 4);
  percentageDisplays = getDisplayElements('percentage', 4);
}

function setupMisc() {
  background = new Sprite({
    printPosition: { x: 0, y: 0 },
    animationData: {
      imageSrc: './images/Game-Textures/Copy/Glacial-mountains/background_glacial_mountains_lightened.png',
      offset: { x: 0, y: 0 },
      numberOfFrames: 1,
    },
    scale: 1.25
  });

  foreground = new Sprite({
    printPosition: {
      x: canvas.width / 2 - 600, // Center the image horizontally
      y: 500
    },
    animationData: {
      imageSrc: './images/Game-Textures/Map/Mushroom_Sky/Mushroom_Platform.png',
      offset: { x: 0, y: 0 },
      numberOfFrames: 1,
    },
    scale: 1
  })

  camera = new Camera({
    position: { x: 0, y: 0 },
    zoom: 4
  });
}

function setupObstacles() {
  obstacles = [
    new Obstacle({
      position: {
        x: canvas.width / 2 - 600,
        y: canvas.height-(30*8)
      },
      height: 40,
      width: 315
    }),
  ];
}

function setupPlayers() {
  playerCharacters = ['Nerd', 'Snowy', 'LeondingChan', 'Troller'];
  // playerCharacters = ['Nerd', 'Troller'];
  // playerCharacters = ['Nerd'];

  players = playerCharacters.map((character, index) => {
    return new Fighter({
      characterType: character,
      position: spawnPositions[index],
      color: 'blue'
    });
  });
}

function setupUserIcons() {
  players.forEach((player, i) => {
    playerIconDisplays[i].src = characterData[playerCharacters[i]].find(a => a.actionName === 'info').logoSrc;
  });
}

// Event listeners
window.addEventListener('keydown', (event) => {
  if (Object.values(keys).includes(event.key)) {
    keyPressed[event.key] = true;

    if (event.key === keys.left || event.key === keys.right) {
      lastMoveKeyPressed = event.key;
    }
    if (event.key === keys.attackNormal && !players[0].isAttacking) {
      players[0].attack('nlight');
    }
  
  }
  if (event.key === 'r') {
    players.forEach(player => {
      player.die();
    });
  }
});

window.addEventListener('keyup', (event) => {
  if (Object.values(keys).includes(event.key)) {
    keyPressed[event.key] = false;
  }
});

// Startup
setup();
