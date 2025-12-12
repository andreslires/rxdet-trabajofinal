// ****************************************************************
// ********************Capa base: Satélite*************************

var esriSatLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
);

// ****************************************************************
// *********************Creación del mapa**************************

var map = L.map('map'); 
map.setView(new L.LatLng(43.253, -7.34), 16);

// Capa por defecto
map.addLayer(esriSatLayer);

// ****************************************************************
// **************Capa base: Mapa de Fontán*************************

var wmsUrlFontan = 'https://ideg.xunta.gal/servizos/services/Raster/Fontan/MapServer/WmsServer?';

var wmsOptionsFontan = {
    layers: '0',
    format: 'image/jpeg',
    attribution: 'Carta Geométrica de Galicia - Domingo Fontán (Xunta de Galicia)'
};

var fontanLayer = L.tileLayer.wms(wmsUrlFontan, wmsOptionsFontan);
fontanLayer.on('tileload', function() {
    fontanLayer.bringToBack();
});

var baseLayers = {
    "Mapa Satélite": esriSatLayer,
    "Mapa de Fontán": fontanLayer
};

L.control.layers(baseLayers).addTo(map);

// ****************************************************************
// **************VACAS: Dentro y fuera de las fincas***************

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
// ************VACAS CON BUFFER: Dentro y fuera de las fincas******

var vacasfueraBuffer = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_fuera_buffer',
    format: 'image/png',
    transparent: true,
});

vacasfueraBuffer.on('tileload', function() {
    vacasfueraBuffer.bringToFront();
});

var vacasdentroBuffer = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'rxdet:vacas_dentro_buffer',
    format: 'image/png',
    transparent: true
});

vacasdentroBuffer.on('tileload', function() {
    vacasdentroBuffer.bringToFront();
});

// ****************************************************************
// ********************Funciones auxiliares************************

function normalesActivas() {
    return map.hasLayer(vacasdentro) || map.hasLayer(vacasfuera);
}

function bufferActivas() {
    return map.hasLayer(vacasdentroBuffer) || map.hasLayer(vacasfueraBuffer);
}

function desactivarNormales() {
    if (map.hasLayer(vacasdentro)) map.removeLayer(vacasdentro);
    if (map.hasLayer(vacasfuera)) map.removeLayer(vacasfuera);
}

function desactivarBuffer() {
    if (map.hasLayer(vacasdentroBuffer)) map.removeLayer(vacasdentroBuffer);
    if (map.hasLayer(vacasfueraBuffer)) map.removeLayer(vacasfueraBuffer);
}

// ****************************************************************
// ***************** BOTONES DE CAPAS NORMALES *********************

// Vacas Dentro
document.getElementById('btnDentro').addEventListener('click', function () {

    if (bufferActivas()) {
        alert("Primero desactiva las capas buffer o pulsa Limpiar Capas.");
        return;
    }

    if (map.hasLayer(vacasdentro)) {
        map.removeLayer(vacasdentro);
    } else {
        map.addLayer(vacasdentro);   // NO desactiva vacasfuera
    }
});

// Vacas Fuera
document.getElementById('btnFuera').addEventListener('click', function () {

    if (bufferActivas()) {
        alert("Primero desactiva las capas buffer o pulsa Limpiar Capas.");
        return;
    }

    if (map.hasLayer(vacasfuera)) {
        map.removeLayer(vacasfuera);
    } else {
        map.addLayer(vacasfuera);    // NO desactiva vacasdentro
    }
});


// ****************************************************************
// *************** BOTONES DE CAPAS CON BUFFER ********************

// Vacas Dentro Buffer
document.getElementById('btnDentroBuffer').addEventListener('click', function () {

    if (normalesActivas()) {
        alert("Primero desactiva las capas normales o pulsa Limpiar Capas.");
        return;
    }

    if (map.hasLayer(vacasdentroBuffer)) {
        map.removeLayer(vacasdentroBuffer);
    } else {
        map.addLayer(vacasdentroBuffer);   // NO desactiva vacasfueraBuffer
    }
});

// Vacas Fuera Buffer
document.getElementById('btnFueraBuffer').addEventListener('click', function () {

    if (normalesActivas()) {
        alert("Primero desactiva las capas normales o pulsa Limpiar Capas.");
        return;
    }

    if (map.hasLayer(vacasfueraBuffer)) {
        map.removeLayer(vacasfueraBuffer);
    } else {
        map.addLayer(vacasfueraBuffer);   // NO desactiva vacasdentroBuffer
    }
});


// ****************************************************************
// ******************** BOTÓN LIMPIAR CAPAS ***********************

document.getElementById('btnLimpiar').addEventListener('click', function () {
    desactivarNormales();
    desactivarBuffer();
});

// ****************************************************************
// ************************Escala**********************************

var scaleControl = L.control.scale({ imperial: false });
map.addControl(scaleControl);
