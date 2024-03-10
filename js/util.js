// Hide player info displays for non-active players
function hideNonExistentPlayers() {
  playerInfoDisplays.slice(players.length).forEach(display => {
    display.style.display = 'none';
  });
}

function updateAnimations() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backGround.update();
  middleGround.update();
  
  obstacles.forEach(obstacle => {
    obstacle.update();
  });
  players.forEach(player => {
    player.update();
  });
  foreGround.update();

  camera.update();
}

function updatePercentageDisplays() {
  players.forEach((player, i) => {
    percentageDisplays[i].textContent = `${player.percentage}%`;
    percentageDisplays[i].style.color = getColorForPercentage(player.percentage);
  });
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

function getDisplayElements(elementName, count) {
  return Array.from({ length: count }, (_, i) => 
        document.getElementById(`${elementName}${i + 1}`)
    );
}