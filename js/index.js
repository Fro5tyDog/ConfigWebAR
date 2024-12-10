document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('img');
    const body = document.body;
    const contentContainers = document.querySelectorAll('.content-container');
    const footer = document.getElementById('footer');

    // Function to update theme styles
    const updateThemeStyles = () => {
        if (body.classList.contains('dark')) {
            themeIcon.src = 'assets/images/UI/light-mode.png';
            themeIcon.alt = 'Light Mode';
            contentContainers.forEach(container => {
                container.style.backgroundColor = '#3a3a3a';
                container.style.color = 'white';
            });
            footer.style.backgroundColor = '#3a3a3a';
            footer.style.color = '#616161';
        } else {
            themeIcon.src = 'assets/images/UI/dark-mode.png';
            themeIcon.alt = 'Dark Mode';
            contentContainers.forEach(container => {
                container.style.backgroundColor = '#e4e4e4';
                container.style.color = '#000000';
            });
            footer.style.backgroundColor = '#e4e4e4';
            footer.style.color = '#000000';
        }
    };

    // Automatically set theme based on user preference
    const setInitialTheme = () => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark');
        } else {
            body.classList.add('light');
        }
        updateThemeStyles();
    };

    // Listen for changes in user preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            body.classList.add('dark');
            body.classList.remove('light');
        } else {
            body.classList.add('light');
            body.classList.remove('dark');
        }
        updateThemeStyles();
    });

    // Toggle light and dark mode manually
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        body.classList.toggle('light');
        updateThemeStyles();
    });

    // Fetch configuration and update UI based on it
    fetch('./config/config.json')
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

    // Initialize theme on load
    setInitialTheme();
});
