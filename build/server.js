"use strict";

var server = require("http").createServer(),
    io = require("socket.io")(server),
    ss = require("socket.io-stream"),
    fs = require("fs"),
    zlib = require("zlib"),
    helpers = require("./helpers.js"),
    child_process = require("child_process"),
    buffer = require("buffer"),
    gunzip = zlib.createGunzip();

var exports = {
  receive: function receive(name, port) {
    var host = "0.0.0.0";

    return new Promise(function (resolve, reject) {
      server.listen(port, host, function () {
        log("SERVER: listening at " + host + ":" + port);
        io.sockets.on("connection", function (socket) {
          log("SERVER: received connection");
          ss(socket).on("docker", function (metadata, stream) {
            var count = 0;
            var cmd = child_process.spawn("docker", ["load"]);
            stream.pipe(gunzip).on("data", function (data) {
              count += data.length;
              process.stdout.write((count / metadata.VirtualSize * 100).toFixed(2) + "%    \r");
            }).on("end", function () {
              log("SERVER: End of stream. Data received: " + helpers.humanFileSize(count));
              child_process.spawn("docker", ["tag", metadata.Id, name]);
              resolve();
            }).pipe(cmd.stdin);
          });
          socket.on("disconnect", function () {
            server.close();
            log("Docker-transfer server disconnected");
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
      server.on("error", function (err) {
        reject(err);
      });
    });
  }
};

function log(str) {
  console.log(helpers.timestamp(), str);
}

module.exports = exports;
//# sourceMappingURL=data:application/json;base64,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QUFDOztBQUVGLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRTtBQUNkLFNBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQ3pDOztpQkFFYyxPQUFPIiwiZmlsZSI6InNyYy9zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc2VydmVyID0gcmVxdWlyZSgnaHR0cCcpLmNyZWF0ZVNlcnZlcigpLFxuICAgIGlvID0gcmVxdWlyZSgnc29ja2V0LmlvJykoc2VydmVyKSxcbiAgICBzcyA9IHJlcXVpcmUoJ3NvY2tldC5pby1zdHJlYW0nKSxcbiAgICBmcyA9IHJlcXVpcmUoJ2ZzJyksXG4gICAgemxpYiA9IHJlcXVpcmUoJ3psaWInKSxcbiAgICBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzLmpzJyksXG4gICAgY2hpbGRfcHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKSxcbiAgICBidWZmZXIgPSByZXF1aXJlKCdidWZmZXInKSxcbiAgICBndW56aXAgPSB6bGliLmNyZWF0ZUd1bnppcCgpO1xuXG5sZXQgZXhwb3J0cyA9IHtcbiAgcmVjZWl2ZShuYW1lLCBwb3J0KSB7XG4gICAgbGV0IGhvc3QgPSAnMC4wLjAuMCc7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc2VydmVyLmxpc3Rlbihwb3J0LCBob3N0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgbG9nKCdTRVJWRVI6IGxpc3RlbmluZyBhdCAnICsgaG9zdCArIFwiOlwiICsgcG9ydCk7XG4gICAgICAgIGlvLnNvY2tldHMub24oJ2Nvbm5lY3Rpb24nLCBzb2NrZXQgPT4ge1xuICAgICAgICAgIGxvZygnU0VSVkVSOiByZWNlaXZlZCBjb25uZWN0aW9uJyk7XG4gICAgICAgICAgc3Moc29ja2V0KS5vbignZG9ja2VyJywgZnVuY3Rpb24obWV0YWRhdGEsIHN0cmVhbSkge1xuICAgICAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgICAgIGxldCBjbWQgPSBjaGlsZF9wcm9jZXNzLnNwYXduKCdkb2NrZXInLCBbJ2xvYWQnXSk7XG4gICAgICAgICAgICBzdHJlYW0ucGlwZShndW56aXApXG4gICAgICAgICAgICAgIC5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvdW50ICs9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKChjb3VudCAvIG1ldGFkYXRhLlZpcnR1YWxTaXplICogMTAwKS50b0ZpeGVkKDIpICsgJyUgICAgXFxyJyk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxvZygnU0VSVkVSOiBFbmQgb2Ygc3RyZWFtLiBEYXRhIHJlY2VpdmVkOiAnICsgaGVscGVycy5odW1hbkZpbGVTaXplKGNvdW50KSk7XG4gICAgICAgICAgICAgICAgY2hpbGRfcHJvY2Vzcy5zcGF3bignZG9ja2VyJywgWyd0YWcnLCBtZXRhZGF0YS5JZCwgbmFtZV0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnBpcGUoY21kLnN0ZGluKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgbG9nKCdEb2NrZXItdHJhbnNmZXIgc2VydmVyIGRpc2Nvbm5lY3RlZCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgLy8gICBzZXJ2ZXIub24oJ2Nvbm5lY3Rpb24nLCBmdW5jdGlvbihjb25uKSB7XG4gICAgICAvLyAgICAgdmFyIGNvbm5JcCA9IGNvbm4ucmVtb3RlQWRkcmVzcztcbiAgICAgIC8vICAgICB2YXIgY29ublBvcnQgPSBjb25uLnJlbW90ZVBvcnQ7XG5cbiAgICAgIC8vICAgICBjb25uLm9uKCdjbG9zZScsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNvbm5JcCsnOicrY29ublBvcnQsICdkaXNjb25uZWN0ZWQuJyk7XG4gICAgICAvLyAgICAgfSk7XG5cbiAgICAgIC8vICAgICBjb25uLm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgLy8gICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ0RhdGEgcmVjZWl2ZWQ6ICdcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBoZWxwZXJzLmh1bWFuRmlsZVNpemUoY29ubi5ieXRlc1JlYWQpXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIgICAgICAgICAgICAgICAgXFxyXCIpO1xuICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAvLyAgICAgY29ubi5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAvLyAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY29ubklwKyc6Jytjb25uUG9ydCwgJ2VuZGVkLicpO1xuICAgICAgLy8gICAgICAgcmVzb2x2ZShuYW1lKTtcbiAgICAgIC8vICAgICB9KTtcblxuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKG5hbWUpO1xuICAgICAgLy8gICAgIC8vIGxldCBjbWQgPSBjaGlsZF9wcm9jZXNzLnNwYXduKCdkb2NrZXInLCBbJ2ltcG9ydCcsICctJywgbmFtZV0pO1xuICAgICAgLy8gICAgIC8vIGNvbm4ucGlwZShndW56aXApLnBpcGUoY21kLnN0ZGluKTtcbiAgICAgIC8vICAgfSk7XG4gICAgICBzZXJ2ZXIub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbG9nKHN0cikge1xuICAgIGNvbnNvbGUubG9nKGhlbHBlcnMudGltZXN0YW1wKCksIHN0cik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydHM7XG5cbiJdfQ==