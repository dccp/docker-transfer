import argparse
import socket
import sys


def main():
    parser = argparse.ArgumentParser(description='Send work to Zeppelin network')
    parser.add_argument('-H', '--host', nargs='?', default='localhost')
    parser.add_argument('-p', '--port', nargs='?', default=1208)
    parser.add_argument('message', nargs='+')
    args = parser.parse_args()

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    data = ' '.join(args.message)

    try:
        sock.connect((args.host, args.port))
        sock.sendall(bytes(data + "\n", "utf-8"))
        received = str(sock.recv(1024), "utf-8")
    finally:
        sock.close()

    print("Sent:     {}".format(data))
    print("Received: {}".format(received))


if __name__ == '__main__':
    main()
