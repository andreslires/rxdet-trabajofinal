# RXDET - Trabajo final

**Autores:** Andrés Lires Saborido, Ángel Vilariño García

**Curso:** 2025-2026

---

## Estructura de la práctica

El contenido de la entrega se organiza en la siguiente estructura de carpetas y archivos:

```
Andres_Lires_Angel_Vilarino/
├── esqueleto/
│   ├── back/
│   │   ├── routers/
│   │   │   ├── geometrias.py
│   │   ├── consultas.sql
│   │   ├── main.py
│   ├── front/
│   │   ├── imagenes/
│   │   │   ├── ...
│   │   ├── estilo.css
│   │   ├── mapa.html
│   │   ├── script_geoserver.js
│   │   ├── script_servidor_propio.js
├── preprocess.ipynb
├── memoria.pdf
└── README.md
```

Para más información sobre la implementación, consulte el archivo `memoria.pdf`.

## Instrucciones de ejecución

### Configuración inicial

Toda la práctica ha sido desarrollada y ejecutada utilizando el entorno virtual GEOPANDAS25 e 
instalando las librerías necesarias conforme se ha ido avanzando.

Los archivos `fincas.json`y `cows_pos.csv` no se han adjuntado en la entrega. En caso de querer recrear el proceso completo se deben situar en una carpeta `archivos/` dentro del directorio raíz. Con la ejecución de las celdas del *Notebook* `preprocess.ipynb` se generarán los archivos correspondientes a las limpiezas y transformaciones.

### Visor utilizando GeoServer

Para ejecutar el visor utilizando GeoServer, es necesario tener instalado Geoserver y activarlo tal y como se indica:

- Ejecutar el archivo *startup.sh de GeoServer* en caso de macOS
- En *Windows* con el comando `net start geoserver`.

Una vez activo, se debe acceder al archivo `mapa.html` y descomentar el bloque que hace referencia al `script_geoserver.js`. 

Al abrir el archivo `mapa.html` en un navegador, se podrá visualizar el mapa con las capas cargadas desde GeoServer.

**Nota:** Los estilos de *vacas_dentro* y *vacas_fuera* deben estar previamente definidos en GeoServer (como se explica en la memoria) para que se visualicen tal y como se espera.

### Visor utilizando un servidor propio

Para ejecutar el visor utilizando un servidor propio, debemos situarnos en la carpeta `esqueleto/back/` y ejecutar el siguiente comando:

```bash
uvicorn main:app --reload
```

Esto iniciará el servidor y solamente quedará acceder al archivo `mapa.html` y descomentar el bloque que hace referencia al `script_servidor_propio.js`.

Al abrir el archivo `mapa.html` en un navegador, se podrá visualizar el mapa con las capas cargadas desde el servidor propio.

## Interacción con el visor

El visor permite en la esquina superior derecha seleccionar el mapa base entre los siguientes:

- Vista satélite
- Mapa de Fontán

En el lateral izquierdo de la pantalla, se encuentran los controles para activar o desactivar las diferentes capas:

- Vacas dentro de las fincas.
- Vacas fuera de las fincas.
- Vacas dentro de las fincas (con un buffer de 15 metros).
- Vacas fuera de las fincas (con un buffer de 15 metros).
- Limpiar vacas.

Según si se está utilizando GeoServer o un servidor propio, la representación será directamente de los puntos o en el caso del servidor propio, con un clustering para mejorar la visualización.





