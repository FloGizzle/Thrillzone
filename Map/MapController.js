
/*CUSTOM VARIABLES PER MAP VERSION*/
const jsonURL = 'https://FloGizzle.github.io/Thrillzone/Map/Data/Lylo.json';

//#region LANGUAGES
//Translatable texts
const loctextdefault = 'Show location';
const startText = "Welcome to the beautiful country of Aotearoa (New Zealand) and the amazing town of Queenstown! \n ENTER MORE TEXT HERE";
const initCloseText = "Confirm";
let infoText = "This is a temporary text which cannot be allowed over 500 characters, please if it is more than 500 characters, make it so that its multiple pieces of text!";
let websiteLink = "Go to website";
let noWebsiteLink = "No website available";
let noPhone = "No phone number available";
let dirText = "Go to";


let lastLanguage = "en-GB";
let newLanguage = "";
//Language options
const languages = {
    "en-GB": "English (Default)",
    "sq-AL": "Albanian",
    "am-ET": "Amharic",
    "ar-SA": "Arabic",
    "eu-ES": "Basque",
    "be-BY": "Bielarus",
    "bem-ZM": "Bemba",
    "bn-IN": "Bengali",
    "bs-BA": "Bosnian",
    "my-MM": "Burmese",
    "ca-ES": "Catalan",
    "hr-HR": "Croatian",
    "cs-CZ": "Czech",
    "da-DK": "Danish",
    "dz-BT": "Dzongkha",
    "et-EE": "Estonian",
    "fi-FI": "Finnish",
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
    "mg-MG": "Malagasy",
    "dv-MV": "Maldivian",
    "mi-NZ": "Maori",
    "ms-MY": "Malay",
    "mt-MT": "Maltese",
    "ne-NP": "Nepali",
    "nl-NL": "Netherlands",
    "no-NO": "Norwegian",
    "ny-MW": "Nyanja",
    "ur-PK": "Pakistani",
    "pa-IN": "Panjabi",
    "ps-PK": "Pashto",
    "fa-IR": "Persian",
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
let showMyLocation = false;

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
const direction = document.getElementById('direction');

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
const initToggle = document.getElementById('onRadio');
const inittitle = document.getElementById('init-title');
const showloctext = document.getElementById('location-select-text');

//VARIABLES FOR NAVBAR
let activeNav;
let allItemsNav;
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
    CloseInfo();
    if (initZoom) ZoomInToQueenstown();
    CloseSlideUp();
})

map.on('zoomend', (e) => {
    const zoom = map.getZoom();

    if(zoom < zoomMarker && markerVisible) 
    {
        ToggleMarkers('none');
        ChangeSelectedNav(allItemsNav);
    }
    else if(zoom > zoomMarker && !markerVisible) ToggleMarkers('block');
    else if(zoom > zoomMarker && markerVisible) null;

    if (zoom < zoomMapTitle && mapTitleVisible) ToggleTitle('none');
    else if (zoom > zoomMapTitle && !mapTitleVisible) ToggleTitle('block');
    else if (zoom > zoomMapTitle && mapTitleVisible) null;
})

function ToggleMarkers(toggle) {

    let elements = document.querySelectorAll(`img[class^="marker"]`);
    elements.forEach(function (el) {
        el.style.display = toggle;
    });

    if (toggle === 'none') markerVisible = false;
    else if (toggle === 'block') markerVisible = true;
}

function ToggleTitle(toggle) {
    console.log('toggle on the title under the logo');

    if (toggle === 'none') mapTitleVisible = false;
    else if (toggle === 'block') mapTitleVisible = true;

}

//#endregion

