/*CUSTOM VARIABLES PER MAP VERSION*/
const jsonURL = 'https://FloGizzle.github.io/Thrillzone/Map/Data/Lylo.json';

//#region LANGUAGES
const languages = {
            "sq-AL": "Albanian",
            "am-ET": "Amharic",
            "ar-SA": "Arabic",
            "eu-ES": "Basque",
            "be-BY": "Bielarus",
            "bem-ZM": "Bemba",
            "bi-VU": "Bislama",
            "bjs-BB": "Bajan",
            "bn-IN": "Bengali",
            "br-FR": "Breton",
            "bs-BA": "Bosnian",
            "my-MM": "Burmese",
            "ca-ES": "Catalan",
            "cop-EG": "Coptic",
            "hr-HR": "Croatian",
            "cs-CZ": "Czech",
            "da-DK": "Danish",
            "dz-BT": "Dzongkha",
            "en-GB": "English",
            "et-EE": "Estonian",
            "fi-FI": "Finnish",
            "fn-FNG": "Fanagalo",
            "fo-FO": "Faroese",
            "fr-FR": "French",
            "gl-ES": "Galician",
            "de-DE": "German",
            "gu-IN": "Gujarati",
            "el-GR": "Greek",
            "ha-NE": "Hausa",
            "he-IL": "Hebrew",
            "hi-IN": "Hindi",
            "hu-HU": "Hungarian",
            "id-ID": "Indonesian",
            "is-IS": "Icelandic",
            "it-IT": "Italian",
            "ja-JP": "Japanese",
            "kk-KZ": "Kazakh",
            "km-KM": "Khmer",
            "kn-IN": "Kannada",
            "rn-BI": "Kirundi",
            "ko-KR": "Korean",
            "ku-TR": "Kurdish",
            "ky-KG": "Kyrgyz",
            "la-VA": "Latin",
            "lo-LA": "Lao",
            "lv-LV": "Latvian",
            "men-SL": "Mende",
            "mg-MG": "Malagasy",
            "dv-MV": "Maldivian",
            "mi-NZ": "Maori",
            "ms-MY": "Malay",
            "mt-MT": "Maltese",
            "ne-NP": "Nepali",
            "niu-NU": "Niuean",
            "nl-NL": "Netherlands",
            "no-NO": "Norwegian",
            "ny-MW": "Nyanja",
            "ur-PK": "Pakistani",
            "pau-PW": "Palauan",
            "pa-IN": "Panjabi",
            "ps-PK": "Pashto",
            "fa-IR": "Persian",
            "pis-SB": "Pijin",
            "pl-PL": "Polish",
            "pt-PT": "Portuguese",
            "ro-RO": "Romanian",
            "ru-RU": "Russian",
            "sg-CF": "Sango",
            "si-LK": "Sinhala",
            "sk-SK": "Slovak",
            "sm-WS": "Samoan",
            "sn-ZW": "Shona",
            "so-SO": "Somali",
            "es-ES": "Spanish",
            "sr-RS": "Serbian",
            "sv-SE": "Swedish",
            "sw-SZ": "Swahili",
            "ta-LK": "Tamil",
            "te-IN": "Telugu",
            "tet-TL": "Tetum",
            "tg-TJ": "Tajik",
            "th-TH": "Thai",
            "bo-CN": "Tibetan",
            "ti-TI": "Tigrinya",
            "tk-TM": "Turkmen",
            "tl-PH": "Tagalog",
            "tn-BW": "Tswana",
            "to-TO": "Tongan",
            "tr-TR": "Turkish",
            "uk-UA": "Ukrainian",
            "uz-UZ": "Uzbek",
            "vi-VN": "Vietnamese",
            "cy-GB": "Welsh",
            "wo-SN": "Wolof",
            "xh-ZA": "Xhosa",
            "yi-YD": "Yiddish",
            "zu-ZA": "Zulu"
};
//#endregion

//#region LAYERS
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

//#endregion

//#region VARIABLES

//VARIABLES FOR MAP TO SET BOUNDS AND CENTER
const bounds = [
    [168.395199, -45.380678], // Southwest coordinates
    [168.771204, -44.774920] // Northeast coordinates
];
const zoomoutCenter = [168.66228038195243, -45.03483913752131];
const center = [168.65834407453838, -45.03205764496636];
const startingCenter = [173.21106573769924, -41.81657804512245];
const zoomMarker = 15;
let markerVisible = false;
const zoomMapTitle = 17;
let mapTitleVisible = false;

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


//VARIABLES FOR INIT POP UP
const initpopup = document.getElementById('init-popup');
const initcontent = document.getElementById('init-content');
const initclose = document.getElementById('init-close');
const inittitle = document.getElementById('init-title');
const startText = "Welcome to the beautiful country of Aotearoa (New Zealand) and the amazing town of Queenstown! \n ENTER MORE TEXT HERE";
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
    closeSlideUp();
})

map.on('zoomend', (e) => {
    const zoom = map.getZoom();
    if(zoom < zoomMarker && markerVisible) toggleMarkers('none');
    else if(zoom > zoomMarker && !markerVisible) toggleMarkers('block');
    else if(zoom > zoomMarker && markerVisible) null;

    if(zoom < zoomMapTitle && mapTitleVisible) toggleTitle('none');
    else if(zoom > zoomMapTitle && !mapTitleVisible) toggleTitle('block');
    else if(zoom > zoomMapTitle && mapTitleVisible) null;
})

