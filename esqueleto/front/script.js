// ****************************************************************
// *********************Capas base*********************************

// OpenStreetMap
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

// ****************************************************************
// *********************Creación del mapa**************************

var map = L.map('map'); map.setView(new L.LatLng(43.25, -7.34), 14);

// Capa por defecto: 
map.addLayer(osmLayer);


// ****************************************************************
// **************VACAS: Dentro y fuera de las fincas***************

// Los datos se cargan conectandonos a GEOSERVER, que a su vez los obtiene de PostGIS
var vacasfuera = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_fuera',
    format: 'image/png',
    transparent: true
});
var vacasdentro = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_dentro',
    format: 'image/png',
    transparent: true
});
map.addLayer(vacasfuera);
map.addLayer(vacasdentro);


// ****************************************************************
// **************Overlays y controles******************************

var overlayMaps = {
    "Vacas fuera de las fincas": vacasfuera,
    "Vacas dentro de las fincas": vacasdentro
};

// Control de capas
var layerControl = L.control.layers(baseMaps, overlayMaps);
map.addControl(layerControl);

// Escala métrica
var scaleControl = L.control.scale({ imperial: false });
map.addControl(scaleControl);
