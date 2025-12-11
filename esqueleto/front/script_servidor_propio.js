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
    format: 'image/png',
    transparent: true,
    zIndex: 1,
    version: '1.3.0',
    crs: L.CRS.EPSG3857,
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

    // Iconos personalizados
    var vacaAIcon = L.icon({
        iconUrl: 'imagenes/vacaA.png',
        iconSize: [41, 30],
    });

    var vacaBIcon = L.icon({
        iconUrl: 'imagenes/vacaB.png',
        iconSize: [41, 30],
    });

    // Funciones de icono
    function marcadorVacaA(feature, latlng) {
        return L.marker(latlng, { icon: vacaAIcon });
    }
    function marcadorVacaB(feature, latlng) {
        return L.marker(latlng, { icon: vacaBIcon });
    }

    // Estilo según el deviceName
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

    // Datos desde servidor propio (llamando a la función load_geom definida arriba)
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

    // Cluster
    var vacas_dentro_cluster = L.markerClusterGroup();
    vacas_dentro_cluster.addLayer(vacas_dentro_layer);

    var vacas_fuera_cluster = L.markerClusterGroup();
    vacas_fuera_cluster.addLayer(vacas_fuera_layer);

    // ****************************************************************
    // ********************Funciones auxiliares************************

    function normalesActivas() {
        return map.hasLayer(vacas_dentro_cluster) || map.hasLayer(vacas_fuera_cluster);
    }

    function desactivarNormales() {
        if (map.hasLayer(vacas_dentro_cluster)) map.removeLayer(vacas_dentro_cluster);
        if (map.hasLayer(vacas_fuera_cluster)) map.removeLayer(vacas_fuera_cluster);
    }

    // ****************************************************************
    // ***************** BOTONES DE CAPAS NORMALES *********************

    document.getElementById('btnDentro').addEventListener('click', function () {
        if (map.hasLayer(vacas_dentro_cluster)) {
            map.removeLayer(vacas_dentro_cluster);
        } else {
            map.addLayer(vacas_dentro_cluster);
        }
    });

    document.getElementById('btnFuera').addEventListener('click', function () {
        if (map.hasLayer(vacas_fuera_cluster)) {
            map.removeLayer(vacas_fuera_cluster);
        } else {
            map.addLayer(vacas_fuera_cluster);
        }
    });

    // ****************************************************************
    // ******************** BOTÓN LIMPIAR CAPAS ***********************

    document.getElementById('btnLimpiar').addEventListener('click', function () {
        desactivarNormales();
    });

}

main();

// ****************************************************************
// ************************Escala**********************************

var scaleControl = L.control.scale({ imperial: false });
map.addControl(scaleControl);
