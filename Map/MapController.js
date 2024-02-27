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

//Call in mapbox to load map
mapboxgl.accessToken = 'pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsczN3aTU1YzBrbnMyanFqY3d2a2pwdW0ifQ.HgnJMH6GCfnB4zagtanLSw';
//'pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsc2I4emc4azBkMXMybW82OXhzd3g4MGYifQ.JaafMSBBoA0Y2Wixn12PfQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/thrillzonenz/clsv5p0sa000a01pme4ibcux1',
    //'mapbox://styles/thrillzonenz/cls4hmg7c001c01pyhb5o506e', // style URL
    center: center, // starting position [lng, lat]
    zoom: 17, // starting zoom
    maxBounds: bounds,
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
    else closeSlideUp();

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
const closeButton = document.getElementById('closeButton');

square.addEventListener('click', toggleSize);
closeButton.addEventListener('click', toggleSmall);

function toggleSize() {
    if (!square.classList.contains('centered')) {
        square.classList.toggle('centered');
        setTimeout(() => {
            square.classList.toggle('big')
            content.innerText = "Kia Ora!";
        }, 250); // Delay should match the transition duration
    }
}


function toggleSmall(event) {
    event.stopPropagation();
    square.classList.remove('big');
    setTimeout(() => {
        square.classList.remove('centered');
    }, 20); // Delay should match the transition duration
}
