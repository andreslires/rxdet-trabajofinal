// ****************************************************************
// *****************Inicialización y capas base********************

const map = L.map('map')
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
map.setView([43.253, -7.34], 16);

// A PARTIR DE AQUI, MODIFICAR EL CÓDIGO

// ****************************************************************
// **************VACAS: Dentro y fuera de las fincas***************

// Se cargan desde un servidor propio
async function load_geom(type_of_cows){
    let url = `http://localhost:8000/geoms/${type_of_cows}`;
    const response = await fetch(url)
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

    // Funciones para asignar los iconos según el deviceName
    function marcadorVacaA(feature, latlng) {
        return L.marker(latlng, { icon: vacaAIcon });
    }

    function marcadorVacaB(feature, latlng) {
        return L.marker(latlng, { icon: vacaBIcon });
    }

    function styleCow(feature, latlng) {
        // Si la primera letra de deviceName es A, usar vacaAIcon
        if (feature.properties.deviceName.startsWith('A')) {
            return marcadorVacaA(feature, latlng);
        // Si la primera letra de deviceName es B, usar vacaBIcon
        } else if (feature.properties.deviceName.startsWith('B')) {
            return marcadorVacaB(feature, latlng);
        }
    }

    // Popup que muestre el deviceName
    function popupVaca(feature, layer) {
        var contenidoPopup = '<p>DeviceName: <b>' + feature.properties.deviceName + '</b></p>';
        layer.bindPopup(contenidoPopup);
    }

    // Cargar las geometrías con la función anterior (load_geom) y crear las capas
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

    // Cluster para vacas dentro
    var vacas_dentro_cluster = L.markerClusterGroup();
    vacas_dentro_cluster.addLayer(vacas_dentro_layer);

    // Cluster para vacas fuera
    var vacas_fuera_cluster = L.markerClusterGroup();
    vacas_fuera_cluster.addLayer(vacas_fuera_layer);

    // Añadir botones
    // Botón Vacas Dentro
    document.getElementById('btnDentro').addEventListener('click', function() {
        if (map.hasLayer(vacas_dentro_cluster)) {
            map.removeLayer(vacas_dentro_cluster);
        } else {
            map.addLayer(vacas_dentro_cluster);
        }
    });

    // Botón Vacas Fuera
    document.getElementById('btnFuera').addEventListener('click', function() {
        if (map.hasLayer(vacas_fuera_cluster)) {
            map.removeLayer(vacas_fuera_cluster);
        } else {
            map.addLayer(vacas_fuera_cluster);
        }
    });

    // Botón Limpiar Capas
    document.getElementById('btnLimpiar').addEventListener('click', function() {
        if (map.hasLayer(vacas_dentro_cluster)) {
            map.removeLayer(vacas_dentro_cluster);
        }
        if (map.hasLayer(vacas_fuera_cluster)) {
            map.removeLayer(vacas_fuera_cluster);
        }
    });

}

main();
