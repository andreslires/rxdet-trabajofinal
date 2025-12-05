// ****************************************************************
// *********************Capas base*********************************

// Mapa satelite:
var esriSatLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

// ****************************************************************
// *********************Creación del mapa**************************

var map = L.map('map'); 
map.setView(new L.LatLng(43.253, -7.34), 16);

// Capa por defecto: 
map.addLayer(esriSatLayer);


// ****************************************************************
// **************Capa base: Mapa de Fontán***********************

var wmsUrlFontan = 'https://ideg.xunta.gal/servizos/services/Raster/Fontan/MapServer/WmsServer?'; 

var wmsOptionsFontan = {
    layers: '0', 
    format: 'image/png', // Formato de imagen
    transparent: true,
    zIndex: 1,
    version: '1.3.0', // Versión WMS recomendada por el documento
    crs: L.CRS.EPSG3857, // Usar la proyección estándar web para la compatibilidad (aunque el XML lista muchas)
    attribution: 'Carta Geométrica de Galicia - Domingo Fontán (Xunta de Galicia)'
};

var fontanLayer = L.tileLayer.wms(wmsUrlFontan, wmsOptionsFontan);


fontanLayer.on('tileload', function() {
    fontanLayer.bringToBack();
});

// Control de capas base
var baseLayers = {
    "Mapa Satélite": esriSatLayer,
    "Mapa de Fontán": fontanLayer
};
L.control.layers(baseLayers).addTo(map);


// ****************************************************************
// **************VACAS: Dentro y fuera de las fincas***************

// Los datos se cargan conectandonos a GEOSERVER, que a su vez los obtiene de PostGIS

// Los marcadores personalizados se han cambiado en GEOSERVER

var vacasfuera = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_fuera',
    format: 'image/png',
    transparent: true,
});

vacasfuera.on('tileload', function() {
    vacasfuera.bringToFront();
});

var vacasdentro = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_dentro',
    format: 'image/png',
    transparent: true
});

vacasdentro.on('tileload', function() {
    vacasdentro.bringToFront();
});

// ****************************************************************
// **************Control con botones*******************************

// Botón Vacas Dentro
document.getElementById('btnDentro').addEventListener('click', function() {
    if (map.hasLayer(vacasdentro)) {
        map.removeLayer(vacasdentro);
    } else {
        map.addLayer(vacasdentro);
    }
});

// Botón Vacas Fuera
document.getElementById('btnFuera').addEventListener('click', function() {
    if (map.hasLayer(vacasfuera)) {
        map.removeLayer(vacasfuera);
    } else {
        map.addLayer(vacasfuera);
    }
});

// Botón Limpiar Capas
document.getElementById('btnLimpiar').addEventListener('click', function() {
    if (map.hasLayer(vacasdentro)) {
        map.removeLayer(vacasdentro);
    }
    if (map.hasLayer(vacasfuera)) {
        map.removeLayer(vacasfuera);
    }
});

// ****************************************************************
// **************Controles adicionales*****************************

// Escala métrica
var scaleControl = L.control.scale({ imperial: false });
map.addControl(scaleControl);