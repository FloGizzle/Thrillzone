/*CUSTOM VARIABLES PER MAP VERSION*/

//layers used in this build
const _toilet = [];
const _info = [];
const _transit = [];
const _TZ = [];
const _EQ = [];
const _custom = [];
const _layers = [_toilet, _info, _transit, _TZ, _EQ, _custom];
const _layerName = ['tz', 'eq', 'info', 'food', 'toilet'];

//#region GEOJSON FOR MARKERS
const iconsize = [100, 100];
const GeoJSON = {
    type: 'geojson',
    features: [
        {
            type: 'feature',
            geometry: {
                type: 'point', //Type of feature (point/geometry)
                coordinates: [168.65823513386408, -45.032036049661855] //Location of point in [Lng,Lat]
            },
            properties: {
                title: 'Thrillzone Queenstown', //Title on slide up
                maptitle: 'Thrillzone', //Title on map
                website: 'https://www.thrillzone.co.nz/queenstown', //Website link
                phone: '+643 441 1159', //Phone number
                description: 'Adventure centre for indoor & outdoor activities including virtual reality gaming & escape rooms.', //Description in slide up
                markerimage: 'url(https://drive.google.com/uc?export=view&id=1PoiPId3yZogXE_aTl-wN4Gan61UxEgms)', //What the marker looks like
                layer: 'tz',
            }
        }
    ]
};

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
const textContainer = document.querySelector('.text');
const dirButton = document.querySelector('.direction');
const title = document.getElementById('title');
const website = document.getElementById('website');
const phone = document.getElementById('phone');
const description = document.getElementById('description');

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
//Token before: pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsczN3aTU1YzBrbnMyanFqY3d2a2pwdW0ifQ.HgnJMH6GCfnB4zagtanLSw

//Draw map on screen
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/thrillzonenz/clt5aqt2o00df01oie2kkg0ou',
    //style before: mapbox://styles/thrillzonenz/clsv5p0sa000a01pme4ibcux1
    center: startingCenter, // starting position [lng, lat]
    zoom: 4.25, // starting zoom
});

//Click functionallity for mapbox
map.on('click', (e) => {
    //Set click event to wanted layer
    const [selectedFeature] = map.queryRenderedFeatures(e.point, {
        layers: _layers
    });

    //if object is on layer do this
    if (selectedFeature)
        openSlideUp(selectedFeature, e.lngLat.lat, e.lngLat.lng);
    else {
        toggleSmall();
        if (initZoom) zoomInToQueenstown();
        closeSlideUp();
    }

})
//#endregion

//#region ADDING LAYERS TO MAP
//When the map is loaded add our layers on top
//Add markers to map
for (const marker of GeoJSON.features) {
    const el = document.createElement('div');

    el.className = 'marker';
    //console.log(marker.);
    el.style.backgroundImage = marker.properties.markerimage;
    el.style.width = '100px';
    el.style.height = '100px';
    el.style.backgroundSize = '100%';

    for (let index = 0; index < _layerName.length; index++) {
        if (marker.properties.markerimage === _layerName[index]) {
            _layers.add(marker);
            break;
        }
        console.log(index);
    }

    // Add markers to the map.
    new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

}
console.log(_TZ.length);

//#endregion

//#region SLIDE UP CONTROLS

//EVENTLISTENERS FOR SLIDE UP
slideClose.addEventListener('click', () => closeSlideUp());
dirButton.addEventListener('click', () => window.open(dirButton.href, "_blank"));

//Opens the slide up and updates all the data
function openSlideUp(data, lat, lng) {
    //Start pop up animation and centralizing to marker
    textContainer.scrollTo(0, 0);
    slideUp.classList.add('slidein');
    centralizeToMarker(lng, lat);
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
    if (data.layer !== undefined && data.layer.id === _toilet) dirButton.href = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '&travelmode=walking';
    else dirButton.href = 'https://www.google.com/maps/dir/?api=1&destination=' + data.properties.title + '&travelmode=walking';
}

//Fly to marker and centralize it
function centralizeToMarker(lng, lat) {
    let zoom = map.getZoom();
    lastCenter = [lng, lat];

    map.flyTo({
        center: [lng, lat],
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
    map.on('style.load', () => {

    });

    //Make sure it doesn't happen anymore
    initZoom = false;
});
//#endregion

//CALLS INITIALIZATION CODE
Init();