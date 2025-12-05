---
title: "Memoria Trabajo Final RXDET"
author: "Andrés Lires Saborido y Ángel Vilariño García"
date: "Curso 2025-2026"
geometry: margin=3cm
fontsize: 12pt
papersize: a4
header-includes:
  - \renewcommand\contentsname{Contenidos}
  - \renewcommand\tablename{Tabla}
  - \renewcommand\figurename{Figura}
---

\tableofcontents
\newpage

# Filtrado y limpieza de datos

En esta sección se describirán los pasos seguidos para el filtrado y limpieza de los dos archivos con los que se trabajará en la práctica: *cows_pos.csv* y *fincas.json*.

En primer lugar, se cargó el archivo *cows_pos.csv* en un *DataFrame* de pandas. La columna *time*  se convirtió a tipo *datetime* para facilitar su manipulación. A continuación, se crearon dos *timestamps* que definen el rango temporal de interés: desde el 20 de abril de 2023 hasta el 25 de abril de 2023. Se filtraron las filas del *DataFrame* para conservar únicamente aquellas cuyo valor en la columna *time* se encontraba dentro de este rango. Posteriormente, se eliminaron las filas con valores nulos. Cabe destacar que la única columna espacial era de la forma lat::long, así que comprobamos que todas las filas tuvieran este formato. Luego, comprobamos que la latitud era el primer elemento, ya que la longitud es negativa en Galicia, por lo que si comenzaba por un número negativo, le dábamos la vuelta a los valores. También existían algunos valores cuya longitud comenzaba por -6 (situados aproximadamente en Asturias), en vez de -7, por lo que los modificamos para que comenzaran por -7. Finalmente, creamos las columnas latitud y longitud, y a partir de ellas, convertimos el *DataFrame* en un *GeoDataFrame* de geopandas, utilizando el sistema de referencia EPSG:4326 y creando una columna de puntos de *geometry*, manejables por PostGIS.

En cuanto al segundo archivo, *fincas.json*, se cargó en un *GeoDataFrame* de geopandas directamente, ya que el archivo estaba en formato GeoJSON. Se comprobó que el sistema de referencia era EPSG:4326 y se dividió su contenido en *Polygons* (uno por finca), ya que el archivo original contenía un *MultiPolygon*. A continuación, empleamos la latitud del centroide de cada finca para eliminar aquellas 3 más al sur, quedándonos con 15 fincas de las 18 originales.

# Carga de datos en la BD

Para la carga de datos de las dos tablas en la base de datos PostGIS, existían varias opciones como usar QGIS, crear el esquema de la base de datos y cargar los datos directamente en DBeaver, o cargarlos mediante comandos en la terminal. Se optó por la solución que a priori parecía más sencilla y rápida: cargar los datos mediante un *script* en *Python*.

Para realizar dicha carga, se utilizó la librería *SQLAlchemy* para gestionar la conexión con la base de datos. En primer lugar, se creó un motor de conexión utilizando la función *create_engine*, proporcionando la URL de conexión a la base de datos. A continuación, se empleó el método *to_postgis* de geopandas para cargar los *GeoDataFrames* previamente creados en la base de datos. Este método permite especificar el nombre de la tabla destino, el motor de conexión y la opción de reemplazar la tabla existente. A continuación, se realizó una comprobación empleando la función *read_postgis* de geopandas para asegurarse de que el número de filas y columnas en las tablas de la base de datos coincidía con el número de filas y columnas en los *GeoDataFrames* originales.