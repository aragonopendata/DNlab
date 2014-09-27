#!/usr/bin/python
# -*- encoding: utf-8 -*-
"""Genera colegios.json, combinando datos de Google Maps y MapQuest."""

import csv, codecs, cStringIO
import json

# Leemos el fichero de comarcas
comarcas = {}
with open("../poblaciones_por_comarca.csv") as f_com:
    com_csv = csv.DictReader(f_com)
    for row in com_csv:
        comarcas[row["localidad"]] = {"c_comarca": row["c_comarca"], "d_comarca": row["d_comarca"]}

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
            "direccion_cruda": ", ".join(row[x] for x in ("DOMICILIO", "LOCALIDAD", "PROVINCIA", "CODPOSTAL")),
            "provincia": row["PROVINCIA"],
            "localidad": row["LOCALIDAD"],
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
            "direccion_cruda": ", ".join(row[x] for x in ("DOMICILIO", "LOCALIDAD", "PROVINCIA", "CODPOSTAL")),
            "provincia": row["PROVINCIA"],
            "localidad": row["LOCALIDAD"],
        }
        mapquest[row["CÓDIGO"]] = fila

# Ahora tratamos de combinar

codigos = set(gmaps.keys()).union(mapquest.keys())
unidos = []
for codigo in codigos:
    if codigo in gmaps:
        row = gmaps[codigo]
        lat, lng, tipo, nombre, addr, addr_r, src, quality, prov, loc = (
            row["lat"], row["lng"], row["tipo_c"], row["nombre_c"],
            row["direccion"], row["direccion_cruda"], "GMaps", row["tipo"],
            row["provincia"], row["localidad"]
        )
    else:
        row = mapquest[codigo]
        lat, lng, tipo, nombre, addr, addr_r, src, quality, prov, loc = (
            row["lat"], row["lng"], row["tipo_c"], row["nombre_c"],
            row["direccion"], row["direccion_cruda"], "MapQuest", row["tipo"],
            row["provincia"], row["localidad"]
        )

    unidos.append({
        "key": codigo,
        "lat": float(lat),
        "lng": float(lng),
        "tipo_c": tipo,
        "nombre_c": nombre,
        "direccion": addr,
        "direccion_cruda": addr_r,
        "origen": src,
        "calidad": quality,
        "provincia": prov,
        "localidad": loc,
        "c_comarca": comarcas[loc]["c_comarca"],
        "d_comarca": comarcas[loc]["d_comarca"],
    })

print json.dumps(unidos, indent=4)
