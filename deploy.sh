#!/bin/sh

IP=155.210.71.92

subir() {
    rsync --exclude '#*' --exclude '*~' -rvz "$1" JacatonUser@$IP:/var/www/jacaton/
}

subir vizlab
subir crossfilter
subir micromaps



