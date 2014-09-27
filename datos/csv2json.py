#!/usr/bin/python
# -*- encoding: utf-8 -*-

# Pequeña utilidad que convierte un CSV a JSON.
# Si un campo acaba en _i, lo pasa a entero.

from csv import DictReader
import json


def convertir(ruta):
  with open(ruta) as f_csv:
    csv = DictReader(f_csv)
    json = []
    for row in csv:
      for k, v in row.items():
        if k.endswith("_i"):
          row[k] = int(v)
      json.append(row)
    return json


if __name__ == "__main__":
  import sys

  if len(sys.argv) != 2:
    print >> sys.stderr, 'Uso: {0} f.csv'.format(sys.argv[0])
    sys.exit(1)

  s_csv = sys.argv[1]
  print json.dumps(convertir(s_csv), indent=4)

