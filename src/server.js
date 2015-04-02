var net = require('net');
var fs = require('fs');
var zlib = require('zlib');
var helpers = require('./helpers.js');
var child_process = require('child_process');
var buffer = require('buffer');

var server = new net.createServer();
var gunzip = zlib.createGunzip();

export default {
  receive(name, port = 1208) {
    let host = '0.0.0.0';

    return new Promise((resolve, reject) => {
      server.listen(port, host, function() {

        server.on('connection', function(conn) {
          var connIp = conn.remoteAddress;
          var connPort = conn.remotePort;

          conn.on('close', function() {
            console.log("\n" + connIp+':'+connPort, 'disconnected.');
          });

          conn.on('data', function(data) {
            process.stdout.write('Data received: ' + helpers.humanFileSize(conn.bytesRead) + "                \r");
          });


          let cmd = child_process.spawn('docker', ['import', '-', name]);
          conn.pipe(gunzip).pipe(cmd.stdin);
          resolve(name);
        });
      });

      server.on('error', function(err) {
        reject(err);
      });
    });
  }
};
