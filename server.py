import argparse
import socket
import zlib
from tempfile import TemporaryFile
import helpers
from io import BytesIO

READ_SIZE = 1024

def main():
    parser = argparse.ArgumentParser(description='Server for docker-transfer service')
    parser.add_argument('-H', '--host', nargs='?', default='0.0.0.0')
    parser.add_argument('-p', '--port', nargs='?', default=1208)
    parser.add_argument('filename', nargs='?', default='recieved')
    parser.add_argument('-v', '--verbose', action='store_true')
    parser.set_defaults(verbose=True)
    args = parser.parse_args()

    server = socket.socket()
    server.bind((args.host, args.port))
    server.listen(10)
    if args.verbose:
        print("Listening on {}:{}".format(args.host, args.port))
    i = 0


    try:
        while True:
            i += 1
            sc, address = server.accept()
            if args.verbose:
                print("Client connected: {}".format(address))
            line = sc.recv(READ_SIZE)
            #handle = open(args.filename + str(i), 'wb')
            bufferer = BytesIO()
            decompressor = zlib.decompressobj()
            j = 0
            while line:
                j += 1
                if args.verbose:
                    print("Recieved {}                   \r".format(helpers.sizeof_fmt(READ_SIZE * j)), end="")
                decompressed = decompressor.decompress(line)
                if decompressed:
                    bufferer.write(decompressed)
                line = sc.recv(READ_SIZE)

            derp = open(args.filename + str(i), 'wb')
            derp.write(bufferer.getvalue())
            sc.close()
            if args.verbose:
                print("Client disconnected: {}".format(address))

        server.close()
    finally:
        sc.close()
        server.close()


if __name__ == "__main__":
    main()
