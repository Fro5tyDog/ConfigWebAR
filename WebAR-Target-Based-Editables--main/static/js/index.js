document.addEventListener("DOMContentLoaded", function () {
// Fetch the config file to dynamically load the GLTF models
// Fetch the config file  
  fetch('../config/config.json')
    .then(response => response.json())
    .then(config => {
      const displaytypes = config.displaytypes;
      const targetCount = config.targetCount;
      const scene = document.querySelector('a-scene');
      const assetsContainer = document.getElementById('gltf-assets-container');
      let videos;
      let models;
      if(displaytypes.videos.enabled && displaytypes.models.enabled) {
        videos = config.videos;
        models = config.gltfModels;
      } else if (displaytypes.videos.enabled && !displaytypes.models.enabled) {
        videos = config.videos;
        models = null;
      } else if (!displaytypes.videos.enabled && displaytypes.models.enabled){
        videos = null;
        models = config.gltfModels;
      }
      
      // Step 2: Create the <a-entity> tags for each target index after assets are ready
      for (let i = 0; i < targetCount; i++) {
        console.log(models);
        console.log(videos);
        const entity = document.createElement('a-entity');
        entity.setAttribute('mindar-image-target', `targetIndex: ${i};`);
        entity.classList.add(`target-index-${i}`);

        if(models != null){
          // Step 1: Dynamically create <a-asset-item> elements for GLTF models
          models.forEach(model => {
            const assetItem = document.createElement('a-asset-item');
            assetItem.setAttribute('id', model.id);
            assetItem.setAttribute('src', model.src);
            assetsContainer.appendChild(assetItem);
          });

          // Find the model assigned to this target index
          const model = models.find(model => model.targetIndex === i);

          if (model) {
            const gltfModel = document.createElement('a-gltf-model');
            gltfModel.setAttribute('src', `#${model.id}`);
            gltfModel.setAttribute('animation-mixer', ''); //if you only want one animation to play, remove any unnecessary animations in the gltf itself.
          // gltfModel.setAttribute('scale', '0.05, 0.05, 0.05');  Try not to use this, rescale your models in a 3d design software like blender, this is here for debugging purposes because if you cannot see the model, it is either too big or too small. 
            entity.appendChild(gltfModel);
          }
        } 
        
        scene.appendChild(entity);
      }

      // Step 3: Create video elements for each video in the config
      if(videos != null){
        videos.forEach(videoConfig => {
          createVideo(videoConfig);
        });
      }
    })
    .catch(error => {
      console.error('Error loading config:', error);
  });

  // Check Camera location
  const cameraEl = document.querySelector('a-camera'); // Get the camera entity
  const cameraPosition = cameraEl.object3D.position; // Get the position vector of the camera
  console.log("Camera position from start of the scene:", cameraPosition);


  const sceneEl = document.querySelector("a-scenae");
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
  //Function to create and insert a video element dynamically
  function createVideo(videoConfig) {
    const videoElement = document.createElement('video');
    videoElement.setAttribute('id', videoConfig.id);
    videoElement.setAttribute('src', videoConfig.src);
    videoElement.setAttribute('controls', true);
    videoElement.setAttribute('loop', true);
    videoElement.setAttribute('webkit-playsinline', true);
    videoElement.setAttribute('playsinline', true);
    videoElement.style.display = 'none';
    videoElement.style.position = 'absolute';
    videoElement.style.top = '50%';
    videoElement.style.left = '50%';
    videoElement.style.transform = 'translate(-50%, -50%)';
    videoElement.setAttribute('width', '320');
    videoElement.setAttribute('height', '180');
    document.body.appendChild(videoElement); // Append to the body

    // const listener = document.querySelector(`[mindar-image-target="targetIndex: ${videoConfig.targetIndex}"]`);
    
    // Listen for the target being found
    // Use the class corresponding to the video target index to find the correct entity
    const listener = document.querySelector(`.target-index-${videoConfig.targetIndex}`);

    // Listen for the target being found
    if (listener) {
      listener.addEventListener('targetFound', () => onTargetFound(videoElement));
    } else {
      console.error(`Listener for targetIndex: ${videoConfig.targetIndex} not found`);
    }
  }


});

  // Function to handle target found, plays the video, shows the buttons, etc.
  function onTargetFound(videoElement) {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const UIoverlay = document.getElementById('UI-placement');

    // Show video and buttons
    playPauseBtn.style.display = 'block';
    cancelBtn.style.display = 'block';
    videoElement.style.display = 'block';
    UIoverlay.style.display = 'none';

    // Stop the AR system from scanning multiple targets
    arSystem.stop();

    // Attach event listeners for play/pause button (for this specific video)
    playPauseBtn.onclick = function() {
      if (videoElement.paused) {
        videoElement.play();
        playPauseBtn.textContent = 'Pause';
      } else {
        videoElement.pause();
        playPauseBtn.textContent = 'Play';
      }
    };

    // Handle the cancel action
    cancelBtn.onclick = function() {
      playPauseBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      videoElement.pause();
      playPauseBtn.textContent = 'Play';
      videoElement.style.display = 'none';
      UIoverlay.style.display = 'flex';
      arSystem.start();
    };
  } 

screen.orientation.addEventListener("change", () => {
  // window.location.reload();
  arSystem.stop();
  arSystem.start();
});



  