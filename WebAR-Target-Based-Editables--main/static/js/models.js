// Function to fetch the config.json file
async function fetchConfig() {
    try {
      const response = await fetch('../get-config.php');
      const config = await response.json();
      return config;
    } catch (error) {
      console.error("Error fetching config.json:", error);
      return null;
    }
  }
  
// Dynamically add thumbnails to the HTML based on the fetched config
function loadThumbnails(config) {
const modelsDiv = document.getElementById('modelsDiv');
config.thumbnails.forEach((thumbnail, index) => {
    const imgElement = document.createElement('img');
    imgElement.style.width = '50%'; // Adjust width as needed
    imgElement.style.height = '50%'; // Adjust height as needed
    imgElement.id = `tapImg${index + 1}`; // Dynamically set ID
    imgElement.classList.add('tapImg');
    imgElement.src = thumbnail.imgSrc; // Set src from config

    // Append the dynamically created img tag to the modelsDiv
    modelsDiv.appendChild(imgElement);
});
}

// Automatically set the number of click listeners based on thumbnails
function addClickListeners(config) {
const numElements = config.thumbnails.length;
for (let i = 1; i <= numElements; i++) {
    const tapImg = document.getElementById(`tapImg${i}`);
    const modelViewerId = `modelViewer${i}`;

    if (tapImg) {
    tapImg.addEventListener("click", () => {
        document.getElementById(modelViewerId)?.activateAR();
    });
    }
}
}

// Function to dynamically add <model-viewer> elements based on the config
function loadModelViewers(config) {
    const bodyElement = document.body;
  
    config.modelViewer3DModels.forEach((model, index) => {
      const modelViewer = document.createElement('model-viewer');
      modelViewer.style.display = 'none'; // Default to hidden
      modelViewer.setAttribute('ar-placement', 'floor');
      modelViewer.setAttribute('ar', '');
      modelViewer.setAttribute('ar-modes', 'scene-viewer quick-look');
      modelViewer.setAttribute('reveal', 'manual');
      modelViewer.setAttribute('poster', model.poster); // Set from config
      modelViewer.id = `modelViewer${index + 1}`; // Dynamically set ID
      modelViewer.setAttribute('ar', '');
      modelViewer.setAttribute('camera-controls', '');
      modelViewer.setAttribute('touch-action', 'pan-y');
      modelViewer.setAttribute('src', model.src); // Set from config
      modelViewer.setAttribute('shadow-intensity', '1');
      modelViewer.setAttribute('alt', model.alt); // Set from config
  
      // Append the dynamically created model-viewer element to the body
      bodyElement.appendChild(modelViewer);
    });
  }
  
  // Update the initialization function to include model viewers loading
  async function initializeApp() {
    const config = await fetchConfig();
    
    if (config) {
      loadThumbnails(config);
      loadModelViewers(config); // Load the 3D models after thumbnails
      addClickListeners(config);
    } else {
      console.error('Could not initialize app due to missing or invalid config.');
    }
  }
  
// Run the initialization
initializeApp();
  
  