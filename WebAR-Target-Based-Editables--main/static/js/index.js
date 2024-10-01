// Fetch the config file to dynamically load the GLTF models
// Fetch the config file
fetch('../config.json')
  .then(response => response.json())
  .then(config => {
    const models = config.gltfModels;
    const targetCount = config.targetCount;

    const scene = document.querySelector('a-scene'); // Assuming a-scene is already in your HTML

    // Create the <a-entity> tags for each target index
    for (let i = 0; i < targetCount; i++) {
      const entity = document.createElement('a-entity');
      entity.setAttribute('mindar-image-target', `targetIndex: ${i}`);
      
      // Find the model assigned to this target index
      const model = models.find(model => model.targetIndex === i);
      
      if (model) {
        const gltfModel = document.createElement('a-gltf-model');
        gltfModel.setAttribute('src', `#${model.id}`);
        entity.appendChild(gltfModel);
      }
      
      scene.appendChild(entity);
    }

    // Dynamically create <a-asset-item> elements for GLTF models
    const assetsContainer = document.getElementById('gltf-assets-container');
    models.forEach(model => {
      const assetItem = document.createElement('a-asset-item');
      assetItem.setAttribute('id', model.id);
      assetItem.setAttribute('src', model.src);
      assetsContainer.appendChild(assetItem);
    });
  })
  .catch(error => {
    console.error('Error loading config:', error);
  });


document.addEventListener("DOMContentLoaded", function () {
  // Check Camera location
  const cameraEl = document.querySelector('a-camera'); // Get the camera entity
  const cameraPosition = cameraEl.object3D.position; // Get the position vector of the camera
  console.log("Camera position from start of the scene:", cameraPosition);


  const sceneEl = document.querySelector("a-scene");
  let arSystem;

  // Listen for the loaded event of the A-Frame scene
  sceneEl.addEventListener("loaded", function () {
      // Access the MindAR system
      arSystem = sceneEl.systems["mindar-image-system"];
  });

  // Function to stop tracking
  function stopTracking() {
      if (arSystem) {
          // Call the stop method of the AR system
          arSystem.stop();
      }
  }

  // Function to restart tracking
  function restartTracking() {
      if (arSystem) {
          // Call the start method of the AR system
          arSystem.start();
      }
  }

  const video = document.getElementById('video');
  const listener = document.querySelector('[mindar-image-target="targetIndex: 1"]');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const UIoverlay = document.getElementById('UI-placement');

  // Initially, listen for the target being found
  listener.addEventListener('targetFound', onTargetFound);

    // Function to handle target found
  function onTargetFound() {
      playPauseBtn.style.display = 'block';
      cancelBtn.style.display = 'block';
      video.style.display = 'block';
      UIoverlay.style.display = 'none';
      arSystem.stop(); //stopping AR system from scanning multiple targets once video is loaded.
  }

  playPauseBtn.addEventListener('click', function() {
    if (video.paused) {
      video.play();
      playPauseBtn.textContent = 'Pause';
    } else {
      video.pause();
      playPauseBtn.textContent = 'Play';
    }
  });

  // Handle the cancel action
  cancelBtn.addEventListener('click', function() {
      // Hide the video and buttons
      playPauseBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      video.pause();
      playPauseBtn.textContent = 'Play';
      video.style.display = 'none';
      UIoverlay.style.display = 'flex';
      arSystem.start();
  });
  
});

  //Camera Tracking
  AFRAME.registerComponent('follow-camera-rotation', {
    tick: function (time, deltaTime) {
      // Track the number of frames
      this.frameCount = (this.frameCount || 0) + 1;

      // Update rotation every 24 frames (adjust as needed)
      if (this.frameCount % 24 === 0) {
        // Assuming 'this.el' is the entity you want to rotate to match the camera's rotation
        var cameraEl = document.querySelector('a-camera'); // Get the camera entity
        if (cameraEl) {
          // Copy the camera's quaternion to the entity
          this.el.object3D.quaternion.copy(cameraEl.object3D.quaternion);
        }
      }  
    }
  });  

screen.orientation.addEventListener("change", () => {
  // window.location.reload();
  arSystem.stop();
  arSystem.start();
});