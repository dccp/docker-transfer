import socketserver
import argparse

class DockerTransferServer(socketserver.StreamRequestHandler):
    def handle(self):
        self.data = self.rfile.readline().strip()
        print("{} wrote:".format(self.client_address[0]))
        print(self.data.decode('utf-8'))
        string = input("Svar: ")
        self.wfile.write(("rekoil: "+string).encode('utf-8'))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Server for docker-transfer service')
    parser.add_argument('-p', '--port', dest='port', nargs=1, default=1208)
    parser.add_argument('-H', '--host', dest='host', nargs='?', default='localhost')
    parser.add_argument('-v', '--verbose', dest='verbose', action='store_true')
    parser.set_defaults(verbose=True)
    args = parser.parse_args()

    server = socketserver.TCPServer((args.host, args.port), DockerTransferServer)
    server.serve_forever()
