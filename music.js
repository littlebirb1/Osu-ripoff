// Music and video functionality
let musicButton; // Reference to music button
let fileInput; // Reference to file input for audio/video upload
let uploadedMusic = null; // Store the uploaded audio file
let uploadedVideo = null; // Store the uploaded video file
let musicFileName = 'No music selected'; // Track uploaded file name
let isVideoMode = false; // Track if video is being used

function setupMusic() {
  // Create music button
  musicButton = createButton('MUSIC');
  musicButton.size(150, 60);
  styleButton(musicButton);
  musicButton.mousePressed(openMusicUpload);

  // Create hidden file input for audio/video upload
  fileInput = createFileInput(handleMusicUpload);
  fileInput.attribute('accept', 'audio/*,video/*');
  fileInput.hide();
}

function repositionMusicButton() {
  if (musicButton) {
    musicButton.position(width / 2 - 75, height / 2 + 130);
  }
}

function openMusicUpload() {
  // Trigger the hidden file input
  fileInput.elt.click();
}

function handleMusicUpload(file) {
  if (file.type === 'audio') {
    // Stop previous media if exists
    if (uploadedMusic) {
      uploadedMusic.stop();
    }
    if (uploadedVideo) {
      uploadedVideo.stop();
      uploadedVideo.hide();
    }

    // Load the new audio file
    isVideoMode = false;
    uploadedVideo = null;
    uploadedMusic = loadSound(file.data);
    musicFileName = file.name;

    // Set up callback for when music ends
    uploadedMusic.onended(musicEnded);
  } else if (file.type === 'video') {
    // Stop previous media if exists
    if (uploadedMusic) {
      uploadedMusic.stop();
    }
    if (uploadedVideo) {
      uploadedVideo.stop();
      uploadedVideo.hide();
    }

    // Load the new video file
    isVideoMode = true;
    uploadedMusic = null;
    uploadedVideo = createVideo(file.data, videoLoaded);
    uploadedVideo.hide(); // Hide the video element (we'll draw it manually)
    musicFileName = file.name;
  }
}

function videoLoaded() {
  // Set up callback for when video ends
  uploadedVideo.elt.onended = musicEnded;
}

function musicEnded() {
  // When music ends, transition to game over screen
  console.log('Music ended! Current state:', gameState);
  if (gameState === 'playing') {
    console.log('Transitioning to game over screen');
    gameState = 'gameover';
    retryButton.show();
    quitButton2.show();
    console.log('Buttons shown - Retry:', retryButton, 'Quit:', quitButton2);
  }
}

function startMusic() {
  // Start playing uploaded music/video if available
  if (uploadedMusic) {
    uploadedMusic.play();
  }
  if (uploadedVideo) {
    uploadedVideo.play(); // Changed from loop() to play() so it ends
  }

  // Generate initial circle when music starts
  if (uploadedMusic || uploadedVideo) {
    spawnInitialCircle();
  }
}

function pauseMusic() {
  // Pause music/video if playing
  if (uploadedMusic && uploadedMusic.isPlaying()) {
    uploadedMusic.pause();
  }
  if (uploadedVideo) {
    uploadedVideo.pause();
  }
}

function resumeMusic() {
  // Resume music/video if it was playing
  if (uploadedMusic && !uploadedMusic.isPlaying()) {
    uploadedMusic.play();
  }
  if (uploadedVideo) {
    uploadedVideo.play(); // Changed from loop() to play()
  }
}

function stopMusic() {
  // Stop music/video if playing
  if (uploadedMusic && uploadedMusic.isPlaying()) {
    uploadedMusic.stop();
  }
  if (uploadedVideo) {
    uploadedVideo.stop();
  }
}

function restartMusic() {
  // Restart music/video from beginning
  if (uploadedMusic) {
    uploadedMusic.stop();
    uploadedMusic.play();
  }
  if (uploadedVideo) {
    uploadedVideo.stop();
    uploadedVideo.play(); // Changed from loop() to play()
  }

  // Generate initial circle when music restarts
  if (uploadedMusic || uploadedVideo) {
    spawnInitialCircle();
  }
}

function drawMusicFileName() {
  // Display selected music file name
  textSize(20);
  fill(200);
  textAlign(CENTER, CENTER);
  text(musicFileName, width / 2, height / 2 + 220);
}

function drawVideoBackground() {
  // Draw video as background if in video mode
  if (isVideoMode && uploadedVideo) {
    push();
    // Calculate aspect ratio to cover canvas
    let videoAspect = uploadedVideo.width / uploadedVideo.height;
    let canvasAspect = width / height;
    let drawWidth, drawHeight, drawX, drawY;

    if (canvasAspect > videoAspect) {
      // Canvas is wider than video
      drawWidth = width;
      drawHeight = width / videoAspect;
      drawX = 0;
      drawY = (height - drawHeight) / 2;
    } else {
      // Canvas is taller than video
      drawHeight = height;
      drawWidth = height * videoAspect;
      drawX = (width - drawWidth) / 2;
      drawY = 0;
    }

    image(uploadedVideo, drawX, drawY, drawWidth, drawHeight);
    pop();
  }
}
