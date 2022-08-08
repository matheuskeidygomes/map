// -------------- BASE API URL ----------------

const baseAPI = "https://terraq.com.br";


// -------------- MAP CONFIGURATIONS ----------------

let map = null;                  // Initialize empty/null map
let mapOptions = null;           // Initialize empty/null mapOptions
let maxZoom = { maxZoom: 19 };   // Initialize maxZoom option for map

// GETTING INITIAL MAP VISION FUNCTION

async function getInitialVision() {
    let res = await fetch(`${baseAPI}/api/teste-leaflet/visao-inicial`);       // Getting initial vision from API endpoint
    let vision = await res.json();

    if (vision.initial_view) {
        let coordinates = [vision.initial_view.center.lat, vision.initial_view.center.lng];      // Getting initial vision coordinates
        let zoom = vision.initial_view.zoom;                                                     // Getting initial vision zoom                          
        map = L.map('map').setView(coordinates, zoom);                                           // Setting initial vision and zoom to map
        mapOptions = vision.tile_layers;                                                         // Getting map tiles options from initial vision
        L.tileLayer(mapOptions[0].url, maxZoom).addTo(map);                                      // Adding initial tiles to map
    }
}

// GETTING MAP POINTS FUNCTION

async function getPoints() {
    let res = await fetch(`${baseAPI}/api/teste-leaflet/pontos`);             // Getting map points from API endpoint
    let points = await res.json();

    L.geoJSON(points, {                                                       // Adding catched points to map
        pointToLayer: function (point, coordinates) {                         // Setting individual point configuration
            var iconUrl = point.properties.icon;
            var featureIcon = L.icon({
                iconUrl,
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -28]
            });
            return L.marker(coordinates, { icon: featureIcon });
        },
        onEachFeature: onEachFeature
    }).addTo(map);
}

// SETTING EACH POINT FEATURES FUNCTION

function onEachFeature(feature, layer) {
    let content = null;
    console.log(feature);
    if (feature.properties && feature.properties.popupContent) {    // If feature has popupContent, then fill the point datas into the popup
        content = `                                                             
        <h3> ${feature.properties.name} </h3>
        <div class="point-details">
            <span> ${feature.properties.popupContent} </span>
            <br>
            <span> Precipitação: ${feature.properties.precipitacao} </span>
            <span> Temperatura: ${feature.properties.temperatura} </span>
            <span> Umidade: ${feature.properties.umidade} </span>
            <span> Vento: ${feature.properties.vento} </span>
            <span> Visibilidade: ${feature.properties.visibilidade} </span>
        </div>
        <div class="point-data">
            <button class="point-btn" onclick="changeModalVisible(${feature.properties.id})"> More Info </button>
        </div>
        `;
    }
    layer.bindPopup(content);
}

// INITIALIZING MAP WITH ALL CONFIGURATION FUNCTIONS

async function initializeMap() {
    await getInitialVision();
    await getPoints();
}

initializeMap();                 // Initializing map


// ---------------- CHANGE MAP BUTTON EVENTS -------------------


let mapBtn = document.getElementById("select-map");                  // Getting button DOM element
let selectedMap = 0;                                                 // Initializing with 0 (first map = 0, second map = 1); 

function changeMap() {
    if (selectedMap === 0) {
        L.tileLayer(mapOptions[1].url, maxZoom).addTo(map);          // If current map is 0, then set the 1 map
        selectedMap = 1;
    } else {
        L.tileLayer(mapOptions[0].url, maxZoom).addTo(map);          // If current map is 1, then set the 0 map
        selectedMap = 0;
    }
}

mapBtn.addEventListener("click", changeMap);                        // Adding the event listener to the button


// ----------------- USER DETAILS FUNCTIONS ----------------------

let userDom = {
    avatar: document.querySelector(".user-avatar"),
    name: document.querySelector(".user-name"),
    email: document.querySelector(".user-email"),
    phone: document.querySelector(".user-phone"),                   // Getting user DOM elements
    birth: document.querySelector(".user-birth"),
    sex: document.querySelector(".user-sex"),
}
let userData = {
    avatar: null,
    name: null,
    email: null,
    phone: null,                                                    // Initializing user data with null values
    sex: null,
    birth: null
}

async function getUser() {
    let res = await fetch(`${baseAPI}/api/teste-leaflet/user`);
    let user = await res.json();
    if (user) {
        userData.avatar = user.avatar;
        userData.name = user.nome;
        userData.email = user.email;                                // Getting user data from API endpoint
        userData.phone = user.telefone;
        userData.sex = user.sexo;
        userData.birth = user.data_nascimento;
    }
}

function setUser() {
    userDom.avatar.src = userData.avatar;
    userDom.name.innerHTML = `Nome: ${userData.name}`;              // Setting user data to DOM elements
    userDom.email.innerHTML = `Email: ${userData.email}`;
    userDom.phone.innerHTML = `Telefone: ${userData.phone}`;
    userDom.birth.innerHTML = `Data de Nascimento: ${userData.birth}`;
    userDom.sex.innerHTML = `Sexo: ${userData.birth}`;
}

async function changeUserDom() {
    await getUser();
    setUser();
}

changeUserDom();        // Initializing user data DOM elements

