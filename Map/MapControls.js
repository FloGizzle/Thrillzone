
//Load map
//Call in mapbox to load map
mapboxgl.accessToken = 'pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsczN3aTU1YzBrbnMyanFqY3d2a2pwdW0ifQ.HgnJMH6GCfnB4zagtanLSw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/thrillzonenz/clt5aqt2o00df01oie2kkg0ou',
    center: [173.21106573769924, -41.81657804512245], // starting position [lng, lat]
    zoom: 4.25, // starting zoom
});
//Let wix know when map is loaded
map.on('load', () => {
    if (map.loaded()) window.parent.postMessage('mapLoaded', "*");
});

//Get data from wix, this is general so here check what the info is and do with it what you will
/*
    types:
    - List[List[unique id, url for icon]]
    - String layerID 
*/
window.onmessage = (event) => {
    if (event.data.length > 0) makeMarkers(event.data);
};

//Make markers from send in list
function makeMarkers(list) {
    console.log('got through check');
    for (let i = 0; i < list.length; i++) {

        const marker = list[i];
        const el = document.createElement('img');

        el.className = marker[0];
        el.src = marker[1];
        el.style.width = '50px';
        el.style.height = '50px';
        el.style.backgroundSize = '100%';
        el.style.display = 'none';
        el.style.zIndex = 1;

        // Add markers to the map.
        new mapboxgl.Marker(el)
            .setLngLat(marker[2])
            .addTo(map);

        el.addEventListener('click', (event) => {
            console.log('needs the post Message');
        });
        console.log('should have marker');
    }
}

//Post data to wix when marker is clicked
window.parent.postMessage = (event) => {

}

// Set markers and get unique id in name, get image link

// Switch layers with OnMessage()
// find all elements with marker in the name -> turn these off -> check id's and search for the ones containing layer code for corresponding layer, turn on

// Zoom out will make markers dissapear, postMessage to set layer to all
