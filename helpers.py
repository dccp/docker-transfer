import argparse
import os
import subprocess
import hashlib
from enum import Enum
from math import log2

def compress_file(input, output):
    parser = argparse.ArgumentParser(description='Compress directory with Dockerfile')
    parser.add_argument('-o', '--output', nargs='?', default='output')
    parser.add_argument('input', nargs='?')
    args = parser.parse_args()
    dockerfile = args.input + '/Dockerfile'
    if os.path.exists(dockerfile):
        print("File exists: {}".format(dockerfile))
        command = ['tar', 'czf', args.output + '.tar.gz', args.input]
        # print(' '.join(command))
        subprocess.Popen(command)
    else:
        print("Error: Directory does not contain Dockerfile")

def hashtuple(fname, handle):
    return (fname, hashfile(handle, hashlib.md5()))

def hashfile(afile, hasher, blocksize=65536):
    buf = afile.read(blocksize)
    while len(buf) > 0:
        hasher.update(buf)
        buf = afile.read(blocksize)
    return hasher.digest()

def sizeof_fmt(num, suffix='B'):
    for unit in ['','Ki','Mi','Gi','Ti','Pi','Ei','Zi']:
        if abs(num) < 1024.0:
            return "%3.1f%s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, 'Yi', suffix)

class MessageType(Enum):
    VERIFICATION = 0
    CONTAINER = 1

class Message():
    def __init__(self, data, header):
        self.message_type = message_type
        self.header = header
        self.data = data

    def handle(self):
        pass


class VerificationMessage(Message):
    def __init__(self, data): # if data is boolean -> answer, else md5(string) -> request
        super().__init__(MessageType.VERIFICATION)

    def handle(self):
        pass

class ContainerMessage(Message):
    def __init__(self, header, data):
        super().__init__(MessageType.CONTAINER)

    def handle(self):
        pass
