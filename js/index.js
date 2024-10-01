// JavaScript for toggling between dark and light modes
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');

    const themeIcon = document.querySelector('#theme-toggle img');
    const themeToggle = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark')) {
        themeToggle.style.backgroundColor = '#3F3F3F';
        themeIcon.src = 'assets/images/UI/light-mode.png';
        themeIcon.alt = 'Light Mode';
    } else {
        themeToggle.style.backgroundColor = '#3F3F3F';
        themeIcon.src = 'assets/images/UI/dark-mode.png';
        themeIcon.alt = 'Dark Mode';
    }
});

// Fetch configuration and update UI based on it
fetch('config.json')
  .then(response => response.json())
  .then(config => {
    const projects = config.projects;

    // Handle Location-based WebAR
    const locationBasedContainer = document.getElementById('locationBasedAR');
    const locationBasedText = document.getElementById('locationText');
    if (!projects.locationBasedAR.enabled) {
        locationBasedContainer.classList.add('disabled');
        locationBasedText.textContent = 'Disabled';
    }

    // Handle Target-based WebAR
    const targetBasedContainer = document.getElementById('targetBasedAR');
    const targetBasedText = document.getElementById('targetText');
    if (!projects.targetBasedAR.enabled) {
        targetBasedContainer.classList.add('disabled');
        targetBasedText.textContent = 'Disabled';
    }
  })
  .catch(error => {
    console.error('Error fetching config:', error);
  });
