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
const horizontalSpeed = 4;
const maxYMovementVelocity = 50;

// Static variables
let playerInfoDisplays;
let playerIconDisplays;
let percentageDisplays;
let background;
let map;
let playerCharacters;
let players;

// Animation function
function animate() {
  updateAnimations();
  players[0].movementVelocity.x = 0;

  if (keyPressed[keys.left] && lastMoveKeyPressed === keys.left) {
    players[0].movementVelocity.x = -horizontalSpeed;
    players[0].direction = 180;
  } else if (keyPressed[keys.right] && lastMoveKeyPressed === keys.right) {
    players[0].movementVelocity.x = horizontalSpeed;
    players[0].direction = 0;
  }

  if (keyPressed[keys.jump] && players[0].availableJumps > 0) {
    players[0].jump();
  }

  updatePercentageDisplays();
}

// Setup functions
function setup() {
  setupDisplays();
  setupBackground();
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

function setupBackground() {
  background = new Sprite({
    position: { x: 0, y: 0 },
    animationData: { imageSrc: './images/Game-Textures/Copy/Glacial-mountains/background_glacial_mountains_lightened.png' },
    scale: 1.25
  });
}

function setupObstacles() {
  map = [
    new Obstacle({
      position: { x: 200, y: canvas.height-(30*4) },
      height: 30,
      width: (canvas.width-450)/4
    }),
    new Obstacle({
      position: { x: 800, y: 500 },
      height: 65,
      width: 20
    }),
    new Obstacle({
      position: { x: 1772, y: 0 },
      height: canvas.height/4,
      width: 10
    }),
  ];
}

function setupPlayers() {
  playerCharacters = ['Nerd', 'Snowy', 'LeondingChan', 'Troller'];
  // playerCharacters = ['Nerd'];

  players = playerCharacters.map((character, index) => {
    return new Fighter({
      characterType: character,
      position: { x: 200+index*500, y: 100 },
      color: getPlayerColor(index)
    });
  });
}

function setupUserIcons() {
  for (let i = 0; i < players.length; i++) {
    playerIconDisplays[i].src = characterData[playerCharacters[i]].find(a => a.actionName === 'info').logoSrc;
  }
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
    players[0].position = {x: 800, y: 100};
  }
});

window.addEventListener('keyup', (event) => {
  if (Object.values(keys).includes(event.key)) {
    keyPressed[event.key] = false;
  }
});

// Startup
setup();
