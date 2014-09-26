#!/usr/bin/python
# -*- encoding: utf-8 -*-
"""Genera colegios.json, combinando datos de Google Maps y MapQuest."""

import csv, codecs, cStringIO
import json

# Leemos el fichero de Google Maps
gmaps = {}
with open("colegiosConGeocodeGMaps.csv") as f_gmaps:
    gmaps_csv = csv.DictReader(f_gmaps)
    for row in gmaps_csv:
        fila = {
            "lat": row["lat"],
            "lng": row["lng"],
            "tipo": row["type"],
            "parcial": row["partial_match"],
            "direccion": row["formatted_address"],
            "nombre_largo": row["long_name"],
            "nombre_corto": row["short_name"],
            "tipo_c": row["DENOMINACION GENÉRICA"],
            "nombre_c": row["DENOMINACION ESPECÍFICA"],
        }
        gmaps[row["CÓDIGO"]] = fila

# Leemos el fichero de MapQuest
mapquest = {}
with open("colegiosConGeocodeMapQuest.csv") as f_mq:
    mq_csv = csv.DictReader(f_mq)
    for row in mq_csv:
        fila = {
            "lat": row["lat"],
            "lng": row["lng"],
            "tipo": row["geocodeQuality"],
            "direccion": ", ".join(
                row[x] for x in (
                    "street", "adminArea6", "adminArea5",
                    "adminArea4", "adminArea3", "postalCode"
                )),
            "tipo_c": row["DENOMINACION GENÉRICA"],
            "nombre_c": row["DENOMINACION ESPECÍFICA"],
        }
        mapquest[row["CÓDIGO"]] = fila

# Ahora tratamos de combinar

codigos = set(gmaps.keys()).union(mapquest.keys())
unidos = []
for codigo in codigos:
    if codigo in gmaps:
        row = gmaps[codigo]
        lat, lng, tipo, nombre = row["lat"], row["lng"], row["tipo_c"], row["nombre_c"]
    else:
        row = mapquest[codigo]
        lat, lng, tipo, nombre = row["lat"], row["lng"], row["tipo_c"], row["nombre_c"]

    unidos.append({
        "key": codigo,
        "lat": float(lat),
        "lng": float(lng),
        "tipo_c": tipo,
        "nombre_c": nombre
    })

print json.dumps(unidos)
