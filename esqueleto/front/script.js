// ****************************************************************
// *********************Capas base*********************************

// Mapa satelite:
var esriSatLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

// ****************************************************************
// *********************Creación del mapa**************************

var map = L.map('map'); 
map.setView(new L.LatLng(43.25, -7.34), 16);

// Capa por defecto: 
map.addLayer(esriSatLayer);

// ****************************************************************
// **************VACAS: Dentro y fuera de las fincas***************

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
// **************Control con botones*******************************

// Coordenadas aproximadas del área de las vacas (ajusta según tus datos)
const boundsVacas = [
    [43.245, -7.345],  // Esquina suroeste
    [43.255, -7.335]   // Esquina noreste
];

// Botón Vacas Dentro
document.getElementById('btnDentro').addEventListener('click', function() {
    if (map.hasLayer(vacasdentro)) {
        map.removeLayer(vacasdentro);
    } else {
        map.addLayer(vacasdentro);
        map.fitBounds(boundsVacas);
    }
});

// Botón Vacas Fuera
document.getElementById('btnFuera').addEventListener('click', function() {
    if (map.hasLayer(vacasfuera)) {
        map.removeLayer(vacasfuera);
    } else {
        map.addLayer(vacasfuera);
        map.fitBounds(boundsVacas);
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