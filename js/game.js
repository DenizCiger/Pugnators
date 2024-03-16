// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Constants
const gravity = 0.15;
const wallSlideFriction = 0.05;
const wallJumpXForce = 10;
const jumpForce = 6;
const keys = {
  left: 'a',
  right: 'd',
  jump: ' ',
  attackNormal: 'j'
};
const keyPressed = {};
let lastMoveKeyPressed;

const horizontalAcceleration = .4;
const airResistance = 1;
const groundFriction = .5;
const maxYMovementVelocity = 25;
const maxXMovementVelocity = 4;
const maxCameraZoomLevel = 1;
const minCameraZoomLevel = .25;
const extraViewDistance =  {
  x: 150,
  y: 200
};
const gameSpeed = 60; // game loop refresh rate (pictures per second)

// Static variables
let playerInfoDisplays;
let playerIconDisplays;
let percentageDisplays;

let backGround;
let middleGround;
let foreGround;
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
  backGround = [new Sprite({
    printPosition: { x: 0, y: 0 },
    animationData: {
      imageSrc: './images/Game-Textures/Copy/Glacial-mountains/background_glacial_mountains_lightened.png',
      offset: { x: 0, y: 0 },
      numberOfFrames: 1,
    },
    scale: 1.25
  })];

  middleGround = [new Sprite({
    printPosition: {
      x: 960 - 295,
      y: 500
    },
    animationData: {
      imageSrc: './images/Game-Textures/Map/Mushroom_Sky/Mushroom_Platform_Middleground.png',
      offset: { x: 0, y: 0 },
      numberOfFrames: 1,
    },
    scale: 1,
    pixelMultiplier: 2
  })];
  
  foreGround = [new Sprite({
    printPosition: {
      x: 960 - 295,
      y: 500
    },
    animationData: {
      imageSrc: './images/Game-Textures/Map/Mushroom_Sky/Mushroom_Platform_Foreground.png',
      offset: { x: 0, y: 0 },
      numberOfFrames: 1,
    },
    scale: 1,
    pixelMultiplier: 2
  })];

  camera = new Camera({
    position: { x: 0, y: 0 },
    zoom: maxCameraZoomLevel
  });
}

function setupObstacles() {
  obstacles = [
    new Obstacle({
      position: {
        x: 960 - 294,
        y: 590
      },
      height: 22,
      width: 155
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
    
    const logoSrc = characterData[playerCharacters[i]].find(a => a.actionName === 'info').logoSrc;

    checkImageExists(logoSrc).then((imageExists) => {
      const exists = imageExists && logoSrc.endsWith('.png');
      playerIconDisplays[i].src = exists ? logoSrc : './null.png';
    });
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
