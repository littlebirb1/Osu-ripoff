// Feedback symbols (checkmark, triangle, X)

class FeedbackSymbol {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'checkmark', 'triangle', or 'cross'
    this.alpha = 255;
    this.fadeSpeed = 1.5;
    this.lifespan = 1500; // Show for 1.5 seconds
    this.birthTime = millis();
    this.size = 50;
  }

  update() {
    let elapsed = millis() - this.birthTime;
    if (elapsed > this.lifespan) {
      this.alpha -= this.fadeSpeed;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    strokeWeight(4);

    if (this.type === 'checkmark') {
      // Green checkmark
      stroke(0, 255, 0, this.alpha);
      noFill();
      beginShape();
      vertex(-15, 0);
      vertex(-5, 15);
      vertex(20, -15);
      endShape();
    } else if (this.type === 'triangle') {
      // Yellow triangle
      stroke(255, 255, 0, this.alpha);
      fill(255, 255, 0, this.alpha * 0.3);
      triangle(0, -20, -17, 15, 17, 15);
    } else if (this.type === 'cross') {
      // Red X
      stroke(255, 0, 0, this.alpha);
      line(-15, -15, 15, 15);
      line(-15, 15, 15, -15);
    }

    pop();
  }

  isDead() {
    return this.alpha <= 0;
  }
}
