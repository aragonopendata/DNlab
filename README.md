DNlab
=====

El presente trabajo se compone de varias visualizaciones interactivas que ilustran la evolución de la población y del alumnado en Aragón durante la última década. A través de las herramientas [Google Fusion Tables](http://tables.googlelabs.com), [CartoDB](http://cartodb.com/), [Google Maps](http://maps.google.com), [MapQuest](http://developer.mapquest.com/), [D3.js](http://d3js.org/) y [C3.js](http://c3js.org/), se realizaron fusiones de datos y proyecciones que permiten detallar la información de la Comunidad Autónoma por comarcas y año, comprendidos entre 2004 y 2013.

La recopilación de datos se realizó de diversos recursos, principalmente de Aragón Open Data, el Instituto Aragonés de Estadísticas, el portal www.demografia.zaragoza.es y el Patronato Municipal de Educación y Bibliotecas de Zaragoza.

El equipo de DN Lab está compuesto por:

* Alberto Labarga (desarrollador)
* Antonio García Domínguez (desarrollador)
* Leila Chivite (socióloga)
* Ramaris Albert (periodista)

Generación de TopoJSON
----------------------

Para convertir a TopoJSON los ficheros `.shp`, se puede usar el guión `datos/generar_topojson.sh`. Esto genera un solo fichero `aragon.topojson.gz` que contiene todas las divisones del territorio de Aragón en formato TopoJSON, listas para ser usadas por D3.js.
