// automate this
function addClickListeners(numElements) {
    for (let i = 1; i <= numElements; i++) {
      const tapImg = window['tapImg' + i];
      const modelViewerId = 'modelViewer' + i;
      console.log(i)

      tapImg.addEventListener("click", () => {
        document.getElementById(modelViewerId).activateAR();
      });
    }
  }
  // Usage with 10 elements
  addClickListeners(2);