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
        log("Docker-transfer server init at", host, port);
        io.sockets.on("connection", function (socket) {
          log("Docker-transfer server received connection");
          ss(socket).on("docker", function (metadata, stream) {
            var count = 0;
            var cmd = child_process.spawn("docker", ["load"]);
            stream.pipe(gunzip).on("data", function (data) {
              count += data.length;
              process.stdout.write((count / metadata.VirtualSize * 100).toFixed(2) + "%    \r");
            }).on("end", function () {
              log("End of stream. Data received: " + helpers.humanFileSize(count));
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
//# sourceMappingURL=data:application/json;base64,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U0FBUyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ2QsU0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7Q0FDekM7O2lCQUVjLE9BQU8iLCJmaWxlIjoic3JjL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBzZXJ2ZXIgPSByZXF1aXJlKCdodHRwJykuY3JlYXRlU2VydmVyKCksXG4gICAgaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8nKShzZXJ2ZXIpLFxuICAgIHNzID0gcmVxdWlyZSgnc29ja2V0LmlvLXN0cmVhbScpLFxuICAgIGZzID0gcmVxdWlyZSgnZnMnKSxcbiAgICB6bGliID0gcmVxdWlyZSgnemxpYicpLFxuICAgIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMuanMnKSxcbiAgICBjaGlsZF9wcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLFxuICAgIGJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLFxuICAgIGd1bnppcCA9IHpsaWIuY3JlYXRlR3VuemlwKCk7XG5cbmxldCBleHBvcnRzID0ge1xuICByZWNlaXZlKG5hbWUsIHBvcnQpIHtcbiAgICBsZXQgaG9zdCA9ICcwLjAuMC4wJztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIGhvc3QsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2coJ0RvY2tlci10cmFuc2ZlciBzZXJ2ZXIgaW5pdCBhdCcsIGhvc3QsIHBvcnQpO1xuICAgICAgICBpby5zb2NrZXRzLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcbiAgICAgICAgICBsb2coJ0RvY2tlci10cmFuc2ZlciBzZXJ2ZXIgcmVjZWl2ZWQgY29ubmVjdGlvbicpO1xuICAgICAgICAgIHNzKHNvY2tldCkub24oJ2RvY2tlcicsIGZ1bmN0aW9uKG1ldGFkYXRhLCBzdHJlYW0pIHtcbiAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICBsZXQgY21kID0gY2hpbGRfcHJvY2Vzcy5zcGF3bignZG9ja2VyJywgWydsb2FkJ10pO1xuICAgICAgICAgICAgc3RyZWFtLnBpcGUoZ3VuemlwKVxuICAgICAgICAgICAgICAub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb3VudCArPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgoY291bnQgLyBtZXRhZGF0YS5WaXJ0dWFsU2l6ZSAqIDEwMCkudG9GaXhlZCgyKSArICclICAgIFxccicpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsb2coJ0VuZCBvZiBzdHJlYW0uIERhdGEgcmVjZWl2ZWQ6ICcgKyBoZWxwZXJzLmh1bWFuRmlsZVNpemUoY291bnQpKTtcbiAgICAgICAgICAgICAgICBjaGlsZF9wcm9jZXNzLnNwYXduKCdkb2NrZXInLCBbJ3RhZycsIG1ldGFkYXRhLklkLCBuYW1lXSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAucGlwZShjbWQuc3RkaW4pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICBsb2coJ0RvY2tlci10cmFuc2ZlciBzZXJ2ZXIgZGlzY29ubmVjdGVkJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICAvLyAgIHNlcnZlci5vbignY29ubmVjdGlvbicsIGZ1bmN0aW9uKGNvbm4pIHtcbiAgICAgIC8vICAgICB2YXIgY29ubklwID0gY29ubi5yZW1vdGVBZGRyZXNzO1xuICAgICAgLy8gICAgIHZhciBjb25uUG9ydCA9IGNvbm4ucmVtb3RlUG9ydDtcblxuICAgICAgLy8gICAgIGNvbm4ub24oJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICAvLyAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY29ubklwKyc6Jytjb25uUG9ydCwgJ2Rpc2Nvbm5lY3RlZC4nKTtcbiAgICAgIC8vICAgICB9KTtcblxuICAgICAgLy8gICAgIGNvbm4ub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAvLyAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnRGF0YSByZWNlaXZlZDogJ1xuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICArIGhlbHBlcnMuaHVtYW5GaWxlU2l6ZShjb25uLmJ5dGVzUmVhZClcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIiAgICAgICAgICAgICAgICBcXHJcIik7XG4gICAgICAvLyAgICAgfSk7XG5cbiAgICAgIC8vICAgICBjb25uLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjb25uSXArJzonK2Nvbm5Qb3J0LCAnZW5kZWQuJyk7XG4gICAgICAvLyAgICAgICByZXNvbHZlKG5hbWUpO1xuICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAvLyAgICAgY29uc29sZS5sb2cobmFtZSk7XG4gICAgICAvLyAgICAgLy8gbGV0IGNtZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ2RvY2tlcicsIFsnaW1wb3J0JywgJy0nLCBuYW1lXSk7XG4gICAgICAvLyAgICAgLy8gY29ubi5waXBlKGd1bnppcCkucGlwZShjbWQuc3RkaW4pO1xuICAgICAgLy8gICB9KTtcbiAgICAgIHNlcnZlci5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBsb2coc3RyKSB7XG4gICAgY29uc29sZS5sb2coaGVscGVycy50aW1lc3RhbXAoKSwgc3RyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0cztcblxuIl19