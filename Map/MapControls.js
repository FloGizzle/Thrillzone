
//Load map
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/thrillzonenz/clt5aqt2o00df01oie2kkg0ou',
    center: startingCenter, // starting position [lng, lat]
    zoom: 4.25, // starting zoom
});
//Let wix know when map is loaded
map.on('load', () => {
    window.parent.postMessage(true, "*");
});

//Get data from wix, this is general so here check what the info is and do with it what you will
/*
    types:
    - List[List[unique id, url for icon]]
    - String layerID 
*/
window.onmessage = (event) => {
    if (event.data === typeof ([])) {
        makeMarkers(event.data);
    }
};

//Make markers from send in list
function makeMarkers(list) {
    console.log("I should make " + list.length + " markers");
}

//Post data to wix when marker is clicked
window.parent.postMessage = (event) => {

}

// Set markers and get unique id in name, get image link

// Switch layers with OnMessage()
// find all elements with marker in the name -> turn these off -> check id's and search for the ones containing layer code for corresponding layer, turn on

// Zoom out will make markers dissapear, postMessage to set layer to all