//#region LAYER WORK
//When the map is loaded add our layers on top
//Add markers to map
function addLayers(GeoJSON) {
    for (let i = 0; i < GeoJSON.length; i++) {
        for (const marker of GeoJSON[i].features) {
            const el = document.createElement('img');

            el.className = 'marker' + marker.properties.layer;
            el.src = marker.properties.markerimage;
            el.style.width = '50px';
            el.style.height = '50px';
            el.style.backgroundSize = '100%';
            el.style.display = 'none';
            el.style.zIndex = 1;

            for (let j = 0; j < _layerName.length; j++) {
                if (marker.properties.layer === _layerName[j]) {
                    _layers[j].push(marker);
                    console.log(_layers[j]);
                    break;
                }
            }

            // Add markers to the map.
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

            el.addEventListener('click', (event) => {
                OpenSlideUp(marker, event);
            });
        }
    }

}

//Shows the selected layer

function OpenLayer(navbarid)
{
    CloseSlideUp();
    CloseInfo();
    ChangeSelectedNav(navbarid);


    if(navbarid.id ==='all'){
        OpenAll();
        return;
    }
    let ids = navbarid.id.split(" ");

    document.querySelectorAll('img[class^="marker"]').forEach(function (el) {
        el.style.display = 'none';
    });

    ids.forEach(function (id) {
        let matchesFoundForId = false; // Flag to track if any matches were found for the current ID
        let icon = [];

        for (let j = 0; j < _layers.length; j++) {
            if (_layers[j].length === 0) break;

            let elements = document.querySelectorAll(`img[class^="marker${id}"]`);

            elements.forEach(function (el) {
                if (id === _layerName[j]) {
                    icon.push(el);
                }
            });
        }

        icon.forEach(function (icon) {
            icon.style.display = 'block';
        })
    });
}

//Shows all layers

function OpenAll()
{
    let elements = document.querySelectorAll(`img[class^="marker"]`);

    elements.forEach(function (el) {
        el.style.display = 'block';
    });
}

function ChangeSelectedNav(newActive)
{
    if(activeNav === undefined)
    {
        activeNav = newActive;
        newActive.classList.add('.selected');
    }
    if(activeNav.id !== newActive.id)
    {
        newActive.classList.add('.selected');
        activeNav.classList.remove('.selected');
        activeNav = newActive;
    }
}
//#endregion

//#region SLIDE UP CONTROLS

//EVENTLISTENERS FOR SLIDE UP
slideClose.addEventListener('click', () => CloseSlideUp());
dirButton.addEventListener('click', () => window.open(dirButton.href, "_blank"));

//Opens the slide up and updates all the data
function OpenSlideUp(data, event) {
    //Stop parent event from doing anything
    event.stopPropagation();
    //Start pop up animation and centralizing to marker
    textContainer.scrollTo(0, 0);
    slideUp.classList.add('slidein');
    const lnglat = data.geometry.coordinates;
    CentralizeToMarker(lnglat);
    CloseInfo();

    //Add data text from mapbox
    title.innerText = data.properties.title;
    if (data.properties.website != "") {
        website.href = data.properties.website;
        website.innerText = websiteLink;
    }
    else {
        website.href = "https://www.thrillzone.co.nz/queenstown";
        website.innerText = noWebsiteLink;
    }
    if (data.properties.phone != "") {
        phone.innerText = data.properties.phone;
    }
    else {
        phone.innerText = noPhone;
    }
    description.innerText = data.properties.description;
    if (data.layer !== undefined && data.layer.id === _toilet) dirButton.href = 'https://www.google.com/maps/dir/?api=1&destination=' + lnglat[1] + ',' + lnglat[0] + '&travelmode=walking';
    else dirButton.href = 'https://www.google.com/maps/dir/?api=1&destination=' + data.properties.title + '&travelmode=walking';
}

