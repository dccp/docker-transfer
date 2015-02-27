import socketserver

class DockerTransferServer(socketserver.StreamRequestHandler):
    def handle(self):
        self.data = self.rfile.readline().strip()
        print("{} wrote:".format(self.client_address[0]))
        print(self.data)
        self.wfile.write(self.data.upper())

if __name__ == "__main__":
    HOST, PORT = "0.0.0.0", 9999
    server = socketserver.TCPServer((HOST, PORT), DockerTransferServer)
    server.serve_forever()
