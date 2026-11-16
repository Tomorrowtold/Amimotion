import sys, runpy, os
sys.argv = ['plant.py', '--'] + sys.argv[1:]
runpy.run_path(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'plant.py'), run_name='__main__')