//Fly to marker and centralize it
function CentralizeToMarker(lnglat) {
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
function CloseSlideUp() {
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
function OpenInfo() {
    //Check if it is already done
    if (square.classList.contains('centered')) return;

    CloseSlideUp();
    square.classList.toggle('centered');
    setTimeout(() => {
        square.classList.toggle('big')
        content.innerText = infoText;
        content.style.display = 'block';
        icon.style.display = 'none';
    }, 250); // Delay should match the transition duration
}

//Changes the pop up back to the info button
function CloseInfo(event) {
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
    //Get json data
    $.getJSON(jsonURL, function (data) {
        addLayers(data);
    });

    let langOption = document.querySelectorAll('select');
    langOption.forEach((get, con) => {
        for (let countrycode in languages) {
            let option = '<option value="' + countrycode + '">' + languages[countrycode] + '</option>';
            get.insertAdjacentHTML('beforeend', option);
        }
    });


    initcontent.innerText = startText;
    showloctext.innerText = loctextdefault;

    map['scrollZoom'].disable();
    map['dragRotate'].disable();
    map['boxZoom'].disable();
    map['dragPan'].disable();
    map['touchZoomRotate'].disable();

    initclose.addEventListener('click', ZoomInToQueenstown);
}

//Zooms into queenstown when the pop up is closed
function ZoomInToQueenstown() {
    document.getElementById("all-init-content").style.display = 'none';
    initpopup.style.width = 'auto';
    initpopup.classList.add('shrink');

    ChechkToTranslate();

    map.flyTo({
        center: lastCenter,
        speed: 1,
        curve: 1.25,
        zoom: lastZoom
    });
    //Remove the eventlistener so it wont zoom in again
    initclose.removeEventListener('click', ZoomInToQueenstown);
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
        if (_layers[i].length === 0) break;
        console.log("init " + document.querySelectorAll('img[class^="marker"]'));
        for (let el of document.querySelectorAll('img[class^="marker"]')) {
            el.style.display = 'block';
        }
    }

    square.addEventListener('click', OpenInfo);
    closeButton.addEventListener('click', CloseInfo);
    const navButtons = document.querySelectorAll('.navbar-item');
    for (let i = 0; i < navButtons.length; i++) {

        navButtons[i].addEventListener('click', ()=> OpenLayer(navButtons[i])); 
        if(navButtons[i].id === 'all')
        { 
            allItemsNav = navButtons[i];
        }
    }
    ChangeSelectedNav(allItemsNav);
});
//#endregion

//#region LANGUAGE SECTION

function LanguageSelected(e)
{
    newLanguage=e.target.value;
    if(newLanguage !== lastLanguage)
    {
        ChangeLanguage(startText).then(response=> initcontent.innerText = response);
        ChangeLanguage(loctextdefault).then(response=> showloctext.innerText = response);
        ChangeLanguage(initCloseText).then(response=> initclose.innerText = response);
    }
    else {
        initcontent.innerText = startText;
        showloctext.innerText = loctextdefault;
    }
}


function ToggleState(state)
{
    if(state === 'on') onRadio.value = 'off';
    else onRadio.value = 'on';
    console.log(state);

}

function ChangeLanguage(content) {
    let transLINK = 'https://api.mymemory.translated.net/get?q=' + content + '!&langpair=' + lastLanguage + '|' + newLanguage;
    return fetch(transLINK).then(translate => translate.json()).then(data => {
        return data.responseData.translatedText;
    });
}

function ChechkToTranslate() {
    if (newLanguage === lastLanguage || newLanguage === '') {
        translatedInfoText = infoText;
        return;
    }

    ChangeLanguage(infoText).then(response => infoText = response);
    ChangeLanguage(noWebsiteLink).then(response => noWebsiteLink = response);
    ChangeLanguage(websiteLink).then(response => websiteLink = response);
    ChangeLanguage(noPhone).then(response => noPhone = response);
    ChangeLanguage(dirText).then(response => direction.innerText = response);

    for (let i = 0; i < _layers.length; i++) {
        for (let j = 0; j < _layers[i].length; j++) {
            ChangeLanguage(_layers[i][j].properties.description).then(response => _layers[i][j].properties.description = response);
        }        
    }
}
//#endregion

//CALLS INITIALIZATION CODE
Init();

//#endregion


