var server = require('http').createServer(),
    io = require('socket.io')(server),
    ss = require('socket.io-stream'),
    fs = require('fs'),
    zlib = require('zlib'),
    helpers = require('./helpers.js'),
    child_process = require('child_process'),
    buffer = require('buffer'),
    sleep = require('sleep'),
    gunzip = zlib.createGunzip();

var exports = {
  receive(name, port = 1208) {
    let host = '0.0.0.0';

    return new Promise((resolve, reject) => {
      server.listen(port, host, function() {
        console.log('tjenna server');
        io.sockets.on('connection', socket => {
          console.log('tjenna klient!!!');
          ss(socket).on('docker', function(metadata, stream) {
            let count = 0;
            let cmd = child_process.spawn('docker', ['import', '-', name]);
            stream.pipe(gunzip)
              .on('data', data => {
                count += data.length;
                process.stdout.write((count / metadata.VirtualSize * 100).toFixed(2) + '%    \r');
              })
              .on('end', () => {
                resolve();
              })
              .pipe(cmd.stdin);
            // console.log('tjennahejdå');
          });
          socket.on('disconnect', function() {
            server.close();
          });
          socket.on('timeout', function() {
            console.log('tiem');
            socket.close();
          });
        });
      });
      //   server.on('connection', function(conn) {
      //     var connIp = conn.remoteAddress;
      //     var connPort = conn.remotePort;

      //     conn.on('close', function() {
      //       console.log("\n" + connIp+':'+connPort, 'disconnected.');
      //     });

      //     conn.on('data', function(data) {
      //       process.stdout.write('Data received: '
      //                           + helpers.humanFileSize(conn.bytesRead)
      //                           + "                \r");
      //     });

      //     conn.on('end', function() {
      //       console.log("\n" + connIp+':'+connPort, 'ended.');
      //       resolve(name);
      //     });

      //     console.log(name);
      //     // let cmd = child_process.spawn('docker', ['import', '-', name]);
      //     // conn.pipe(gunzip).pipe(cmd.stdin);
      //   });
      server.on('error', err => {
        reject(err);
      });
    });
  }
};

export default exports;
exports.receive('lolubuntu');
