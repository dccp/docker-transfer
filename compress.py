import argparse
import os
import subprocess

def main():
    parser = argparse.ArgumentParser(description='Compress directory with Dockerfile')
    parser.add_argument('-o', '--output', nargs='?', default='output')
    parser.add_argument('input', nargs='?')
    args = parser.parse_args()
    dockerfile = args.input + '/Dockerfile'
    if os.path.exists(dockerfile):
        print("File exists: {0}".format(dockerfile))
        command = ['tar', 'czf', args.output + '.tar.gz', args.input]
        # print(' '.join(command))
        subprocess.Popen(command)
    else:
        print("Error: Directory does not contain Dockerfile")

if __name__ == '__main__':
    main()
