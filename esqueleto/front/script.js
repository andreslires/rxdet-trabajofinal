// Capa base
var esriSatLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

// Creación del mapa
var map = L.map('map').setView([43.25, -7.34], 15);
map.addLayer(esriSatLayer);

// Variables para controlar capas
var capaDentro = null;
var capaFuera = null;

// Función para cargar datos desde GeoServer
async function cargarVacas(tipo) {
    const url = `http://localhost:8080/geoserver/RXDET/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=RXDET:vacas_${tipo}&outputFormat=application/json`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const color = tipo === 'dentro' ? 'black' : 'red';
    
    return L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 4,
                fillColor: "white",
                color: color,
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            });
        }
    });
}

// Funciones para mostrar/ocultar capas (toggle)
async function toggleVacasDentro() {
    if (!capaDentro) {
        capaDentro = await cargarVacas('dentro');
    }
    
    if (map.hasLayer(capaDentro)) {
        map.removeLayer(capaDentro);
    } else {
        capaDentro.addTo(map);
    }
    ajustarVista();
}

async function toggleVacasFuera() {
    if (!capaFuera) {
        capaFuera = await cargarVacas('fuera');
    }
    
    if (map.hasLayer(capaFuera)) {
        map.removeLayer(capaFuera);
    } else {
        capaFuera.addTo(map);
    }
    ajustarVista();
}

function limpiarMapa() {
    if (capaDentro && map.hasLayer(capaDentro)) map.removeLayer(capaDentro);
    if (capaFuera && map.hasLayer(capaFuera)) map.removeLayer(capaFuera);
}

// Ajustar vista para mostrar todas las capas visibles
function ajustarVista() {
    const group = new L.FeatureGroup();
    
    if (capaDentro && map.hasLayer(capaDentro)) group.addLayer(capaDentro);
    if (capaFuera && map.hasLayer(capaFuera)) group.addLayer(capaFuera);
    
    if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds());
    }
}

// Eventos de botones
document.getElementById('btnDentro').addEventListener('click', toggleVacasDentro);
document.getElementById('btnFuera').addEventListener('click', toggleVacasFuera);
document.getElementById('btnLimpiar').addEventListener('click', limpiarMapa);

// Escala métrica
L.control.scale({ imperial: false }).addTo(map);