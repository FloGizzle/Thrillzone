/*CUSTOM VARIABLES PER MAP VERSION*/

//layers used in this build

const _TZ = [];
const _EQ = [];
const _ent = [];
const _info = [];
const _food = [];
const _toilet = [];
const _transit = [];
const _custom = [];
const _layers = [_TZ, _EQ, _ent, _info, _food, _toilet, _transit, _custom];
const _layerName = ['tz', 'eq', 'ent', 'info', 'food', 'toilet', 'transit', 'custom'];

//#region GEOJSON FOR MARKERS
const iconsize = [100, 100];

/* example geojson
[
    {
    "type": "geojson",
    "features": [
            {
            "type": "feature",
            "geometry": {
                "type": "point", //Type of feature (point/geometry)
                "coordinates": [
                        168.65823513386408,
                        -45.032036049661855
                    ] //Location of point in [Lng,Lat]
                },
            "isVisible": true, //Is it currently rendrered
            "properties": {
                "title": "Thrillzone Queenstown", //Title on slide up
                "maptitle": "Thrillzone", //Title on map
                "website": "https://www.thrillzone.co.nz/queenstown", //Website link
                "phone": "+643 441 1159", //Phone number
                "description": "Adventure centre for indoor & outdoor activities including virtual reality gaming & escape rooms.", //Description in slide up
                "markerimage": "https://github.com/FloGizzle/Thrillzone/blob/main/Map/Icons/TZ.png?raw=true", //What the marker looks like
                "layer": "tz"
                }
            }
        ]
    }
]
*/

//#ENDREGION

//#region VARIABLES

//VARIABLES FOR MAP TO SET BOUNDS AND CENTER
const bounds = [
    [168.395199, -45.380678], // Southwest coordinates
    [168.771204, -44.774920] // Northeast coordinates
];
const zoomoutCenter = [168.66228038195243, -45.03483913752131];
const center = [168.65834407453838, -45.03205764496636];
const startingCenter = [173.21106573769924, -41.81657804512245];

//SLIDE UP VARIABLES
const slideClose = document.querySelector('.slideClose');
const slideUp = document.querySelector('.slideUp');
const slideUpContainer = document.querySelector('.slideUpContainer');
const textContainer = document.querySelector('.slider-content');
const dirButton = document.querySelector('.direction');
const title = document.getElementById('title');
const website = document.getElementById('website');
const phone = document.getElementById('phone');
const description = document.getElementById('description');
let isOpen = false;

//ZOOM ANIMATION VARIABLES
let lastCenter = center;
let lastZoom = 17;
let initZoom = true;

//VARIABLES DECIDING WHERE TOP MIDDLE OF SCREEN IS
const rect = document.getElementById('map').getBoundingClientRect();
const viewportX = rect.x;
const viewportY = rect.bottom;
const shiftScreenY = 0.25 * viewportY;
const shiftScreenX = 0.5 * viewportX;

//VARIABLES FOR INFO POP UP
const square = document.getElementById('square');
const content = document.getElementById('content');
const icon = document.getElementById('icon');
const closeButton = document.getElementById('closeButton');

const startText = "Kia Ora! \n Welcome to the beautiful country of Te Aotearoa (New Zealand) and the amazing town of Queenstown! \n ENTER MORE TEXT HERE";
const temptext = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

//#endregion

//#region MAP INITIALIZE

//Call in mapbox to load map
mapboxgl.accessToken = 'pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsczN3aTU1YzBrbnMyanFqY3d2a2pwdW0ifQ.HgnJMH6GCfnB4zagtanLSw';

//Draw map on screen
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/thrillzonenz/clt5aqt2o00df01oie2kkg0ou',
    center: startingCenter, // starting position [lng, lat]
    zoom: 4.25, // starting zoom
});

//Click functionallity for mapbox
map.on('click', () => {
    //Close pop ups if open
    toggleSmall();
    if (initZoom) zoomInToQueenstown();
    if (isOpen)closeSlideUp();
})

//#endregion

//#region ADDING LAYERS TO MAP
//When the map is loaded add our layers on top
//Add markers to map
function addLayers(GeoJSON) {
    for (const marker of GeoJSON[0].features) {
        const el = document.createElement('img');

        el.className = 'marker'+marker.properties.layer;
        el.src = marker.properties.markerimage;
        el.style.width = '50px';
        el.style.height = '50px';
        el.style.backgroundSize = '100%';
        el.style.display = 'none';

        for (let i = 0; i < _layerName.length; i++) {
            if (marker.properties.layer === _layerName[i]) {
                _layers[i].push(marker);
                break;
            }
        }

        // Add markers to the map.
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
        
        el.addEventListener('click', () =>{
            openSlideUp(marker);
            setTimeout(()=>{
                isOpen=true;
            }, 20);
        });
    }
}
//#endregion

//#region SLIDE UP CONTROLS

//EVENTLISTENERS FOR SLIDE UP
slideClose.addEventListener('click', () => closeSlideUp());
dirButton.addEventListener('click', () => window.open(dirButton.href, "_blank"));

