#!/bin/sh

mkdir -p json
zcat ../datos/municipios.topojson.gz > json/municipios.topojson
python -m SimpleHTTPServer 8888 &
xdg-open http://localhost:8888/topojson.html
