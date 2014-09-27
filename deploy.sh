#!/bin/sh

IP=155.210.71.92

rsync --exclude '#*' --exclude '*~' -rvz vizlab JacatonUser@$IP:/var/www/jacaton/
