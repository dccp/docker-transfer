import argparse
import os
import subprocess

def main():
    parser = argparse.ArgumentParser(description='Compress directory with Dockerfile')
    parser.add_argument('-o', '--output', nargs=1, default='output')
    parser.add_argument('input', nargs='?')
    args = parser.parse_args()
    dockerfile = args.input + '/Dockerfile'
    if os.path.exists(dockerfile):
        print("File exists: {0}".format(dockerfile))
        if isinstance(args.output, list):
            output = args.output[0]
        else:
            output = args.output
        command = ['tar', 'czf', output + '.tar.gz', args.input]
        # print(' '.join(command))
        subprocess.Popen(command)
    else:
        print("Error: Directory does not contain Dockerfile")

if __name__ == '__main__':
    main()
