// ----------------------------------------------
// CAPA BASE
// ----------------------------------------------
var esriSatLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
);

var map = L.map('map').setView([43.25, -7.34], 15);
map.addLayer(esriSatLayer);

// ----------------------------------------------
// ICONOS SEGÚN ENUNCIADO
// ----------------------------------------------

// Punto blanco borde negro
const iconDentro = L.divIcon({
    className: "",
    html: `<div style="
        width:10px;
        height:10px;
        background:white;
        border:3px solid black;
        border-radius:50%;
    "></div>`,
    iconSize: [15, 15]
});

// Punto blanco borde rojo
const iconFuera = L.divIcon({
    className: "",
    html: `<div style="
        width:10px;
        height:10px;
        background:white;
        border:3px solid red;
        border-radius:50%;
    "></div>`,
    iconSize: [15, 15]
});

// ----------------------------------------------
// FUNCIONES PARA PEDIR GEOJSON A GEOSERVER
// ----------------------------------------------

async function loadWFS(layerName) {
    const url =
        `http://localhost:8080/geoserver/RXDET/ows?` +
        `service=WFS&version=1.0.0&request=GetFeature&` +
        `typeName=RXDET:${layerName}&outputFormat=application/json`;

    const response = await fetch(url);
    const geojson = await response.json();
    return geojson;
}

// Carga de capa Vacas Dentro
async function capaVacasDentro() {
    const data = await loadWFS("vacas_dentro");

    return L.geoJSON(data, {
        pointToLayer: (feature, latlng) =>
            L.marker(latlng, { icon: iconDentro })
    });
}

// Carga de capa Vacas Fuera
async function capaVacasFuera() {
    const data = await loadWFS("vacas_fuera");

    return L.geoJSON(data, {
        pointToLayer: (feature, latlng) =>
            L.marker(latlng, { icon: iconFuera })
    });
}

// ----------------------------------------------
// CONTROL DE CAPAS CON REFERENCIA GLOBAL
// ----------------------------------------------

let layerDentro = null;
let layerFuera = null;

// Botón Vacas Dentro
document.getElementById("btnDentro").onclick = async () => {
    if (!layerDentro) {
        layerDentro = await capaVacasDentro();
    }
    
    // Si la capa ya está en el mapa y se pincha, la quitamos (toggle)
    if (map.hasLayer(layerDentro)) {
        map.removeLayer(layerDentro);
    } else {
        layerDentro.addTo(map);
    }
};

// Botón Vacas Fuera
document.getElementById("btnFuera").onclick = async () => {
    if (!layerFuera) {
        layerFuera = await capaVacasFuera();
    }
    
    // Si la capa ya está en el mapa y se pincha, la quitamos (toggle)
    if (map.hasLayer(layerFuera)) {
        map.removeLayer(layerFuera);
    } else {
        layerFuera.addTo(map);
    }
};

// Botón Limpiar Capas
document.getElementById("btnLimpiar").onclick = () => {
    if (layerDentro && map.hasLayer(layerDentro)) {
        map.removeLayer(layerDentro);
    }
    if (layerFuera && map.hasLayer(layerFuera)) {
        map.removeLayer(layerFuera);
    }
};