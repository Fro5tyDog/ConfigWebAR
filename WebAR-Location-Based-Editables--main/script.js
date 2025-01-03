// Array of Objecst that stores all model information (This prevents having to fetch the JSON multiple times)
let modelsArray = [];

// 1. Render all the models. 
// 2. Create Drop down containers with all the models
// 3. Create Map 
// 4. Create the start up functionality. 
async function initializeMyApp(){

    // 1.
    await renderModels();
    
    // 2.
    await createDropdownContainer();

    // 3.
    await mapRenderImage();

    // 4.
    await createStartScreen();

}

// Step 1 --------------------------------
// Create models within a-frame
function renderModels(){
    return new Promise((resolve, reject) => {
        try{
            // Variables
            let scene = document.querySelector('a-scene');

            // fetch json to create models.
            fetch('./config/model_positions.json')
           .then(response => response.json())
           .then(data => {
                console.log('JSON loaded', data);
                createModels(data);
                renderModelVisibility();

                // resolve after models are created
                resolve(true);
            })
           .catch(error => {
                console.error('Error loading the JSON data:', error);
            });
  
            // Function to create each model from the json.
            function createModels(models){
                models.forEach(modelSeparated => {
                    let latitude = modelSeparated.location.lat;
                    let longitude = modelSeparated.location.lng;
                    let filePath = modelSeparated.filePath;
                    let visibilityRange = modelSeparated.visibilityRange;
                    let name = modelSeparated.name;

                    console.log(`Creating model for: ${name} at (${latitude}, ${longitude}) with visibility range [${visibilityRange.min}m - ${visibilityRange.max}m]`);    

                    // Create a new entity for each place
                    let model = document.createElement('a-entity');
                    model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    model.setAttribute('gltf-model', `${filePath}`);
                    model.setAttribute('rotation', '0 0 0');
                    model.setAttribute('animation-mixer', 'clip: *; loop: repeat; timeScale: 1.1; clampWhenFinished: true; crossFadeDuration: 0.3');
                    model.setAttribute('look-at', '[camera]');
                    model.setAttribute('scale', '0.15 0.15 0.15'); // Initial scale
                    model.setAttribute('visible', 'false'); // Start with visibility off doesn't work for some reason.
                    model.classList.add(`${name}`);
                    
                    // append to scene first before checking if it's loaded
                    scene.appendChild(model);

                    // Define an object with properties for each model
                    let modelObject = {
                        name: modelSeparated.name,
                        lat: modelSeparated.location.lat,
                        lng: modelSeparated.location.lng,
                        filePath: modelSeparated.filePath,
                        visibilityRange: modelSeparated.visibilityRange
                    };

                    // Push the object to the array
                    modelsArray.push(modelObject);
                })
            }
        } 
        catch(error){
            reject(new Error(`Error loading the JSON data: ${error.message}`));         
        }
    })
}

// Step 2 --------------------------------
// make models invisible 
function renderModelVisibility(){
    try{
        // Hide all models initially
        modelsArray.forEach(model => {
            console.log(model.name);
            const modelElement = document.querySelector(`.${model.name}`);
            console.log(modelElement);
            modelElement.object3D.visible = false;
            console.log(modelElement.getAttribute("visible"));
        });
    } 
    catch(error){
        reject(new Error(`Error rendering the models: ${error.message}`));         
    }
};

// Step 2 --------------------------------
// Create dropdown containers
// --- Variables
let dropdownVisible = false; // Toogle to hide and unhide dropdown containers
let selectedIcon = null; // Track the currently selected icon

function createDropdownContainer(){
    return new Promise((resolve, reject) => {
        
        try{
            const dropdownContainer = document.getElementById('dropdown-container'); // container housing all dropdown items
            const topLeftCircle = document.getElementById('top-left-circle'); // top left circle people click on to view more models.

            // Create the individual dropdown items
            createThumbnails(modelsArray);

            // Create the individual dropdown items.
            function createThumbnails(models){
                // Iterate over models and create thumbnails
                models.forEach(model => {
                    const thumbnail = document.createElement('div');
                    thumbnail.classList.add('dropdown-circle');
                    thumbnail.setAttribute('id', `${model.name}`);
                    // Create an image element for the model
                    const img = document.createElement('img');
                    img.src = `./assets/thumbnails/${model.name.toLowerCase()}.png`; // Assume icons follow model naming
                    img.alt = model.name;
                
                    // Append image to the circle
                    thumbnail.appendChild(img);

                    // apply all logic in separate function.
                    thumbnail.addEventListener('click', thumbnailClick)
                    // assign thumbnails to the container
                    dropdownContainer.appendChild(thumbnail);
                })
            }

            // handle visibility in another function. 
            topLeftCircle.addEventListener('click', modelDropDownVisibilityToggle);

            
            resolve(true);
        }
        catch(error){
            reject(new Error(`Error creating drop down thumbnails: ${error.message}`));         
        }
          
    });

}

