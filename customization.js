// Color customization system

let customizationActive = false;
let selectedColorIndex = 6; // Default to purple (index 6)

// Color palette with primary, secondary, and tertiary colors
let colorPalette = [
  { name: 'Red', base: { r: 255, g: 0, b: 0 }, light: { r: 255, g: 100, b: 100 } },
  { name: 'Orange', base: { r: 255, g: 165, b: 0 }, light: { r: 255, g: 200, b: 100 } },
  { name: 'Yellow', base: { r: 255, g: 255, b: 0 }, light: { r: 255, g: 255, b: 150 } },
  { name: 'Lime', base: { r: 128, g: 255, b: 0 }, light: { r: 180, g: 255, b: 100 } },
  { name: 'Green', base: { r: 0, g: 255, b: 0 }, light: { r: 100, g: 255, b: 100 } },
  { name: 'Cyan', base: { r: 0, g: 255, b: 255 }, light: { r: 100, g: 255, b: 255 } },
  { name: 'Purple', base: { r: 128, g: 0, b: 128 }, light: { r: 255, g: 105, b: 180 } },
  { name: 'Blue', base: { r: 0, g: 0, b: 255 }, light: { r: 100, g: 150, b: 255 } },
  { name: 'Magenta', base: { r: 255, g: 0, b: 255 }, light: { r: 255, g: 150, b: 255 } },
  { name: 'Pink', base: { r: 255, g: 105, b: 180 }, light: { r: 255, g: 182, b: 193 } },
  { name: 'Teal', base: { r: 0, g: 128, b: 128 }, light: { r: 100, g: 200, b: 200 } },
  { name: 'Indigo', base: { r: 75, g: 0, b: 130 }, light: { r: 150, g: 100, b: 200 } }
];

function openCustomization() {
  customizationActive = true;
}

function closeCustomization() {
  customizationActive = false;
}

function drawCustomizationModal() {
  if (!customizationActive) return;

  // Semi-transparent overlay
  fill(0, 180);
  rect(0, 0, width, height);

  // Modal background
  fill(40);
  stroke(255);
  strokeWeight(3);
  rectMode(CENTER);
  let modalWidth = 600;
  let modalHeight = 450;
  rect(width / 2, height / 2, modalWidth, modalHeight, 20);

  // Title
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(36);
  text('Choose Circle Color', width / 2, height / 2 - 180);

  // Draw color swatches
  drawColorSwatches();

  // Instructions
  textSize(18);
  fill(200);
  text('Click a color to select', width / 2, height / 2 + 180);

  // Close button hint
  textSize(16);
  text('Click outside to close', width / 2, height / 2 + 205);

  rectMode(CORNER);
}

function drawColorSwatches() {
  let cols = 4;
  let rows = 3;
  let swatchSize = 80;
  let spacing = 100;
  let startX = width / 2 - (cols * spacing) / 2 + spacing / 2;
  let startY = height / 2 - 100;

  for (let i = 0; i < colorPalette.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = startX + col * spacing;
    let y = startY + row * spacing;

    // Draw color swatch
    let c = colorPalette[i];

    // Highlight selected color
    if (i === selectedColorIndex) {
      stroke(255, 255, 0);
      strokeWeight(5);
    } else {
      stroke(255);
      strokeWeight(2);
    }

    fill(c.base.r, c.base.g, c.base.b);
    circle(x, y, swatchSize);

    // Color name
    noStroke();
    fill(255);
    textSize(14);
    text(c.name, x, y + swatchSize / 2 + 15);
  }
}

function handleCustomizationClick(mx, my) {
  if (!customizationActive) return false;

  // Check if clicked outside modal to close
  let modalWidth = 600;
  let modalHeight = 450;
  let modalLeft = width / 2 - modalWidth / 2;
  let modalRight = width / 2 + modalWidth / 2;
  let modalTop = height / 2 - modalHeight / 2;
  let modalBottom = height / 2 + modalHeight / 2;

  if (mx < modalLeft || mx > modalRight || my < modalTop || my > modalBottom) {
    closeCustomization();
    return true;
  }

  // Check if clicked on a color swatch
  let cols = 4;
  let swatchSize = 80;
  let spacing = 100;
  let startX = width / 2 - (cols * spacing) / 2 + spacing / 2;
  let startY = height / 2 - 100;

  for (let i = 0; i < colorPalette.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = startX + col * spacing;
    let y = startY + row * spacing;

    let d = dist(mx, my, x, y);
    if (d < swatchSize / 2) {
      selectedColorIndex = i;
      return true;
    }
  }

  return true; // Clicked inside modal but not on swatch
}

function getSelectedColor() {
  return colorPalette[selectedColorIndex];
}

function handleLogoClick(mx, my) {
  // Check if click is on OSSU logo (center circle)
  let logoX = width / 2;
  let logoY = height / 2 - 100;
  let logoRadius = 100;

  let d = dist(mx, my, logoX, logoY);
  if (d < logoRadius) {
    openCustomization();
    return true;
  }
  return false;
}
