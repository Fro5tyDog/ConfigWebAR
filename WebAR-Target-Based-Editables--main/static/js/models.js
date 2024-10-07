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

// Dynamically add thumbnails to the HTML
function loadThumbnails() {
    const modelsDiv = document.getElementById('modelsDiv');
    config.thumbnails.forEach((thumbnail, index) => {
      const imgElement = document.createElement('img');
      imgElement.style.width = '50%'; // Adjust width as needed
      imgElement.id = `tapImg${index + 1}`; // Dynamically set ID
      imgElement.classList.add('tapImg');
      imgElement.src = thumbnail.imgSrc; // Set src from config
  
      // Append the dynamically created img tag to the modelsDiv
      modelsDiv.appendChild(imgElement);
    });
  }
  
  // Automatically set the number of click listeners based on thumbnails
  function addClickListeners() {
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
  
  // Execute the loading and event listeners
  loadThumbnails();
  addClickListeners();