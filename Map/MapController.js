//variables for map bounds and center position
const bounds = [
    [168.395199, -45.380678], // Southwest coordinates
    [168.771204, -44.774920] // Northeast coordinates
];
const center = [168.65834407453838, -45.03205764496636];

//Call in mapbox to load map
mapboxgl.accessToken = 
    'pk.eyJ1IjoidGhyaWxsem9uZW56IiwiYSI6ImNsc2I4emc4azBkMXMybW82OXhzd3g4MGYifQ.JaafMSBBoA0Y2Wixn12PfQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/thrillzonenz/cls4hmg7c001c01pyhb5o506e', // style URL
    center: center, // starting position [lng, lat]
    zoom: 15, // starting zoom
    maxBounds: bounds,
});

//Click functionallity for mapbox
map.on('click', (e) =>{

    //Set click event to wanted layer
    const [selectedFeature] = map.queryRenderedFeatures(e.point, {
        layers: ['Info', 'Toilets', 'Entertainment']
    });
    console.log(phone);
    //if object is on layer do this
    if(selectedFeature)
        openPopUp(selectedFeature);
    else
        closePopUp();

})

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

function openPopUp(data)
{
    textContainer.scrollTo(0,0);
    popup.classList.add('slidein');
    //Add data text from mapbox
    title.innerText = data.properties.title;
    if(data.properties.website != "")
    {
        website.href = data.properties.website;
        website.innerText = "Click here to go to website";
    }
    else {website.innerText = "No website available";}
    if(data.properties.phone != "") 
    {
        phone.innerText = data.properties.phone;
    }
    else {phone.innerText = "No phone number available";}
    description.innerText = data.properties.description;
    //centralize marker to uper 50% of screen

}

function closePopUp()
{
    popup.classList.remove('slidein');
}