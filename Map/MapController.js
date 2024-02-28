/*CUSTOM VARIABLES PER MAP VERSION*/

//layers used in this build
const layers = ['Info', 'Toilets', 'Thrillzone', 'Escapequest', 'Lylo-Food', 'BusStop'];


/*MAP CONTROLS*/

//VARIABLES FOR MAP TO SET BOUNDS AND CENTER
const bounds = [
    [168.395199, -45.380678], // Southwest coordinates
    [168.771204, -44.774920] // Northeast coordinates
];
const zoomoutCenter = [168.66228038195243, -45.03483913752131];
const center = [168.65834407453838, -45.03205764496636];
const startingCenter = [173.21106573769924, -41.81657804512245];

//Call in mapbox to load map
mapboxgl.accessToken = 'pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsczN3aTU1YzBrbnMyanFqY3d2a2pwdW0ifQ.HgnJMH6GCfnB4zagtanLSw';
//'pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsc2I4emc4azBkMXMybW82OXhzd3g4MGYifQ.JaafMSBBoA0Y2Wixn12PfQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/thrillzonenz/clsv5p0sa000a01pme4ibcux1',
    //'mapbox://styles/thrillzonenz/cls4hmg7c001c01pyhb5o506e', // style URL
    center: startingCenter, // starting position [lng, lat]
    zoom: 4.25, // starting zoom
});

//Click functionallity for mapbox
map.on('click', (e) => {
    //Set click event to wanted layer
    const [selectedFeature] = map.queryRenderedFeatures(e.point, {
        layers: layers
    });

    //if object is on layer do this
    if (selectedFeature)
        openSlideUp(selectedFeature, e.lngLat.lat, e.lngLat.lng);
    else {
        toggleSmall();
        closeSlideUp();
    }

})

/*SLIDE UP CONTROLS*/

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
const toiletLayer = 'Toilets';

//Zoom animation variables
let lastCenter = center;
let lastZoom = 17;


slideClose.addEventListener('click', () => closeSlideUp());
dirButton.addEventListener('click', () => window.open(dirButton.href, "_blank"));



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
    if (data.layer !== undefined && data.layer.id === toiletLayer) dirButton.href = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '&travelmode=walking';
    else dirButton.href = 'https://www.google.com/maps/dir/?api=1&destination=' + data.properties.title + '&travelmode=walking';
}

//variables desiding where top middle of screen is
const rect = document.getElementById('map').getBoundingClientRect();
const viewportX = rect.x;
const viewportY = rect.bottom;
const shiftScreenY = 0.25 * viewportY;
const shiftScreenX = 0.5 * viewportX;

//fly to marker and centralize it
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

/*QUESTION POP UP*/
const square = document.getElementById('square');
const content = document.getElementById('content');
const icon = document.getElementById('icon');
const closeButton = document.getElementById('closeButton');


const startText = "Kia Ora! \n Welcome to the beautiful country of Te Aotearoa (New Zealand) and the amazing town of Queenstown! \n ENTER MORE TEXT HERE";
const temptext = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

square.addEventListener('click', toggleSize);
//closeButton.addEventListener('click', zoomInToQueenstown);
closeButton.addEventListener('click', toggleSmall);

function toggleSize() {
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

function toggleSmall(event) {
    if (!square.classList.contains('centered')) return;


    if (event != null) event.stopPropagation();
    square.classList.remove('big');
    content.style.display = 'none';
    icon.style.display = 'block';
    setTimeout(() => {
        square.classList.remove('centered');
    }, 20); // Delay should match the transition duration
}

function startingState() {
    square.classList.toggle('centered');
    setTimeout(() => {
        square.classList.toggle('big')
        content.innerText = startText;
        content.style.display = 'block';
        icon.style.display = 'none';
    },)
}

startingState();