// Functions for DOM dropdown buttons
function modelDropDownVisibilityToggle(){
    const dropdownContainer = document.getElementById('dropdown-container'); // container housing all dropdown items
    dropdownVisible =!dropdownVisible;
    dropdownContainer.style.display = dropdownVisible? 'flex' : 'none';
}

// click event for thumbnails
function thumbnailClick(event){
    const clickedIcon = event.currentTarget; // Get the clicked thumbnail
    if(clickedIcon === selectedIcon){
        console.log('Already selected!');
    }
    else {
        // deselect previous icon
        if (selectedIcon) {
            selectedIcon.classList.remove('selected');
        }
        //select new icon
        clickedIcon.classList.add('selected');
        selectedIcon = clickedIcon;
        console.log(`selected icon ${selectedIcon.id}`);
        selectNewModel(clickedIcon.id);
    }
}

// What happens when you select a new model
async function selectNewModel(name){

    const locationDisplay = document.getElementById('location-display');
    locationDisplay.innerHTML = `Locating ${name}`;
    // call function to select target
    selectedTarget(name);
}

// Step 3 --------------------------------
// Render the map
let mapHasBeenOpened = false;
function mapRenderImage(){
    return new Promise((resolve, reject) => {
        try{
            const mapIcon = document.getElementById('map-render-image');
            const mapContainer = document.getElementById('map-image-container');
            const topLeftCircle = document.getElementById('top-left-circle');
            const circleCenter = document.getElementById('circle-center');
            const dropdownCircles = document.querySelectorAll('.dropdown-circle');

            mapIcon.addEventListener('click', () => {
                if(!mapHasBeenOpened){
                    mapHasBeenOpened = true;
                    const map = document.createElement('img');
                    map.src = `./assets/map/map.png`; 
                    map.alt = 'map with all the targets';
                    map.classList.add('map-image');
                    mapContainer.appendChild(map);
                    // apply all logic in separate function.
                    map.addEventListener('click', mapContainerClick)
                    circleCenter.classList.add('blur');
                    topLeftCircle.classList.add('blur');
                    topLeftCircle.classList.add('disable-click');
                    dropdownCircles.forEach(circle => {
                        circle.classList.add('disable-click');
                        circle.classList.add('blur');
                    });
                    console.log(mapHasBeenOpened);
                } else{
                    while (mapContainer.hasChildNodes()) {
                        mapContainer.removeChild(mapContainer.firstChild);
                        circleCenter.classList.remove('blur');
                        topLeftCircle.classList.remove('blur');
                        topLeftCircle.classList.remove('disable-click');
                        dropdownCircles.forEach(circle => {
                            circle.classList.remove('disable-click');
                            circle.classList.remove('blur');
                        });
                        mapHasBeenOpened = false;
                    }
                }
                
            });

            resolve(true);
        }
        catch(error){
            reject(new Error(`Error opening the map: ${error.message}`));         
        }
    })
}

// Allow the user to close the map if they want to just press on the map.
function mapContainerClick() {
    console.log("clicked on map");
    const mapContainer = document.getElementById('map-image-container');
    const circleCenter = document.getElementById('circle-center');
    const topLeftCircle = document.getElementById('top-left-circle');
    const dropdownCircles = document.querySelectorAll('.dropdown-circle');

    while(mapContainer.hasChildNodes()){
        mapContainer.removeChild(mapContainer.firstChild);
        circleCenter.classList.remove('blur');
        topLeftCircle.classList.remove('blur');
        topLeftCircle.classList.remove('disable-click');
        dropdownCircles.forEach(circle => {
            circle.classList.remove('disable-click');
            circle.classList.remove('blur');
        });
        mapHasBeenOpened = false;
    }
    
}

// Step 4 --------------------------------
// Start Up Button
function createStartScreen(){
    return new Promise((resolve, reject) => {
        // adding greyed-out class to prevent person from clicking on icons
        document.querySelector('.circle-container').classList.add('greyed-out');
        document.getElementById('top-left-circle').classList.add('greyed-out');
        document.getElementById('top-right-circle').classList.add('greyed-out');
        document.querySelector('.circle-container').classList.add('blur');
        try{
            // Handle "Tap to Start" button click
            document.getElementById('start-button').addEventListener('click', startUp);
            resolve(true);
        } 
        catch(error){
            reject(new Error(`Error creating start screen: ${error.message}`));         

        }   
    })
}

