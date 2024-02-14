//variables for map bounds and center position
const bounds = [
    [168.395199, -45.380678], // Southwest coordinates
    [168.771204, -44.774920] // Northeast coordinates
];
const zoomoutCenter = [168.66228038195243, -45.03483913752131];
const center = [168.65834407453838, -45.03205764496636];

//Call in mapbox to load map
mapboxgl.accessToken =
    'pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsc2I4emc4azBkMXMybW82OXhzd3g4MGYifQ.JaafMSBBoA0Y2Wixn12PfQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/thrillzonenz/cls4hmg7c001c01pyhb5o506e', // style URL
    center: center, // starting position [lng, lat]
    zoom: 17, // starting zoom
    maxBounds: bounds,
});

// Load an image from an external URL.
map.loadImage(
    'https://drive.google.com/drive/folders/1OYC6NJ3YOuyKWOXYI9fwSIBw0k-L0wtS?usp=sharing',
    (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage('EQ', image);
    });

// Add a layer to use the image to represent the data.
map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'point', // reference the data source
    'layout': {
        'icon-image': 'cat', // reference the image
        'icon-size': 0.25
    }
});

let lastCenter = center;
let lastZoom = 17;

/*
map.on('load', map.flyTo(
    {
        center: center, 
        speed: 0.4, 
        curve: .8,
        zoom: 17 
    }
));*/

//Click functionallity for mapbox
map.on('click', (e) => {
    //Set click event to wanted layer
    const [selectedFeature] = map.queryRenderedFeatures(e.point, {
        layers: ['Info', 'Toilets', 'Entertainment', 'Thrillzone', 'Escapequest', 'Crowne']
    });
    //if object is on layer do this
    if (selectedFeature) {
        openPopUp(selectedFeature);
        centralizeToMarker(e.lngLat.lng, e.lngLat.lat);
    } else closePopUp();

})
/*      FOR FUTURE REFERENCE IF WE WANNA SHOW WHERE THE PERSON is on the map
    // Add geolocate control to the map.
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        })
    );
*/
//pop up variables
const closeButton = document.querySelector('.closeButton');
const popup = document.querySelector('.popup');
const popupContainer = document.querySelector('.popupContainer');
const textContainer = document.querySelector('.text');
const title = document.getElementById('title');
const website = document.getElementById('website');
const phone = document.getElementById('phone');
const description = document.getElementById('description');


closeButton.addEventListener('click', () => closePopUp());


function openPopUp(data) {
    textContainer.scrollTo(0, 0);
    popup.classList.add('slidein');
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
}

//variables desiding where top middle of screen is
const rect = document.getElementById('map').getBoundingClientRect();
const viewportX = rect.x;
const viewportY = rect.bottom;
const shiftScreenY = 0.25 * viewportY;
const shiftScreenX = 0.5 * viewportX;

//fly to marker and centralize it
function centralizeToMarker(lng, lat) {
    lastZoom = map.getZoom();
    lastCenter = [lng, lat];

    map.flyTo({
        center: [lng, lat],
        offset: [shiftScreenX, -shiftScreenY],
        speed: 0.8,
        curve: .6,
        zoom: 18
    });
}

function closePopUp() {
    //slide pop up out animation
    if (popup.classList.contains('slidein')) {
        popup.classList.remove('slidein');

        //zoom out to starting position
        map.flyTo({
            center: lastCenter,
            speed: 0.8,
            curve: .6,
            zoom: lastZoom
        });
    }
}
