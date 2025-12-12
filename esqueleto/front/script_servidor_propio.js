// ****************************************************************
// *****************Inicialización y capas base********************

const esriSatLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
);

const map = L.map('map');
map.setView([43.253, -7.34], 16);
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

async function load_geom(type_of_cows){
    let url = `http://localhost:8000/geoms/${type_of_cows}`;
    const response = await fetch(url);
    const my_geom = await response.json();
    return my_geom;
}

async function main(){

    // Iconos personalizados para las vacas
    var vacaAIcon = L.icon({
        iconUrl: 'imagenes/vacaA.png',
        iconSize: [41, 30],
    });

    var vacaBIcon = L.icon({
        iconUrl: 'imagenes/vacaB.png',
        iconSize: [41, 30],
    });

    // Funciones para asignar iconos según el tipo de vaca
    function marcadorVacaA(feature, latlng) {
        return L.marker(latlng, { icon: vacaAIcon });
    }

    function marcadorVacaB(feature, latlng) {
        return L.marker(latlng, { icon: vacaBIcon });
    }

    function styleCow(feature, latlng) {
        if (feature.properties.deviceName.startsWith('A')) {
            return marcadorVacaA(feature, latlng);
        } else if (feature.properties.deviceName.startsWith('B')) {
            return marcadorVacaB(feature, latlng);
        }
    }

    // Popup con el DeviceName
    function popupVaca(feature, layer) {
        var contenidoPopup = '<p>DeviceName: <b>' + feature.properties.deviceName + '</b></p>';
        layer.bindPopup(contenidoPopup);
    }

    // Datos desde el servidor propio (llamando a la función load_geom definida arriba)

    //  Vacas dentro y fuera de las fincas
    const vacas_dentro_geom = await load_geom("vacas_dentro");
    var vacas_dentro_layer = L.geoJson(vacas_dentro_geom, {
        onEachFeature: popupVaca,
        pointToLayer: styleCow
    });

    const vacas_fuera_geom = await load_geom("vacas_fuera");
    var vacas_fuera_layer = L.geoJson(vacas_fuera_geom, {
        onEachFeature: popupVaca,
        pointToLayer: styleCow
    });

    // Vacas dentro y fuera con buffer
    const vacas_dentro_buffer_geom = await load_geom("vacas_dentro_buffer");
    var vacas_dentro_buffer_layer = L.geoJson(vacas_dentro_buffer_geom, {
        onEachFeature: popupVaca,
        pointToLayer: styleCow
    });

    const vacas_fuera_buffer_geom = await load_geom("vacas_fuera_buffer");
    var vacas_fuera_buffer_layer = L.geoJson(vacas_fuera_buffer_geom, {
        onEachFeature: popupVaca,
        pointToLayer: styleCow
    });

    // Clústeres para las capas de vacas
    var vacas_dentro_cluster = L.markerClusterGroup();
    vacas_dentro_cluster.addLayer(vacas_dentro_layer);

    var vacas_fuera_cluster = L.markerClusterGroup();
    vacas_fuera_cluster.addLayer(vacas_fuera_layer);

    var vacas_dentro_buffer_cluster = L.markerClusterGroup();
    vacas_dentro_buffer_cluster.addLayer(vacas_dentro_buffer_layer);

    var vacas_fuera_buffer_cluster = L.markerClusterGroup();
    vacas_fuera_buffer_cluster.addLayer(vacas_fuera_buffer_layer);

    // ****************************************************************
    // ********************Funciones auxiliares************************

    function normalesActivas() {
        return map.hasLayer(vacas_dentro_cluster) || map.hasLayer(vacas_fuera_cluster);
    }

    function bufferActivas() {
        return map.hasLayer(vacas_dentro_buffer_cluster) || map.hasLayer(vacas_fuera_buffer_cluster);
    }

    function desactivarNormales() {
        if (map.hasLayer(vacas_dentro_cluster)) map.removeLayer(vacas_dentro_cluster);
        if (map.hasLayer(vacas_fuera_cluster)) map.removeLayer(vacas_fuera_cluster);
    }

    function desactivarBuffer() {
        if (map.hasLayer(vacas_dentro_buffer_cluster)) map.removeLayer(vacas_dentro_buffer_cluster);
        if (map.hasLayer(vacas_fuera_buffer_cluster)) map.removeLayer(vacas_fuera_buffer_cluster);
    }

    // ****************************************************************
    // ***************** BOTONES DE CAPAS NORMALES *********************

    document.getElementById('btnDentro').addEventListener('click', function () {
        if (bufferActivas()){
            alert("Primero desactiva las capas buffer o pulsa Limpiar Capas.");
            return;
        }
        if (map.hasLayer(vacas_dentro_cluster)) map.removeLayer(vacas_dentro_cluster);
        else map.addLayer(vacas_dentro_cluster);
    });

    document.getElementById('btnFuera').addEventListener('click', function () {
        if (bufferActivas()) {
            alert("Primero desactiva las capas buffer o pulsa Limpiar Capas.");
            return;
        }
        if (map.hasLayer(vacas_fuera_cluster)) map.removeLayer(vacas_fuera_cluster);
        else map.addLayer(vacas_fuera_cluster);
    });

    // ****************************************************************
    // **************** BOTONES DE CAPAS BUFFER ************************

    document.getElementById('btnDentroBuffer').addEventListener('click', function () {
        if (normalesActivas()) {
            alert("Primero desactiva las capas normales o pulsa Limpiar Capas.");
            return;
        }
        if (map.hasLayer(vacas_dentro_buffer_cluster)) map.removeLayer(vacas_dentro_buffer_cluster);
        else map.addLayer(vacas_dentro_buffer_cluster);
    });

    document.getElementById('btnFueraBuffer').addEventListener('click', function () {
        if (normalesActivas()) {
            alert("Primero desactiva las capas normales o pulsa Limpiar Capas.");
            return;
        }
        if (map.hasLayer(vacas_fuera_buffer_cluster)) map.removeLayer(vacas_fuera_buffer_cluster);
        else map.addLayer(vacas_fuera_buffer_cluster);
    });

    // ****************************************************************
    // ******************** BOTÓN LIMPIAR CAPAS ***********************

    document.getElementById('btnLimpiar').addEventListener('click', function () {
        desactivarNormales();
        desactivarBuffer();
    });

}

main();

// ****************************************************************
// ************************Escala**********************************

var scaleControl = L.control.scale({ imperial: false });
map.addControl(scaleControl);
