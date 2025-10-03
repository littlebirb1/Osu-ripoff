// Menu screen functionality
let gameState = 'menu'; // Track game state: 'menu', 'playing', 'paused', or 'gameover'
let startButton; // Reference to start button
let continueButton; // Reference to continue button
let quitButton; // Reference to quit button (for pause screen)
let quitButton2; // Reference to second quit button (for game over screen)
let retryButton; // Reference to retry button

function setupMenu() {
  // Create start button
  startButton = createButton('START');
  startButton.size(150, 60);
  styleButton(startButton);
  startButton.mousePressed(startGame);

  // Create continue button (hidden initially)
  continueButton = createButton('CONTINUE');
  continueButton.size(150, 60);
  styleButton(continueButton);
  continueButton.mousePressed(continueGame);
  continueButton.hide();

  // Create quit button (hidden initially) - for pause screen
  quitButton = createButton('QUIT');
  quitButton.size(150, 60);
  styleButton(quitButton);
  quitButton.mousePressed(quitToMenu);
  quitButton.hide();

  // Create retry button (hidden initially) - for game over screen (left side)
  retryButton = createButton('RETRY');
  retryButton.size(150, 60);
  styleButton(retryButton);
  retryButton.mousePressed(retryGame);
  retryButton.hide();

  // Create second quit button (hidden initially) - for game over screen (right side)
  quitButton2 = createButton('QUIT');
  quitButton2.size(150, 60);
  styleButton(quitButton2);
  quitButton2.mousePressed(quitToMenu);
  quitButton2.hide();

  // Setup music functionality
  setupMusic();

  // Setup difficulty selector
  setupDifficulty();

  // Position all buttons
  repositionButtons();
}

function repositionButtons() {
  // Reposition all buttons based on current canvas size
  startButton.position(width / 2 - 75, height / 2 + 50);
  continueButton.position(width / 2 - 75, height / 2);
  quitButton.position(width / 2 - 75, height / 2 + 80);
  retryButton.position(width / 2 - 170, height / 2 + 80);
  quitButton2.position(width / 2 + 20, height / 2 + 80);

  // Reposition music button
  repositionMusicButton();

  // Reposition difficulty slider
  repositionDifficultySlider();
}

function styleButton(button) {
  button.style('font-size', '24px');
  button.style('font-weight', 'bold');
  button.style('background-color', '#8000FF');
  button.style('color', '#FFFFFF');
  button.style('border', '3px solid #FFFFFF');
  button.style('border-radius', '10px');
  button.style('cursor', 'pointer');
}

function drawMenu() {
  // Draw logo - circle with white outline (uses selected color)
  let selectedColor = getSelectedColor();

  noFill();
  stroke(255);
  strokeWeight(6);
  circle(width / 2, height / 2 - 100, 200);

  fill(selectedColor.base.r, selectedColor.base.g, selectedColor.base.b);
  stroke(255);
  strokeWeight(4);
  circle(width / 2, height / 2 - 100, 180);

  // Draw title inside the circle
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(64);
  text('OSSU', width / 2, height / 2 - 100);

  // Draw clickable hint
  textSize(12);
  fill(200);
  text('(click to change color)', width / 2, height / 2 + 15);

  // Display selected music file name
  drawMusicFileName();

  // Display difficulty selector (below MUSIC button)
  drawDifficultySelector();

  // Draw customization modal if active
  drawCustomizationModal();
}

function startGame() {
  gameState = 'playing';
  startButton.hide();
  musicButton.hide();
  hideDifficultySlider();
  resetGame(); // Call game reset function from sketch.js

  // Start playing uploaded music if available
  startMusic();
}

function pauseGame() {
  gameState = 'paused';
  continueButton.show();
  quitButton.show();

  // Pause music if playing
  pauseMusic();
}

function continueGame() {
  gameState = 'playing';
  continueButton.hide();
  quitButton.hide();

  // Resume music if it was playing
  resumeMusic();
}

function quitToMenu() {
  gameState = 'menu';
  continueButton.hide();
  quitButton.hide();
  quitButton2.hide();
  retryButton.hide();
  startButton.show();
  musicButton.show();
  showDifficultySlider();

  // Stop music if playing
  stopMusic();

  resetGame(); // Reset game state
}

function retryGame() {
  gameState = 'playing';
  retryButton.hide();
  quitButton2.hide();
  resetGame(); // Reset game state

  // Restart music from beginning
  restartMusic();
}

function drawGameOverScreen() {
  // Semi-transparent overlay
  fill(0, 200);
  rect(0, 0, width, height);

  // Draw game over title
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  text('GAME OVER', width / 2, height / 2 - 100);

  // Display final score
  textSize(48);
  text('Total Score: ' + score, width / 2, height / 2);
}

function drawPauseScreen() {
  // Semi-transparent overlay
  fill(0, 150);
  rect(0, 0, width, height);

  // Draw pause title
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  text('PAUSED', width / 2, height / 2 - 100);
}
