import argparse
import socket
import helpers

READ_SIZE = 1024


def main():
    parser = argparse.ArgumentParser(description='Send work to Zeppelin network')
    parser.add_argument('-H', '--host', nargs='?', default='localhost')
    parser.add_argument('-p', '--port', nargs='?', default=1208)
    parser.add_argument('filename', nargs='?')
    parser.add_argument('-v', '--verbose', action='store_true')
    parser.set_defaults(verbose=True)
    args = parser.parse_args()

    sock = socket.socket()
    sock.connect((args.host, args.port))
    if args.verbose:
        print("Connected on {}:{}".format(args.host, args.port))

    try:
        if args.verbose:
            print("Reading file \"{}\"".format(args.filename))
        handle = open(args.filename, 'rb')
        file_hash = helpers.hashtuple(args.filename, handle)
        print(file_hash)

        kilobyte = handle.read(READ_SIZE)
        while (kilobyte):
            sock.send(kilobyte)
            if args.verbose:
                print("Sent {} bytes".format(READ_SIZE))
            kilobyte = handle.read(READ_SIZE)
    finally:
        handle.close()
        sock.close()
        if args.verbose:
            print("Socket closed")


if __name__ == '__main__':
    main()