// Removed Grey-out UI and starts the loops for finding player location and calculating relative position.
function startUp(){
    // Hide the start screen
    document.querySelector('.start').classList.add('hidden');
    // Remove the "greyed-out" class from other UI elements
    document.querySelector('.circle-container').classList.remove('greyed-out');
    document.getElementById('top-left-circle').classList.remove('greyed-out');
    document.getElementById('top-right-circle').classList.remove('greyed-out');
    document.querySelector('.circle-container').classList.remove('blur');

    const locationDisplay = document.getElementById('location-display');
    locationDisplay.innerHTML = 'Select a model to begin tracking!';

    console.log("START!");
}

// function to automatically select the target model. 

// Variables that are related to selected target. 
let targetName;
let distanceToTarget = 0;
let tooClose = false;
let tooFar = false;
let min;
let max;
let lat;
let lng;

const targetDetails = {
    targetName: targetName,
    distanceToTarget: distanceToTarget,
    tooClose: tooClose,
    tooFar: tooFar,
    min: min,
    max: max,
    lat: lat,
    lng: lng
};
// function to manually select the target model. (Updates the targetDetails)
function selectedTarget(name){
    try{
        // hide all previous models
        renderModelVisibility()
        console.log("selecting target...")
        modelsArray.forEach((model) => {
            if(model.name == name){
                targetDetails.targetName = model.name;
                targetDetails.min = model.visibilityRange.min;
                targetDetails.max = model.visibilityRange.max;
                targetDetails.lat = model.lat;
                targetDetails.lng = model.lng;
                appLoop();
            };
        })
    }
    catch(error){
        console.error('Error selecting target in selectedTarget:', error);
    }
}


// Application loop function that calls the retrieve player data and relative position. 
function appLoop() {
    // Retrieve player position and relative position to closest model.
    getPlayerPosition(findDistanceRelativeToModel);

    requestAnimationFrame(appLoop);
}

// function to retrieve player data every frame.
function getPlayerPosition(findDistanceRelativeToModel){
    try{
        // console.log("getting player position");
        if(navigator.geolocation){

        const options = {
            enableHighAccuracy: true,
            maximumAge: 0,
            };
            
            function success(pos) {
            const position = pos.coords;
            
            console.log("Your current position is:");
            console.log(`Latitude : ${position.latitude}`);
            console.log(`Longitude: ${position.longitude}`);
            console.log(`More or less ${position.accuracy} meters.`);

            const playerPos = {
                lat: position.latitude, 
                lng: position.longitude
            };
            current.latitude = playerPos.lat;
            current.longitude = playerPos.lng;
            
            console.log("Got player position");
            findDistanceRelativeToModel(playerPos, validateIfTooClose);
            }
            
            function error(err) {
            console.error(`ERROR(${err.code}): ${err.message}`);
            }

            navigator.geolocation.getCurrentPosition(success, error, options);
            
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    } 
    catch(error){
        console.error(error);
    }   
}


// function to retrieve player location relative to select model every frame. (Always called after player data is retrieved)
function findDistanceRelativeToModel(playerPos, validateIfTooClose) {
    try{   

        const target_lat = targetDetails.lat;
        const target_lng = targetDetails.lng;
        const player_lat = playerPos.lat;
        const player_lng = playerPos.lng;

        const disBetweenPlayerAndTarget = Number(calculateDistance(player_lat, player_lng, target_lat, target_lng));
            
        targetDetails.distanceToTarget = disBetweenPlayerAndTarget;    
        
        console.log("Found distance between player and target");
        validateIfTooClose(updateTextUIAndModelVisibility); 
    }
    catch(error){
        console.error(error);
    }   

}

// Function that consolidates if the player is too close to the target or not. 
function validateIfTooClose(updateTextUIAndModelVisibility){
    try {
        if(targetDetails.distanceToTarget >= targetDetails.min && targetDetails.distanceToTarget <= targetDetails.max){
            targetDetails.tooClose = false;
            targetDetails.tooFar = false;
        } else {
            if(targetDetails.distanceToTarget < targetDetails.min) {
                targetDetails.tooClose = true;
            } else{
                targetDetails.tooFar = true;
            }
        }
        console.log("Validated player distance to target");
        updateTextUIAndModelVisibility();
    }
    catch(error){
        console.error(error);
    }
}

// Function that updates the text UI and model visbility below the arrow 
function updateTextUIAndModelVisibility() {
    try{
        const locationDisplay = document.getElementById('location-display');

        // Get model entity in the scene
        const modelEntity = document.querySelector(`.${targetDetails.targetName}`);
        console.log(modelEntity);

        // Adjust visibility based on distance
        // This keeps all other models invisible because we disabled them from the start and only enable them here.
        if (!(targetDetails.tooClose && targetDetails.tooFar)) {
            modelEntity.object3D.visible = true;
        } else {
            modelEntity.object3D.visible = false;
        }

        // change text depending on distance between player and model
        if(targetDetails.tooClose == false && targetDetails.tooFar == false){
            locationDisplay.innerHTML = `${targetDetails.distanceToTarget.toFixed(1)}m to ${targetDetails.targetName}`;
        } else if (targetDetails.tooClose == true && targetDetails.tooFar == false) {
            locationDisplay.innerHTML = `Too close to ${targetDetails.targetName}!`;
        } else if (targetDetails.tooClose == false && targetDetails.tooFar == true) {
            locationDisplay.innerHTML = `Too far from ${targetDetails.targetName}: ${targetDetails.distanceToTarget.toFixed(1)}m away`;
        } else{
            locationDisplay.innerHTML = "No models found!";
        }
    } 
    catch(error){
        reject(new Error(`loading models: ${error.message}`));      
    }  
}

// Function to calculate the distance between two points in m.
function calculateDistance(lat1,lon1,lat2,lon2){
    try{
        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2-lat1);  // deg2rad below
        let dLon = deg2rad(lon2-lon1); 
        let a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        let d = R * c; // Distance in km
        return(d * 1000); // send distance in meters
        
        function deg2rad(deg) {
        return deg * (Math.PI/180)
        }
    }
    catch(error){
        console.error(error);
    }  
}

