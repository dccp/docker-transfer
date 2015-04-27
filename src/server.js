var server = require('http').createServer(),
    io = require('socket.io')(server),
    ss = require('socket.io-stream'),
    fs = require('fs'),
    zlib = require('zlib'),
    helpers = require('./helpers.js'),
    child_process = require('child_process'),
    buffer = require('buffer'),
    gunzip = zlib.createGunzip();

let exports = {
  receive(name, port) {
    let host = '0.0.0.0';

    return new Promise((resolve, reject) => {
      server.listen(port, host, function() {
        console.log('Docker-transfer server init at', host, port);
        io.sockets.on('connection', socket => {
          console.log('Docker-transfer server received connection');
          ss(socket).on('docker', function(metadata, stream) {
            let count = 0;
            let cmd = child_process.spawn('docker', ['load']);
            stream.pipe(gunzip)
              .on('data', data => {
                count += data.length;
                process.stdout.write((count / metadata.VirtualSize * 100).toFixed(2) + '%    \r');
              })
              .on('end', () => {
                child_process.spawn('docker', ['tag', metadata.Id, name]);
                resolve();
              })
              .pipe(cmd.stdin);
          });
          socket.on('disconnect', function() {
            server.close();
            console.log('Docker-transfer server disconnected');
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

