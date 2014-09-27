Visualización habitantes + estudiantes de Aragón
================================================

Este directorio contiene una visualización del número de habitantes (nacionales y extranjeros) y del número de estudiantes (por titularidad de los estudios) en la Comunidad de Aragón.

Funcionamiento
--------------

Inicialmente, la visualización muestra los totales para todo Aragón, y se puede pulsar en una comarca concreta para filtrar los datos. Pulsando en el fondo blanco del mapa se vuelve a los totales de Aragón.

En un sistema UNIX con Python 2.7 instalado, se puede ejecutar `./index.sh` para copiar los ficheros de datos a su sitio, abrir un pequeño servidor web y abrir el navegador preferido con la visualización.

Biblioteca JS
-------------

La visualización tiene una pequeña biblioteca (`js/mapa-generico.js`) que se puede usar en combinación con el [TopoJSON](https://github.com/mbostock/topojson) de Aragón de este proyecto para generar mapas estáticos de Aragón. Se pueden hacer mapas a nivel de comunidad, provincia, comarca o municipio. Para más detalles, se puede consultar el fichero .js.

Créditos
--------

La primera versión de esta visualización fue desarrollada durante el [Jacathon 2014](http://opendata.aragon.es/portal/jacathon), entre los integrantes del equipo DNlab:

* Antonio García
* Ramaris Albert
* Leyla Chivite
* Alberto Labarga

