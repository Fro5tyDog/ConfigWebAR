document.addEventListener("DOMContentLoaded", (event) => {
  // JavaScript for toggling between dark and light modes
  document.getElementById('theme-toggle').addEventListener('click', function() {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');

  const themeIcon = document.querySelector('#theme-toggle img');
  const themeToggle = document.getElementById('theme-toggle');
  const contentContainer = document.querySelectorAll('.content-container');
    if (document.body.classList.contains('dark')) {
        themeToggle.style.backgroundColor = '#3F3F3F';
        themeIcon.src = 'assets/images/UI/light-mode.png';
        const containerArray = [...contentContainer];
        containerArray.forEach((container) =>{
          container.style.backgroundColor = '#3F3F3F';
        })
        themeIcon.alt = 'Light Mode';
    } else {
        themeToggle.style.backgroundColor = '#3F3F3F';
        themeIcon.src = 'assets/images/UI/dark-mode.png';
        const containerArray = [...contentContainer];
        containerArray.forEach((container) =>{
          container.style.backgroundColor = '#FFFFFF';
        })
        themeIcon.alt = 'Dark Mode';
    }
  });

  // Fetch configuration and update UI based on it
  fetch('config.json')
    .then(response => response.json())
    .then(config => {
      const projects = config.projects;

      // Select the containers
      const locationBasedContainer = document.getElementById('locationBasedAR');
      const targetBasedContainer = document.getElementById('targetBasedAR');
      const errorContainer = document.getElementById('error');

      // Hide all containers initially
      locationBasedContainer.style.display = 'none';
      targetBasedContainer.style.display = 'none';
      errorContainer.style.display = 'none';

      // Determine which container(s) to show
      if (projects.locationBasedAR.enabled && projects.targetBasedAR.enabled) {
        // Show error if both are enabled
        errorContainer.style.display = 'flex';
      } else if (projects.locationBasedAR.enabled) {
        // Show only Location-based AR
        locationBasedContainer.style.display = 'flex';
      } else if (projects.targetBasedAR.enabled) {
        // Show only Target-based AR
        targetBasedContainer.style.display = 'flex';
      } else {
        // Optionally handle the case where both are disabled
        console.log('No AR project is enabled in the configuration.');
      }
    })
    .catch(error => {
      console.error('Error fetching config:', error);
    });

});


