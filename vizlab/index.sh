#!/bin/sh

mkdir -p json
zcat ../datos/aragon.topojson.gz > json/aragon.topojson
cp ../datos/geocodes/colegios.json json
cp ../datos/crecimiento_poblacion_comarca.json json
cp ../datos/alumnado_por_comarcas.json json
python -m SimpleHTTPServer 8888 &
xdg-open http://localhost:8888/index.html
