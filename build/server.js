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
        console.log("Docker-transfer server init at", host, port);
        io.sockets.on("connection", function (socket) {
          console.log("Docker-transfer server received connection");
          ss(socket).on("docker", function (metadata, stream) {
            var count = 0;
            var cmd = child_process.spawn("docker", ["import", "-", name]);
            stream.pipe(gunzip).on("data", function (data) {
              count += data.length;
              process.stdout.write((count / metadata.VirtualSize * 100).toFixed(2) + "%    \r");
            }).on("end", function () {
              resolve();
            }).pipe(cmd.stdin);
          });
          socket.on("disconnect", function () {
            server.close();
            console.log("Docker-transfer server disconnected");
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

module.exports = exports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxFQUFFO0lBQ3ZDLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2pDLEVBQUUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7SUFDaEMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDbEIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDdEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7SUFDakMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7SUFDeEMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDMUIsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFakMsSUFBSSxPQUFPLEdBQUc7QUFDWixTQUFPLEVBQUEsaUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNsQixRQUFJLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRXJCLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFXO0FBQ25DLGVBQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFELFVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNwQyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0FBQzFELFlBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVMsUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUNqRCxnQkFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsZ0JBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQy9ELGtCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUNoQixFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUEsSUFBSSxFQUFJO0FBQ2xCLG1CQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNyQixxQkFBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUEsQ0FBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7YUFDbkYsQ0FBQyxDQUNELEVBQUUsQ0FBQyxLQUFLLEVBQUUsWUFBTTtBQUNmLHFCQUFPLEVBQUUsQ0FBQzthQUNYLENBQUMsQ0FDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1dBQ3BCLENBQUMsQ0FBQztBQUNILGdCQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFXO0FBQ2pDLGtCQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1dBQ3BELENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JILFlBQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ3hCLGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNiLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKO0NBQ0YsQ0FBQzs7aUJBRWEsT0FBTyIsImZpbGUiOiJzcmMvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNlcnZlciA9IHJlcXVpcmUoJ2h0dHAnKS5jcmVhdGVTZXJ2ZXIoKSxcbiAgICBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpKHNlcnZlciksXG4gICAgc3MgPSByZXF1aXJlKCdzb2NrZXQuaW8tc3RyZWFtJyksXG4gICAgZnMgPSByZXF1aXJlKCdmcycpLFxuICAgIHpsaWIgPSByZXF1aXJlKCd6bGliJyksXG4gICAgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLFxuICAgIGNoaWxkX3Byb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyksXG4gICAgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJyksXG4gICAgZ3VuemlwID0gemxpYi5jcmVhdGVHdW56aXAoKTtcblxubGV0IGV4cG9ydHMgPSB7XG4gIHJlY2VpdmUobmFtZSwgcG9ydCkge1xuICAgIGxldCBob3N0ID0gJzAuMC4wLjAnO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCwgaG9zdCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdEb2NrZXItdHJhbnNmZXIgc2VydmVyIGluaXQgYXQnLCBob3N0LCBwb3J0KTtcbiAgICAgICAgaW8uc29ja2V0cy5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0RvY2tlci10cmFuc2ZlciBzZXJ2ZXIgcmVjZWl2ZWQgY29ubmVjdGlvbicpO1xuICAgICAgICAgIHNzKHNvY2tldCkub24oJ2RvY2tlcicsIGZ1bmN0aW9uKG1ldGFkYXRhLCBzdHJlYW0pIHtcbiAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICBsZXQgY21kID0gY2hpbGRfcHJvY2Vzcy5zcGF3bignZG9ja2VyJywgWydpbXBvcnQnLCAnLScsIG5hbWVdKTtcbiAgICAgICAgICAgIHN0cmVhbS5waXBlKGd1bnppcClcbiAgICAgICAgICAgICAgLm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY291bnQgKz0gZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoKGNvdW50IC8gbWV0YWRhdGEuVmlydHVhbFNpemUgKiAxMDApLnRvRml4ZWQoMikgKyAnJSAgICBcXHInKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAucGlwZShjbWQuc3RkaW4pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRG9ja2VyLXRyYW5zZmVyIHNlcnZlciBkaXNjb25uZWN0ZWQnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIC8vICAgc2VydmVyLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24oY29ubikge1xuICAgICAgLy8gICAgIHZhciBjb25uSXAgPSBjb25uLnJlbW90ZUFkZHJlc3M7XG4gICAgICAvLyAgICAgdmFyIGNvbm5Qb3J0ID0gY29ubi5yZW1vdGVQb3J0O1xuXG4gICAgICAvLyAgICAgY29ubi5vbignY2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjb25uSXArJzonK2Nvbm5Qb3J0LCAnZGlzY29ubmVjdGVkLicpO1xuICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAvLyAgICAgY29ubi5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIC8vICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdEYXRhIHJlY2VpdmVkOiAnXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICsgaGVscGVycy5odW1hbkZpbGVTaXplKGNvbm4uYnl0ZXNSZWFkKVxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiICAgICAgICAgICAgICAgIFxcclwiKTtcbiAgICAgIC8vICAgICB9KTtcblxuICAgICAgLy8gICAgIGNvbm4ub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNvbm5JcCsnOicrY29ublBvcnQsICdlbmRlZC4nKTtcbiAgICAgIC8vICAgICAgIHJlc29sdmUobmFtZSk7XG4gICAgICAvLyAgICAgfSk7XG5cbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhuYW1lKTtcbiAgICAgIC8vICAgICAvLyBsZXQgY21kID0gY2hpbGRfcHJvY2Vzcy5zcGF3bignZG9ja2VyJywgWydpbXBvcnQnLCAnLScsIG5hbWVdKTtcbiAgICAgIC8vICAgICAvLyBjb25uLnBpcGUoZ3VuemlwKS5waXBlKGNtZC5zdGRpbik7XG4gICAgICAvLyAgIH0pO1xuICAgICAgc2VydmVyLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydHM7XG5cbiJdfQ==