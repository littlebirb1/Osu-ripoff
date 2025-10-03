// Circle class and spawning functions

class Circle {
  constructor(x, y, size, pathIndex = 0) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.alpha = 255;
    this.fadeSpeed = 2; // Speed of fade out

    // First circle in path has faster timer, later circles have longer timers
    let baseLifespan = 1000; // Base time in ms
    let lifespanIncrease = 500; // Each subsequent circle gets +500ms
    this.lifespan = baseLifespan + (pathIndex * lifespanIncrease);

    this.birthTime = millis();
    this.maxOutlineSize = size * 3; // Start 3x bigger
    this.currentOutlineSize = this.maxOutlineSize;
    this.wasClicked = false; // Track if circle was clicked
    this.pathIndex = pathIndex; // Store path position

    // Initial color (use selected color from customization)
    let selectedColor = getSelectedColor();
    this.baseR = selectedColor.base.r;
    this.baseG = selectedColor.base.g;
    this.baseB = selectedColor.base.b;
    this.lightR = selectedColor.light.r;
    this.lightG = selectedColor.light.g;
    this.lightB = selectedColor.light.b;

    this.currentR = this.baseR;
    this.currentG = this.baseG;
    this.currentB = this.baseB;
  }

  update() {
    // Calculate progress through lifespan
    let elapsed = millis() - this.birthTime;
    let outlineShrinkTime = this.lifespan * 0.5; // Outline shrinks in half the lifespan
    let progress = elapsed / outlineShrinkTime;

    // Shrink outline from 3x to 1x faster
    this.currentOutlineSize = lerp(this.maxOutlineSize, this.size, constrain(progress, 0, 1));

    // Calculate color transition - change to lighter shade before disappearing
    let totalLife = this.lifespan + (255 / this.fadeSpeed) * (1000 / 60);
    let lifeProgress = elapsed / totalLife;

    // Transition from base color to light color
    this.currentR = lerp(this.baseR, this.lightR, constrain(lifeProgress, 0, 1));
    this.currentG = lerp(this.baseG, this.lightG, constrain(lifeProgress, 0, 1));
    this.currentB = lerp(this.baseB, this.lightB, constrain(lifeProgress, 0, 1));

    // Start fading after lifespan
    if (elapsed > this.lifespan) {
      this.alpha -= this.fadeSpeed;
    }
  }

  display() {
    // Draw colored outline ring that shrinks (transitions to lighter shade)
    noFill();
    stroke(this.currentR, this.currentG, this.currentB, this.alpha);
    strokeWeight(4);
    circle(this.x, this.y, this.currentOutlineSize);

    // Draw main circle (transitions from base to light color)
    fill(this.currentR, this.currentG, this.currentB, this.alpha);
    stroke(255, this.alpha); // White outline with alpha
    strokeWeight(4);
    circle(this.x, this.y, this.size);
  }

  isDead() {
    return this.alpha <= 0;
  }

  isClicked(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    return d < this.size / 2;
  }

  isPerfectTiming() {
    // Perfect timing is when purple outline overlaps with white outline (circle edge)
    // Purple outline starts at 3x size and shrinks to 1x (the circle size)
    // Perfect timing is when outline is within a small range of the circle size
    let tolerance = 10; // pixels of tolerance
    return abs(this.currentOutlineSize - this.size) <= tolerance;
  }
}

function spawnCircles() {
  // Get number of circles based on difficulty level
  let numCircles = getCircleCount();
  let newGroup = [];
  newGroup.clickOrder = []; // Track the order circles should be clicked
  newGroup.currentClickIndex = 0; // Track which circle should be clicked next

  for (let i = 0; i < numCircles; i++) {
    let x, y, size = 100;
    let validPosition = false;
    let attempts = 0;

    // Find a position that doesn't overlap with existing circles
    while (!validPosition && attempts < 100) {
      x = random(50 + size/2, width - 50 - size/2);
      y = random(50 + size/2, height - 50 - size/2);
      validPosition = true;

      // Check against all existing circles
      for (let circle of circles) {
        let d = dist(x, y, circle.x, circle.y);
        if (d < (size/2 + circle.size/2)) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    if (validPosition) {
      let newCircle = new Circle(x, y, size, i); // Pass index for timing
      circles.push(newCircle);
      newGroup.push(newCircle);
      newGroup.clickOrder.push(newCircle); // Add to click order as spawned
    }
  }

  if (newGroup.length > 0) {
    circleGroups.push(newGroup);
  }
}

function spawnInitialCircle() {
  // Spawn one circle at the start when music begins
  let x = width / 2;
  let y = height / 2;
  let size = 100;

  let newGroup = [];
  newGroup.clickOrder = [];
  newGroup.currentClickIndex = 0;

  let newCircle = new Circle(x, y, size, 0);
  circles.push(newCircle);
  newGroup.push(newCircle);
  newGroup.clickOrder.push(newCircle);

  circleGroups.push(newGroup);
}
