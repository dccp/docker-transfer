'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var server = require('http').createServer(),
    io = require('socket.io')(server),
    ss = require('socket.io-stream'),
    fs = require('fs'),
    zlib = require('zlib'),
    helpers = require('./helpers.js'),
    child_process = require('child_process'),
    buffer = require('buffer'),
    gunzip = zlib.createGunzip();

var open = undefined;

var _exports = {
  receive: function receive(name, port) {
    var host = '0.0.0.0';

    return new Promise(function (resolve, reject) {
      var callback = function callback() {
        log('SERVER: listening at ' + host + ':' + port);
        io.sockets.on('connection', function (socket) {
          log('SERVER: received connection');
          ss(socket).on('docker', function (metadata, stream) {
            var count = 0;
            var cmd = child_process.spawn('docker', ['load']);
            stream.pipe(gunzip).on('data', function (data) {
              count += data.length;
              process.stdout.write((count / metadata.VirtualSize * 100).toFixed(2) + '%    \r');
            }).on('end', function () {
              log('SERVER: End of stream. Data received: ' + helpers.humanFileSize(count));
              child_process.spawn('docker', ['tag', metadata.Id, name]);
              resolve();
            }).pipe(cmd.stdin);
          });
          socket.on('disconnect', function () {
            server.close();
            open = false;
            log('Docker-transfer server disconnected');
          });
        });
      };

      if (open) {
        socket.removeAllListeners('connection');
        server.close(function () {
          server.listen(port, host, callback);
        });
      } else {
        open = true;
        server.listen(port, host, callback());
      }

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
      server.on('error', function (err) {
        reject(err);
      });
    });
  }
};

function log(str) {
  console.log(helpers.timestamp(), str);
}

exports['default'] = _exports;
module.exports = exports['default'];