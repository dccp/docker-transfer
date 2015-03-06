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

_suffixes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'EiB', 'ZiB']

def file_size(size):
    # determine binary order in steps of size 10
    # (coerce to int, // still returns a float)
    order = int(log2(size) / 10) if size else 0
    # format file size
    # (.4g results in rounded numbers for exact matches and max 3 decimals,
    # should never resort to exponent values)
    return '{:.4g} {}'.format(size / (1 << (order * 10)), _suffixes[order])

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
