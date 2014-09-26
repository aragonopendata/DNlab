DNlab
=====

Para ver en local los experimentos en `vizlab` en un sistema UNIX, se
pueden ejecutar los .sh que hay con el mismo nombre.

Para convertir a TopoJSON los ficheros `.shp`, se pueden usar estas
órdenes:

    cd datos
    sudo apt-get install gdal-bin
    npm install topojson
    ogr2ogr -f GeoJSON -s_srs T02_Municipios.prj -t_srs EPSG:4326 fichero.geojson fichero.shp
    ... repetir con los .shp ...
    ../node_modules/topojson/bin/topojson -o aragon.topojson -- \
      provincias.geojson comarcas.geojson aragon.geojson municipios.geojson
    gzip -9 aragon.topojson

Esto genera un solo fichero `aragon.topojson.gz` que contiene todas
las divisones del territorio de Aragón en formato TopoJSON, listas
para ser usadas por D3.js.
