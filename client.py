import argparse
import socket
import helpers
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
    sock.connect((args.host, args.port))
    if args.verbose:
        print("Connected on {}:{}".format(args.host, args.port))

    try:
        if args.verbose:
            print("Reading file \"{}\"".format(args.image_hash))
        image_stream = dock.get_image(image=args.image_hash)
        size = helpers.sizeof_fmt(dock.inspect_image(image_id=args.image_hash)['VirtualSize'])
        if args.verbose:
            print("Total file size: {}".format(size))
        if args.verbose:
            print("Sending image stream...")
        sock.send(image_stream.data)
    finally:
        sock.close()
        if args.verbose:
            print("Socket closed")


if __name__ == '__main__':
    main()