function toggleMarkers(toggle){
    
    let elements = document.querySelectorAll(`img[class^="marker"]`);
    elements.forEach(function(el) {
        el.style.display = toggle;
    });

    if(toggle === 'none') markerVisible = false;
    else if(toggle === 'block') markerVisible = true;
}

function toggleTitle(toggle){
    console.log('toggle on the title under the logo');

    if(toggle === 'none') mapTitleVisible = false;
    else  if(toggle === 'block') mapTitleVisible = true;
}

//#endregion

//#region ADDING LAYERS TO MAP
//When the map is loaded add our layers on top
//Add markers to map
function addLayers(GeoJSON) {
    for (let i = 0; i < GeoJSON.length; i++) {
        for (const marker of GeoJSON[i].features) {
            const el = document.createElement('img');

            el.className = 'marker'+marker.properties.layer;
            el.src = marker.properties.markerimage;
            el.style.width = '50px';
            el.style.height = '50px';
            el.style.backgroundSize = '100%';
            el.style.display = 'none';
            el.style.zIndex = 1;

            for (let j = 0; j < _layerName.length; j++) {
                if (marker.properties.layer === _layerName[j]) {
                    _layers[j].push(marker);
                    break;
                }
            }

            // Add markers to the map.
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
            
            el.addEventListener('click', (event) =>{
                openSlideUp(marker, event);
            });
        }
    }
    
}
//#endregion

//#region SLIDE UP CONTROLS

//EVENTLISTENERS FOR SLIDE UP
slideClose.addEventListener('click', () => closeSlideUp());
dirButton.addEventListener('click', () => window.open(dirButton.href, "_blank"));

//Opens the slide up and updates all the data
function openSlideUp(data, event) {
    //Stop parent event from doing anything
    event.stopPropagation();
    //Start pop up animation and centralizing to marker
    textContainer.scrollTo(0, 0);
    slideUp.classList.add('slidein');
    const lnglat = data.geometry.coordinates;
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
}
//#endregion

//#region INFO POP UP

//EVENTLISTENERS FOR INFO POP UP
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
    $.getJSON(jsonURL, function( data ) {
        addLayers(data);
    });

    let langOption = document.querySelectorAll('select');
    langOption.forEach((get, con)=>{
        for (let countrycode in languages)
        {
            let option = '<option value="'+countrycode+'">'+languages[countrycode]+'</option>';
            get.insertAdjacentHTML('beforeend', option);
        }
    });


    initcontent.innerText = startText;

    map['scrollZoom'].disable();
    map['dragRotate'].disable();
    map['boxZoom'].disable();
    map['dragPan'].disable();
    map['touchZoomRotate'].disable();

    initclose.addEventListener('click', zoomInToQueenstown);
}

//Zooms into queenstown when the pop up is closed
function zoomInToQueenstown() {
    initpopup.classList.add('shrink');
    document.getElementById("all-init-content").style.display = 'none';
    map.flyTo({
        center: lastCenter,
        speed: 1,
        curve: 1.25,
        zoom: lastZoom
    });
    //Remove the eventlistener so it wont zoom in again
    initclose.removeEventListener('click', zoomInToQueenstown);
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

    square.addEventListener('click', toggleBig);
    closeButton.addEventListener('click', toggleSmall);
    const navButtons = document.querySelectorAll('.navbar-item');
    for (let i = 0; i < navButtons.length; i++) {
        navButtons[i].addEventListener('click', ()=> openLayer(navButtons[i].id)); 
    }
});
//#endregion

//#region NAVIGATION

//Shows the selected layer
function openLayer(id)
{
    if(id ==='all'){
        openAll();
        return;
    }
    let ids = id.split(" ");

    document.querySelectorAll('img[class^="marker"]').forEach(function(el) {
        el.style.display = 'none';
    });

    ids.forEach(function(id) {
        let matchesFoundForId = false; // Flag to track if any matches were found for the current ID
        let icon = [];

        for (let j = 0; j < _layers.length; j++) {
            if (_layers[j].length === 0) break;

            let elements = document.querySelectorAll(`img[class^="marker${id}"]`);

            elements.forEach(function(el) {
                if (id === _layerName[j]) {
                    icon.push(el);
                } 
            });
        }

        icon.forEach(function(icon){
            icon.style.display = 'block';
        })
    }); 
}

//Shows all layers
function openAll()
{
    let elements = document.querySelectorAll(`img[class^="marker"]`);

    elements.forEach(function(el) {
        el.style.display = 'block';
    });
}
//#endregion

let lastLanguage = "en-GB";
let newLanguage = "";
function languageSelected(e)
{
    newLanguage=e.target.value;
    changeLanguage(startText, initcontent);
    console.log(e.target.value);
}

function changeLanguage(content, target)
{
    let transLINK = 'https://api.mymemory.translated.net/get?q='+content+'!&langpair='+lastLanguage+'|'+newLanguage;
    fetch(transLINK).then(translate => translate.json()).then(data =>{
        
        target.innerText = data.responseData.translatedText;
        console.log(data);
    });
}

//CALLS INITIALIZATION CODE
Init();