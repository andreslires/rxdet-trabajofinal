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
// **************VACAS: Dentro y fuera de las fincas***************

// Los datos se cargan conectandonos a GEOSERVER, que a su vez los obtiene de PostGIS

// Los marcadores personalizados se han cambiado en GEOSERVER

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

var vacasfueraBuffer = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_fuera_buffer',
    format: 'image/png',
    transparent: true,
});

var vacasdentroBuffer = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_dentro_buffer',
    format: 'image/png',
    transparent: true
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
    if (map.hasLayer(vacasdentroBuffer)) {
        map.removeLayer(vacasdentroBuffer);
    }
    if (map.hasLayer(vacasfueraBuffer)) {
        map.removeLayer(vacasfueraBuffer);
    }
});

// Botón Vacas Dentro Buffer
document.getElementById('btnDentroBuffer').addEventListener('click', function() {
    if (map.hasLayer(vacasdentroBuffer)) {
        map.removeLayer(vacasdentroBuffer);
    } else {
        map.addLayer(vacasdentroBuffer);
    }

});

// Botón Vacas Fuera Buffer
document.getElementById('btnFueraBuffer').addEventListener('click', function() {
    if (map.hasLayer(vacasfueraBuffer)) {
        map.removeLayer(vacasfueraBuffer);
    } else {
        map.addLayer(vacasfueraBuffer);
    }
});

// ****************************************************************
// **************Controles adicionales*****************************

// Escala métrica
var scaleControl = L.control.scale({ imperial: false });
map.addControl(scaleControl);