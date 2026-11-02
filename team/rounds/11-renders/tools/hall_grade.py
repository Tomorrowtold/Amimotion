"""Grade round 11 hall renders exactly as 08-pictures/tools/hall_stills.py cut does: the film's grade
(03-hero-film/grade_film.py) with the Sky Ground gain (sky/gain-sky.txt), floor = #f0f6ff.
    python3 hall_grade.py <raw.png> <graded.png> [...pairs]"""
import sys, os
import numpy as np
FILM = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../03-hero-film'))
sys.path.insert(0, FILM); os.environ['HALL_GROUND'] = '#f0f6ff'
import grade_film
g = np.loadtxt(os.path.join(FILM, 'sky/gain-sky.txt')).astype(np.float32)
a = sys.argv[1:]
for src, dst in zip(a[::2], a[1::2]):
    grade_film.grade(src, dst, g); print('graded', dst)
