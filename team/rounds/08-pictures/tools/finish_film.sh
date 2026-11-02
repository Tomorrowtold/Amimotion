#!/bin/bash
# Grade, encode and publish the Sky Ground hero film once frames_raw_sky/ holds all 225 frames.
set -e
F=/home/user/amimotion/team/rounds/03-hero-film; OUT=/home/user/amimotion/site/src/assets/home/hero-film
cd $F
n=$(ls frames_raw_sky/f0*.png | grep -v tmp | wc -l); [ "$n" -eq 225 ] || { echo "only $n frames"; exit 1; }
export HALL_GROUND=#f0f6ff
cp sky/gain-sky.txt gain.txt
python3 grade_film.py frames frames_raw_sky frames_sky
python3 make_film.py film frames_sky film_sky
python3 make_film.py sheet frames_sky sky/contact-sheet.jpg
mkdir -p $OUT; cp film_sky/hall-*.mp4 $OUT/
ls -la $OUT/*.mp4
