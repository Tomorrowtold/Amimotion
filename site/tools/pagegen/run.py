"""Write every inner page into src/pages. Run from anywhere: python3 tools/pagegen/run.py"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import p_platform, p_solutions, p_learn, p_company, p_eval  # noqa: E401,F401  (order sets the picture numbers)
