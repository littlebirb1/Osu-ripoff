// Main sketch file - entry point for the game

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Set initial spawn delay (1-3 seconds in milliseconds)
  nextSpawnDelay = random(1000, 3000);

  // Setup menu from menu.js
  setupMenu();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reposition buttons when window is resized
  repositionButtons();
}

function draw() {
  background(0);

  if (gameState === 'menu') {
    drawMenu();
    return;
  }

  if (gameState === 'paused') {
    // Draw the game state frozen behind the pause screen
    drawGameState();
    drawPauseScreen();
    return;
  }

  if (gameState === 'gameover') {
    // Draw the game state frozen behind the game over screen
    drawGameState();
    drawGameOverScreen();
    return;
  }

  // Game is playing
  updateGame();
  drawGameState();
}

function keyPressed() {
  // Press ESC to pause/unpause
  if (keyCode === ESCAPE) {
    if (gameState === 'playing') {
      pauseGame();
    } else if (gameState === 'paused') {
      continueGame();
    }
    return false; // Prevent default behavior
  }

  // Press 'E' to test game over screen (for debugging)
  if (key === 'e' || key === 'E') {
    if (gameState === 'playing') {
      musicEnded();
    }
  }
}

function mousePressed() {
  // Handle customization modal clicks first
  if (gameState === 'menu') {
    if (customizationActive) {
      handleCustomizationClick(mouseX, mouseY);
      return;
    }
    // Check if logo was clicked
    if (handleLogoClick(mouseX, mouseY)) {
      return;
    }
  }

  // Handle circle clicks during gameplay
  handleCircleClick();
}