//Opens the slide up and updates all the data
function openSlideUp(data) {
    if(!data.isVisible) return;
    //Start pop up animation and centralizing to marker
    textContainer.scrollTo(0, 0);
    slideUp.classList.add('slidein');
    const lnglat = data.geometry.coordinates;
    console.log(lnglat);
    centralizeToMarker(lnglat);
    toggleSmall();

    //Add data text from mapbox
    title.innerText = data.properties.title;
    if (data.properties.website != "") {
        website.href = data.properties.website;
        website.innerText = "Go to website";
    }
    else {
        website.href = "https://www.thrillzone.co.nz/queenstown";
        website.innerText = "No website available";
    }
    if (data.properties.phone != "") {
        phone.innerText = data.properties.phone;
    }
    else {
        phone.innerText = "No phone number available";
    }
    description.innerText = data.properties.description;
    if (data.layer !== undefined && data.layer.id === _toilet) dirButton.href = 'https://www.google.com/maps/dir/?api=1&destination=' + lnglat[1] + ',' + lnglat[0] + '&travelmode=walking';
    else dirButton.href = 'https://www.google.com/maps/dir/?api=1&destination=' + data.properties.title + '&travelmode=walking';
}

//Fly to marker and centralize it
function centralizeToMarker(lnglat) {
    let zoom = map.getZoom();
    lastCenter = [lnglat[0], lnglat[1]];

    map.flyTo({
        center: [lnglat[0], lnglat[1]],
        offset: [shiftScreenX, -shiftScreenY],
        speed: 0.8,
        curve: .6,
        zoom: 18
    });
}

//Closes slide up
function closeSlideUp() {
    //slide pop up out animation
    if (slideUp.classList.contains('slidein')) {
        slideUp.classList.remove('slidein');

        //zoom out to starting position
        map.flyTo({
            center: lastCenter,
            speed: 0.8,
            curve: .6,
            zoom: lastZoom
        });
    }
    isOpen = false;
}
//#endregion

//#region INFO POP UP

//EVENTLISTENERS FOR INFO POP UP
square.addEventListener('click', toggleBig);
closeButton.addEventListener('click', zoomInToQueenstown);
closeButton.addEventListener('click', toggleSmall);

//Changes the info button to a pop up with the data
function toggleBig() {
    //Check if it is already done
    if (square.classList.contains('centered')) return;

    closeSlideUp();
    square.classList.toggle('centered');
    setTimeout(() => {
        square.classList.toggle('big')
        content.innerText = temptext;
        content.style.display = 'block';
        icon.style.display = 'none';
    }, 250); // Delay should match the transition duration
}

//Changes the pop up back to the info button
function toggleSmall(event) {
    //Check if it is already done
    if (!square.classList.contains('centered')) return;
    //Check if there is a eventlistener that could cause problems
    if (event != null) event.stopPropagation();

    square.classList.remove('big');
    content.style.display = 'none';
    icon.style.display = 'block';
    setTimeout(() => {
        square.classList.remove('centered');
    }, 20);
}
//#endregion

//#region INITIALIZE

//Initializes the screen to have a pop up
function Init() {
    $.getJSON('https://FloGizzle.github.io/Thrillzone/Map/Data/Lylo.json', function( data ) {
        addLayers(data);
    });
    const navButtons = document.querySelectorAll('.navbar-item');
    for (let i = 0; i < navButtons.length; i++) {
        navButtons[i].addEventListener('click', ()=> openLayer(navButtons[i].id)); 
    }

    square.classList.toggle('centered');
    square.classList.toggle('big')
    content.innerText = startText;
    content.style.display = 'block';
    icon.style.display = 'none';

    map['scrollZoom'].disable();
    map['dragRotate'].disable();
    map['boxZoom'].disable();
    map['dragPan'].disable();
    map['touchZoomRotate'].disable();
}

//Zooms into queenstown when the pop up is closed
function zoomInToQueenstown() {
    map.flyTo({
        center: lastCenter,
        speed: 1,
        curve: 1.25,
        zoom: lastZoom
    });
    //Remove the eventlistener so it wont zoom in again
    closeButton.removeEventListener('click', zoomInToQueenstown);
}

//Checks when fly in animation is done
map.on('moveend', () => {
    //Only do it when it's the initial zoom
    if (initZoom === false) return;

    //Set bounds and activate controls
    map.setMaxBounds(bounds);
    map['scrollZoom'].enable();
    map['dragRotate'].enable();
    map['boxZoom'].enable();
    map['dragPan'].enable();
    map['touchZoomRotate'].enable();

    //Make sure it doesn't happen anymore
    initZoom = false;

    //Make layers visible
    for (let i = 0; i < _layers.length; i++) {
        if(_layers[i].length === 0) break;
        console.log("init "+document.querySelectorAll('img[class^="marker"]'));
        for (let el of document.querySelectorAll('img[class^="marker"]'))
        {
            el.style.display = 'block';
        }
    }
});
//#endregion



//#region NAVIGATION
function openLayer(id)
{
    let ids = id.split(" ");
let idDone = [];
let anyMatchesFound = false; // Flag to track if any matches were found

ids.forEach(function(id) {
    let matchesFoundForId = false; // Flag to track if any matches were found for the current ID

    for (let j = 0; j < _layers.length; j++) {
        if (_layers[j].length === 0) break;

        let elements = document.querySelectorAll(`img[class^="marker${id}"]`);

        elements.forEach(function(el) {
            if (id === _layerName[j]) {
                el.style.display = 'block';
                idDone.push(id);
                matchesFoundForId = true; // Set flag to true if any matches were found
                anyMatchesFound = true; // Set global flag to true if any matches were found for any ID
            } else {
                el.style.display = 'none';
            }
        });
    }

    // If no matches were found for the current ID, push it to idDone to keep track
    if (!matchesFoundForId) {
        idDone.push(id);
    }
});

// If no matches were found for any ID, hide all images
if (!anyMatchesFound) {
    document.querySelectorAll('img[class^="marker"]').forEach(function(el) {
        el.style.display = 'none';
    });
}

    
}
//#endregion

//CALLS INITIALIZATION CODE
Init();