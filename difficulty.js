// Difficulty system

let difficultySlider;
let difficultyLevel = 1; // 0 = Easy, 1 = Medium, 2 = Hard
let difficultyLabels = ['Easy', 'Medium', 'Hard'];

function setupDifficulty() {
  // Create difficulty slider - positioned below song display title
  difficultySlider = createSlider(0, 2, 1, 1); // min, max, default, step
  difficultySlider.size(200);
  difficultySlider.style('cursor', 'pointer');

  // Update difficulty level when slider changes
  difficultySlider.input(updateDifficultyLevel);
}

function repositionDifficultySlider() {
  if (difficultySlider) {
    difficultySlider.position(width / 2 - 100, height / 2 + 250);
  }
}

function updateDifficultyLevel() {
  difficultyLevel = difficultySlider.value();
}

function drawDifficultySelector() {
  // Draw difficulty level text
  fill(200);
  textSize(20);
  text(difficultyLabels[difficultyLevel], width / 2, height / 2 + 290);

  // Draw difficulty indicators
  drawDifficultyIndicators();
}

function drawDifficultyIndicators() {
  let spacing = 80;
  let startX = width / 2 - spacing;
  let y = height / 2 + 250;

  for (let i = 0; i < 3; i++) {
    let x = startX + (i * spacing);

    // Draw circle indicator
    if (i === difficultyLevel) {
      // Selected difficulty - filled circle
      fill(128, 0, 128);
      stroke(255);
      strokeWeight(3);
    } else {
      // Unselected - outline only
      noFill();
      stroke(150);
      strokeWeight(2);
    }
    circle(x, y, 20);

    // Draw label below circle
    noStroke();
    fill(i === difficultyLevel ? 255 : 150);
    textSize(14);
    text(difficultyLabels[i], x, y + 25);
  }
}

function getCircleCount() {
  // Return number of circles to spawn based on difficulty and spawn delay

  if (difficultyLevel === 0) {
    // Easy: More 1-2 circles, less 3, no 4
    if (currentSpawnDelay <= 1000) {
      // Short interval: 1-2 circles
      return floor(random(1, 3));
    } else {
      // Longer interval: 1-3 circles (weighted toward 1-2)
      let rand = random();
      if (rand < 0.6) return 1;      // 60% chance
      else if (rand < 0.9) return 2; // 30% chance
      else return 3;                  // 10% chance
    }
  }
  else if (difficultyLevel === 1) {
    // Medium: More 2-3 circles, some 4
    if (currentSpawnDelay <= 1000) {
      // Short interval: 1-2 circles
      return floor(random(1, 3));
    } else {
      // Longer interval: 2-4 circles (weighted toward 2-3)
      let rand = random();
      if (rand < 0.3) return 2;      // 30% chance
      else if (rand < 0.7) return 3; // 40% chance
      else return 4;                  // 30% chance
    }
  }
  else {
    // Hard: More 3-4 circles, less 1-2
    if (currentSpawnDelay <= 1000) {
      // Short interval: 2-3 circles
      return floor(random(2, 4));
    } else {
      // Longer interval: 3-4 circles (weighted toward 3-4)
      let rand = random();
      if (rand < 0.6) return 3;      // 60% chance
      else return 4;                  // 40% chance
    }
  }
}

function hideDifficultySlider() {
  difficultySlider.hide();
}

function showDifficultySlider() {
  difficultySlider.show();
}
