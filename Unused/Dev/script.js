document.getElementById('percentage').addEventListener('click', function() {
    document.getElementById('percentage').addEventListener('click', function() {
        var randomPercentage = Math.floor(Math.random() * 1000); // Generates random value between 0 and 999
        this.textContent = randomPercentage + '%';
      
        var color;
        if (randomPercentage <= 20) {
          color = 'white';
        } else if (randomPercentage <= 80) {
          color = 'yellow';
        } else if (randomPercentage <= 150) {
          color = 'red';
        } else {
          color = '#6b0000'; // Dark red
        }
      
        this.style.color = color;
      });
      
  });
  