// automate this
// function addClickListeners(numElements) {
//     for (let i = 1; i <= numElements; i++) {
//       const tapImg = window['tapImg' + i];
//       const modelViewerId = 'modelViewer' + i;
//       console.log(i)

//       tapImg.addEventListener("click", () => {
//         document.getElementById(modelViewerId).activateAR();
//       });
//     }
//   }
//   // Usage with 10 elements
//   addClickListeners(2);

// Function to fetch the config.json file
async function fetchConfig() {
    try {
      const response = await fetch('../config.json');
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
  
  // Main function to load config and then initialize the app
  async function initializeApp() {
    const config = await fetchConfig();
    
    if (config) {
      loadThumbnails(config);
      addClickListeners(config);
    } else {
      console.error('Could not initialize app due to missing or invalid config.');
    }
  }
  
  // Run the initialization
  initializeApp();
  