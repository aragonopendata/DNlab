#!/bin/sh

geojson() {
  ogr2ogr -f GeoJSON -s_srs "$1" -t_srs EPSG:4326 "$2" "$3"
}

topojson() {
  TOPOJSON="$1"
  shift
  ../node_modules/topojson/bin/topojson -p -o "$TOPOJSON" -- $@
}

unzip -o municipios.aragon.shp.zip
unzip -o municipios_comarcas.shp.zip

rm -f aragon.geojson provincias.geojson comarcas.geojson municipios.geojson

geojson T02_Municipios.prj aragon.geojson aragon.shp
geojson T02_Municipios.prj provincias.geojson provincias.shp
zcat t02_comarcas.geojson.gz > comarcas.geojson
geojson T02_Municipios.prj municipios.geojson T02_Municipios.shp

topojson aragon.topojson \
  aragon.geojson provincias.geojson comarcas.geojson municipios.geojson

gzip -9 aragon.topojson
