document.addEventListener("DOMContentLoaded", (event) => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('img');
  const contentContainer = document.querySelectorAll('.content-container');

  // Function to update colors based on theme
  const updateThemeColors = () => {
      if (document.body.classList.contains('dark')) {
          themeToggle.style.backgroundColor = '#3F3F3F';
          themeIcon.src = 'assets/images/UI/light-mode.png';
          themeIcon.alt = 'Light Mode';
          contentContainer.forEach(container => {
              container.style.backgroundColor = '#3F3F3F';
              container.style.color = 'white'; // Text color for dark mode
          });
      } else {
          themeToggle.style.backgroundColor = '#3F3F3F';
          themeIcon.src = 'assets/images/UI/dark-mode.png';
          themeIcon.alt = 'Dark Mode';
          contentContainer.forEach(container => {
              container.style.backgroundColor = '#FFFFFF';
              container.style.color = 'black'; // Text color for light mode
          });
      }
  };

  // Set theme based on user's preferred color scheme on first load
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark');
  } else {
      document.body.classList.add('light');
  }

  // Apply colors based on initial theme
  updateThemeColors();

  // Toggle theme on click
  themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark');
      document.body.classList.toggle('light');

      // Update colors when theme is toggled
      updateThemeColors();
  });

  // Fetch configuration and update UI based on it
  fetch('get-config.php')
      .then(response => response.json())
      .then(config => {
          const projects = config.projects;

          // Select the containers
          const locationBasedContainer = document.getElementById('locationBasedAR');
          const targetBasedContainer = document.getElementById('targetBasedAR');
          const errorContainer = document.getElementById('error');

          // Hide all containers initially
          locationBasedContainer.classList.add('hidden');
          targetBasedContainer.classList.add('hidden');
          errorContainer.classList.add('hidden');

          // Determine which container(s) to show
          if (projects.locationBasedAR.enabled && projects.targetBasedAR.enabled) {
              errorContainer.classList.remove('hidden');
              errorContainer.classList.add('active');
          } else if (projects.locationBasedAR.enabled) {
              locationBasedContainer.classList.remove('hidden');
              locationBasedContainer.classList.add('active');
          } else if (projects.targetBasedAR.enabled) {
              targetBasedContainer.classList.remove('hidden');
              targetBasedContainer.classList.add('active');
          } else {
              console.log('No AR project is enabled in the configuration.');
          }
      })
      .catch(error => {
          console.error('Error fetching config:', error);
      });
});
