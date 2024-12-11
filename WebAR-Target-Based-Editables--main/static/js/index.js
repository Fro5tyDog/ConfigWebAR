document.addEventListener("DOMContentLoaded", function () {
  // Fetch the config file to dynamically load the GLTF models
  fetch('../config/config.json')
    .then(response => response.json())
    .then(config => {
      const displaytypes = config.displaytypes;
      const targetCount = config.targetCount;
      const scene = document.querySelector('a-scene');
      const assetsContainer = document.getElementById('gltf-assets-container');
      let videos = null;
      let models = null;

      if (displaytypes.videos.enabled && displaytypes.models.enabled) {
        videos = config.videos;
        models = config.gltfModels;
      } else if (displaytypes.videos.enabled) {
        videos = config.videos;
      } else if (displaytypes.models.enabled) {
        models = config.gltfModels;
      }

      // Dynamically create <a-asset-item> elements for GLTF models and wait for them to load
      if (models != null) {
        let loadedModelsCount = 0;
        models.forEach(model => {
          const assetItem = document.createElement('a-asset-item');
          assetItem.setAttribute('id', model.id);
          assetItem.setAttribute('src', model.src);

          // Listen for asset-loaded event
          assetItem.addEventListener('loaded', () => {
            loadedModelsCount++;
            console.log(`${model.id} loaded successfully.`);

            // When all models are loaded, create the entities
            if (loadedModelsCount === models.length) {
              console.log('All models loaded. Creating entities...');
              createEntitiesForTargets(targetCount, models);
            }
          });

          assetsContainer.appendChild(assetItem);
        });
      } else {
        createEntitiesForTargets(targetCount, null); // Proceed if no models are specified
      }

      // Create video elements for each video in the config
      if (videos != null) {
        videos.forEach(videoConfig => {
          createVideo(videoConfig);
        });
      }
    })
    .catch(error => {
      console.error('Error loading config:', error);
    });

  // Function to create entities for each target index
  function createEntitiesForTargets(targetCount, models) {
    const scene = document.querySelector('a-scene');
    for (let i = 0; i < targetCount; i++) {
      const entity = document.createElement('a-entity');
      entity.setAttribute('mindar-image-target', `targetIndex: ${i};`);
      entity.classList.add(`target-index-${i}`);

      // Attach GLTF models to the entities
      if (models != null) {
        const model = models.find(model => model.targetIndex === i);
        if (model) {
          const gltfModel = document.createElement('a-gltf-model');
          gltfModel.setAttribute('src', `#${model.id}`);
          gltfModel.setAttribute('animation-mixer', '');
          entity.appendChild(gltfModel);
        }
      }

      // Add the entity to the scene
      scene.appendChild(entity);
    }
  }

  // Function to create and insert a video element dynamically
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
    document.body.appendChild(videoElement);

    const listener = document.querySelector(`.target-index-${videoConfig.targetIndex}`);
    if (listener) {
      listener.addEventListener('targetFound', () => onTargetFound(videoElement));
    } else {
      console.error(`Listener for targetIndex: ${videoConfig.targetIndex} not found`);
    }
  }

  // Function to handle target found, plays the video, shows the buttons, etc.
  function onTargetFound(videoElement) {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const UIoverlay = document.getElementById('UI-placement');

    playPauseBtn.style.display = 'block';
    cancelBtn.style.display = 'block';
    videoElement.style.display = 'block';
    UIoverlay.style.display = 'none';

    arSystem.stop();

    playPauseBtn.onclick = function () {
      if (videoElement.paused) {
        videoElement.play();
        playPauseBtn.textContent = 'Pause';
      } else {
        videoElement.pause();
        playPauseBtn.textContent = 'Play';
      }
    };

    cancelBtn.onclick = function () {
      playPauseBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      videoElement.pause();
      playPauseBtn.textContent = 'Play';
      videoElement.style.display = 'none';
      UIoverlay.style.display = 'flex';
      arSystem.start();
    };
  }

  const sceneEl = document.querySelector('a-scene');
  let arSystem;

  sceneEl.addEventListener("loaded", function () {
    arSystem = sceneEl.systems["mindar-image-system"];
  });

  AFRAME.registerComponent('follow-camera-rotation', {
    tick: function () {
      let cameraEl = document.querySelector('a-camera');
      if (cameraEl) {
        this.el.object3D.quaternion.copy(cameraEl.object3D.quaternion);
      }
    }
  });

  screen.orientation.addEventListener("change", () => {
    arSystem.stop();
    arSystem.start();
  });
});
