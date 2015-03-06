import argparse
import socket
import helpers
import zlib
from docker import Client

READ_SIZE = 1024


def main():
    parser = argparse.ArgumentParser(description='Send work to Zeppelin network')
    parser.add_argument('-H', '--host', nargs='?', default='localhost')
    parser.add_argument('-p', '--port', nargs='?', type=int, default=1208)
    parser.add_argument('image_hash', nargs='?')
    parser.add_argument('-v', '--verbose', action='store_true')
    parser.set_defaults(verbose=True)
    args = parser.parse_args()

    sock = socket.socket()
    dock = Client(timeout=3600)
    compressor = zlib.compressobj()
    sock.connect((args.host, args.port))
    if args.verbose:
        print("Connected on {}:{}".format(args.host, args.port))

    try:
        if args.verbose:
            print("Reading file \"{}\"".format(args.image_hash))
        with dock.get_image(image=args.image_hash) as image_stream
            size = helpers.sizeof_fmt(dock.inspect_image(image_id=args.image_hash)['VirtualSize'])
            if args.verbose:
                print("Total file size: {}".format(size))
            if args.verbose:
                print("Sending image stream...")
            j = 0
            while True:
                j += 1
                block = image_stream.read(READ_SIZE)
                if not block:
                    break
                if args.verbose:
                    print("Sent {}".format(helpers.sizeof_fmt(READ_SIZE * j)))
                compressed = compressor.compress(block)
                if compressed:
                    sock.send(compressed)
    finally:
        sock.close()
        if args.verbose:
            print("Socket closed")


if __name__ == '__main__':
    main()
