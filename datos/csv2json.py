#!/usr/bin/python
# -*- encoding: utf-8 -*-

from csv import DictReader
import json


def convertir(ruta):
  with open(ruta) as f_csv:
    csv = DictReader(f_csv)
    json = []
    for row in csv:
      json.append(row)
    return json


if __name__ == "__main__":
  import sys

  if len(sys.argv) != 2:
    print >> sys.stderr, 'Uso: {0} f.csv'.format(sys.argv[0])
    sys.exit(1)

  s_csv = sys.argv[1]
  print json.dumps(convertir(s_csv), indent=4)

