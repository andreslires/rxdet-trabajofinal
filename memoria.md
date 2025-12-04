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

En esta sección se describirán los paso seguidos para el filtrado y limpieza de los dos archivos con los que se trabajará en el trabajo: *cows_pos.csv* y *fincas.json*.

En primer lugar, se cargó el archivo *cows_pos.csv* en un *DataFrame* de pandas. La columna *time*  se convirtió a tipo *datetime* para facilitar su manipulación. A continuación, se crearon dos *timestamps* que definen el rango temporal de interés: desde el 20 de abril de 2023 hasta el 25 de abril de 2023. Se filtraron las filas del *DataFrame* para conservar únicamente aquellas cuyo valor en la columna *time* se encontraba dentro de este rango. Posteriormente, se eliminaron las filas con valores nulos. Cabe destacar que la única columna espacial era de la forma lat::long, así que comprobamos que todas las filas tuvieran este formato. Luego, comprobamos que la latitud era el primer elemento, ya que la longitud es negativa en Galicia, por lo que si comenzaba por un número negativo, le dábamos la vuelta a los valores. También existían algunos valores cuya longitud comenzaba por -6 (situados aproximadamente por Asturias), en vez de -7, por lo que los modificamos para que comenzaran por -7. Finalmente, creamos las columnas latitud y longitud, y a partir de ellas, convertimos el *DataFrame* en un *GeoDataFrame* de geopandas, utilizando el sistema de referencia EPSG:4326 y creando una columna de puntos de *geometry*, manejables por PostGIS.

En cuanto al segundo archivo, *fincas.json*, se cargó en un *GeoDataFrame* de geopandas directamente, ya que el archivo estaba en formato GeoJSON. Se comprobó que el sistema de referencia era EPSG:4326 y se dividió su contenido en *Polygons* (uno por finca), ya que el archivo original contenía un *MultiPolygon*. A continuación, empleamos la latitud del centroide de cada finca para eliminar aquellas 3 más al sur, quedándonos con 15 fincas de las 18 originales.