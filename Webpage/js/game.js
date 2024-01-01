// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Constants
const gravity = 0.2;
const keys = {
  left: 'a',
  right: 'd',
  jump: ' ',
  attackNormal: 'j'
};
const keyPressed = {};
let lastMoveKeyPressed;

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
    players[0].movementVelocity.x = -2;
    players[0].direction = 180;
  } else if (keyPressed[keys.right] && lastMoveKeyPressed === keys.right) {
    players[0].movementVelocity.x = 2;
    players[0].direction = 0;
  }

  if (keyPressed[keys.jump] && players[0].availableJumps > 0) {
    players[0].movementVelocity.y = -9;
    keyPressed[keys.jump] = false;
    players[0].availableJumps--;
  }

  updatePercentageDisplays();
}

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

function getDisplayElements(elementName, count) {
  return Array.from({ length: count }, (_, i) => document.getElementById(`${elementName}${i + 1}`));
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
      position: { x: 600, y: 600 },
      height: 30,
      width: 200
    })
  ];
}

function setupPlayers() {
  playerCharacters = ['Troller', 'Snowy', 'LeondingChan', 'Nerd'];

  players = playerCharacters.map((character, index) => {
    return new Fighter({
      characterType: character,
      position: { x: 200+index*500, y: 100 },
      color: getPlayerColor(index)
    });
  });
}

function getPlayerColor(index) {
  const colors = ['red', 'blue', 'green', 'yellow'];
  return colors[index] || 'white';
}

function hideNonExistentPlayers() {
  for (let i = players.length; i < playerInfoDisplays.length; i++) {
    playerInfoDisplays[i].style.display = 'none';
  }
}

function setupUserIcons() {
  for (let i = 0; i < players.length; i++) {
    playerIconDisplays[i].src = characterData[playerCharacters[i]].find(a => a.actionName === 'info').logoSrc;
  }
}

function updateAnimations() {
  window.requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.update();

  for (let i = 0; i < players.length; i++) {
    players[i].update();
  }

  for (let i = 0; i < map.length; i++) {
    map[i].update();
  }
}

function updatePercentageDisplays() {
  for (let i = 0; i < players.length; i++) {
    percentageDisplays[i].textContent = players[i].percentage + "%";
    percentageDisplays[i].style.color = getColorForPercentage(players[i].percentage);
  }
}

function getColorForPercentage(percentage) {
  switch (true) {
    case percentage >= 200:
      return '#5A0000'; // Dark red for percentages >= 200
    case percentage > 100:
      return '#CA0000'; // Red for percentages > 100
    case percentage > 70:
      return '#FFA500'; // Orange for percentages > 70
    case percentage > 35:
      return '#FFFF00'; // Yellow for percentages > 35
    default:
      return '#FFFFFF'; // White for percentages <= 35
  }
}

// Event listeners
window.addEventListener('keydown', (event) => {
  if (Object.values(keys).includes(event.key)) {
    keyPressed[event.key] = true;

    if (event.key === keys.left || event.key === keys.right) {
      lastMoveKeyPressed = event.key;
    }
    if (event.key === keys.attackNormal) {
      players[0].attack();
    }
  }
});

window.addEventListener('keyup', (event) => {
  if (Object.values(keys).includes(event.key)) {
    keyPressed[event.key] = false;
  }
});

// Startup
setup();
