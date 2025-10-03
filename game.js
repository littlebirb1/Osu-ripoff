// Game state management and logic

// Game variables
let circles = [];
let circleGroups = []; // Track groups of circles spawned together
let symbols = []; // Track symbols (checkmark, triangle, X)
let lastSpawnTime = 0;
let nextSpawnDelay;
let currentSpawnDelay; // Track the current delay used
let score = 0; // Score tracker

function resetGame() {
  // Reset game state when starting new game
  circles = [];
  circleGroups = [];
  symbols = [];
  lastSpawnTime = millis();
  score = 0;
}

function updateGame() {
  // Check if music/video has ended
  if (uploadedMusic && !uploadedMusic.isPlaying() && uploadedMusic.currentTime() >= uploadedMusic.duration() - 0.1) {
    musicEnded();
  }
  if (uploadedVideo && uploadedVideo.elt.ended) {
    musicEnded();
  }

  // Check if it's time to spawn new circles
  if (millis() - lastSpawnTime > nextSpawnDelay) {
    currentSpawnDelay = nextSpawnDelay;
    spawnCircles();
    lastSpawnTime = millis();
    nextSpawnDelay = random(1000, 3000); // Set next spawn delay (1-3 seconds)
  }
}

function drawGameState() {
  // Draw video background if in video mode, otherwise draw black background
  if (isVideoMode && uploadedVideo) {
    drawVideoBackground();
  }

  // Draw lines between circles in each group
  drawCircleLines();

  // Update and display all circles
  updateAndDisplayCircles();

  // Check groups for completion and generate symbols
  evaluateCircleGroups();

  // Display and update symbols
  updateAndDisplaySymbols();

  // Display score at top right
  displayScore();
}

function drawCircleLines() {
  for (let group of circleGroups) {
    let activeCircles = group.filter(c => circles.includes(c));

    if (activeCircles.length > 1) {
      stroke(255, activeCircles[0].alpha); // White line with alpha matching circles
      strokeWeight(4);
      for (let i = 0; i < activeCircles.length - 1; i++) {
        line(activeCircles[i].x, activeCircles[i].y,
             activeCircles[i + 1].x, activeCircles[i + 1].y);
      }
    }
  }
}

function updateAndDisplayCircles() {
  for (let i = circles.length - 1; i >= 0; i--) {
    if (gameState === 'playing') {
      circles[i].update();
    }
    circles[i].display();

    // Remove circles that have disappeared (only when playing)
    if (gameState === 'playing' && circles[i].isDead()) {
      circles.splice(i, 1);
    }
  }
}

function evaluateCircleGroups() {
  for (let i = circleGroups.length - 1; i >= 0; i--) {
    let group = circleGroups[i];
    let activeCircles = group.filter(c => circles.includes(c));

    // If all circles in group are gone, check performance
    if (activeCircles.length === 0 && !group.evaluated) {
      group.evaluated = true;
      let totalCircles = group.length;
      let clickedCircles = group.filter(c => c.wasClicked).length;

      if (clickedCircles === totalCircles) {
        // All clicked - green checkmark (no score, already awarded on click)
        let lastClicked = group.filter(c => c.wasClicked).pop();
        if (lastClicked) {
          symbols.push(new FeedbackSymbol(lastClicked.x, lastClicked.y, 'checkmark'));
        }
      } else if (clickedCircles >= totalCircles / 2) {
        // Half or more clicked - yellow triangle (no score, already awarded on click)
        let lastClicked = group.filter(c => c.wasClicked).pop();
        if (lastClicked) {
          symbols.push(new FeedbackSymbol(lastClicked.x, lastClicked.y, 'triangle'));
        }
      } else if (clickedCircles === 0) {
        // None clicked - red X (-75 points)
        if (group.length > 0) {
          symbols.push(new FeedbackSymbol(group[0].x, group[0].y, 'cross'));
          score -= 75;
        }
      }
    }
  }

  // Clean up empty groups
  circleGroups = circleGroups.filter(group =>
    group.some(c => circles.includes(c))
  );
}

function updateAndDisplaySymbols() {
  for (let i = symbols.length - 1; i >= 0; i--) {
    symbols[i].update();
    symbols[i].display();

    if (symbols[i].isDead()) {
      symbols.splice(i, 1);
    }
  }
}

function displayScore() {
  fill(255);
  textSize(32);
  textAlign(RIGHT, TOP);
  text("Score: " + score, width - 20, 20);
}

function handleCircleClick() {
  if (gameState === 'menu' || gameState === 'paused' || gameState === 'gameover') return; // Don't process clicks in menu, pause, or game over

  // Find which group the clicked circle belongs to
  for (let group of circleGroups) {
    let activeCircles = group.filter(c => circles.includes(c));

    if (activeCircles.length === 0) continue;

    // Check if any circle in this group was clicked
    for (let i = activeCircles.length - 1; i >= 0; i--) {
      if (activeCircles[i].isClicked(mouseX, mouseY)) {
        // Check if this is the correct circle in the path order
        if (activeCircles[i] === group.clickOrder[group.currentClickIndex]) {
          // Correct order! Check timing for score
          activeCircles[i].wasClicked = true;

          if (activeCircles[i].isPerfectTiming()) {
            // Perfect timing - purple outline overlapping white outline
            score += 100;
          } else {
            // Good click but not perfect timing
            score += 50;
          }

          let index = circles.indexOf(activeCircles[i]);
          circles.splice(index, 1);
          group.currentClickIndex++;
          return;
        } else {
          // Wrong order! Show red X at clicked location (-75 points)
          symbols.push(new FeedbackSymbol(mouseX, mouseY, 'cross'));
          score -= 75;
          return;
        }
      }
    }
  }
}
