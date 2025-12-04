// ****************************************************************
// *********************Capas base*********************************

// OpenStreetMap
// Mapa satelite:
var esriSatLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

// var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

// ****************************************************************
// *********************Creación del mapa**************************

var map = L.map('map'); map.setView(new L.LatLng(43.25, -7.34), 15);

// Capa por defecto: 
map.addLayer(esriSatLayer);


// ****************************************************************
// **************VACAS: Dentro y fuera de las fincas***************

// Marcadores de vacas dentro y fuera de las fincas

// Los datos se cargan conectandonos a GEOSERVER, que a su vez los obtiene de PostGIS
var vacasfuera = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_fuera',
    format: 'image/png',
    transparent: true,
});

var vacasdentro = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_dentro',
    format: 'image/png',
    transparent: true
});


// ****************************************************************
// **************Overlays y controles******************************


var overlayMaps = {
    "Vacas fuera de las fincas": vacasfuera,
    "Vacas dentro de las fincas": vacasdentro
};

// Control de capas
var layerControl = L.control.layers(null, overlayMaps);
map.addControl(layerControl);

// Escala métrica
var scaleControl = L.control.scale({ imperial: false });
map.addControl(scaleControl);
