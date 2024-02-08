function getPlayerColor(index) {
  const colors = ['red', 'blue', 'green', 'yellow'];
  return colors[index] || 'white';
}

function hideNonExistentPlayers() {
  for (let i = players.length; i < playerInfoDisplays.length; i++) {
    playerInfoDisplays[i].style.display = 'none';
  }
}

function updateAnimations() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.update();
  foreground.update();

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].update();
  }
  for (let i = 0; i < players.length; i++) {
    players[i].update();
  }

  camera.update();

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

function getDisplayElements(elementName, count) {
  return Array.from({ length: count }, (_, i) => document.getElementById(`${elementName}${i + 1}`));
}