// Converts from degrees to radians.
function toRadians(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}


// ##################################################################################################
let current = { latitude: null, longitude: null };
let lastAlpha = 0;
let direction = 0;
// function to initialize geolocation and device orientation. runs automatically
function init() {
    // navigator.geolocation.watchPosition(setCurrentPosition, null, geolocationOptions);
    if (window.DeviceOrientationEvent) {
        window.addEventListener(
            "deviceorientation",
            (event) => {
                const rotateDegrees = event.alpha; // alpha: rotation around z-axis
                handleOrientationEvent(rotateDegrees);
            },
            true
        );
    }
}

// Pass the alpha (rotateDegrees) to runCalculation
const handleOrientationEvent = (rotateDegrees) => {
    // Call runCalculation with the fetched alpha value
    runCalculation(rotateDegrees);

};

// Update runCalculation to accept alpha as a parameter
function calcBearing(lat1, lon1, lat2, lon2) {
    // Convert all latitudes and longitudes from degrees to radians
    const φ1 = toRadians(lat1);
    const λ1 = toRadians(lon1);
    const φ2 = toRadians(lat2);
    const λ2 = toRadians(lon2);

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - 
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    const θ = Math.atan2(y, x);

    // Convert the angle from radians to degrees and normalize it to 0-360
    const bearing = (toDegrees(θ) + 360) % 360;
    return bearing;
}

function runCalculation(alpha) {


    const lat1 = current.latitude;
    const lon1 = current.longitude;
    const lat2 = targetDetails.lat;
    const lon2 = targetDetails.lng;
    const consoleText = document.getElementById('console-text');

    // Calculate the bearing to the target
    if(lat1 != null && lon1 != null && lat2 != null && lon2 != null){
        const bearing = calcBearing(lat1, lon1, lat2, lon2);
        // Calculate the direction by adjusting the bearing with the phone's orientation
    
        direction = (alpha - bearing) % 360;

        // Start the UI updates
        updateUI();
        // consoleText.innerHTML = `Bearing to target: ${bearing}°\nDevice orientation (alpha): ${alpha}°\nCalculated direction for arrow: ${direction}°\ncurrentLat: ${current.latitude}\ncurrentLongitude: ${current.longitude}`;
        consoleText.innerHTML = ``;
        direction.toFixed(0); // Round to the nearest degree
    } else {
        // keep this for player information.
        console.error("Cannot calculate direction to target because geolocation data is not available.");
    }
    
    

}

// starts updating the UI.
function updateUI() {
    // Update arrow rotation
    const arrow = document.querySelector(".arrow");
    arrow.style.transform = `translate(-50%, -50%) rotate(${direction}deg)`;
    requestAnimationFrame(updateUI);
}

// Initialize compass and location tracking when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    initializeMyApp();
    init();
});


