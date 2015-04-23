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
        console.log("tjenna server", host, port);
        io.sockets.on("connection", function (socket) {
          console.log("tjenna klient!!!");
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

exports.receive("lolubuntu");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxFQUFFO0lBQ3ZDLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2pDLEVBQUUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7SUFDaEMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDbEIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDdEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7SUFDakMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7SUFDeEMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDMUIsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFakMsSUFBSSxPQUFPLEdBQUc7QUFDWixTQUFPLEVBQUEsaUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNsQixRQUFJLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRXJCLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFXO0FBQ25DLGVBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6QyxVQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDcEMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQyxZQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFTLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDakQsZ0JBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLGdCQUFJLEdBQUcsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvRCxrQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FDaEIsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFBLElBQUksRUFBSTtBQUNsQixtQkFBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDckIscUJBQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFBLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO2FBQ25GLENBQUMsQ0FDRCxFQUFFLENBQUMsS0FBSyxFQUFFLFlBQU07QUFDZixxQkFBTyxFQUFFLENBQUM7YUFDWCxDQUFDLENBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUNwQixDQUFDLENBQUM7QUFDSCxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBVztBQUNqQyxrQkFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1dBQ2hCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JILFlBQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ3hCLGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNiLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKO0NBQ0YsQ0FBQzs7aUJBRWEsT0FBTzs7QUFDdEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyIsImZpbGUiOiJzcmMvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNlcnZlciA9IHJlcXVpcmUoJ2h0dHAnKS5jcmVhdGVTZXJ2ZXIoKSxcbiAgICBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpKHNlcnZlciksXG4gICAgc3MgPSByZXF1aXJlKCdzb2NrZXQuaW8tc3RyZWFtJyksXG4gICAgZnMgPSByZXF1aXJlKCdmcycpLFxuICAgIHpsaWIgPSByZXF1aXJlKCd6bGliJyksXG4gICAgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLFxuICAgIGNoaWxkX3Byb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyksXG4gICAgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJyksXG4gICAgZ3VuemlwID0gemxpYi5jcmVhdGVHdW56aXAoKTtcblxubGV0IGV4cG9ydHMgPSB7XG4gIHJlY2VpdmUobmFtZSwgcG9ydCkge1xuICAgIGxldCBob3N0ID0gJzAuMC4wLjAnO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCwgaG9zdCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0amVubmEgc2VydmVyJywgaG9zdCwgcG9ydCk7XG4gICAgICAgIGlvLnNvY2tldHMub24oJ2Nvbm5lY3Rpb24nLCBzb2NrZXQgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd0amVubmEga2xpZW50ISEhJyk7XG4gICAgICAgICAgc3Moc29ja2V0KS5vbignZG9ja2VyJywgZnVuY3Rpb24obWV0YWRhdGEsIHN0cmVhbSkge1xuICAgICAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgICAgIGxldCBjbWQgPSBjaGlsZF9wcm9jZXNzLnNwYXduKCdkb2NrZXInLCBbJ2ltcG9ydCcsICctJywgbmFtZV0pO1xuICAgICAgICAgICAgc3RyZWFtLnBpcGUoZ3VuemlwKVxuICAgICAgICAgICAgICAub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb3VudCArPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgoY291bnQgLyBtZXRhZGF0YS5WaXJ0dWFsU2l6ZSAqIDEwMCkudG9GaXhlZCgyKSArICclICAgIFxccicpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5waXBlKGNtZC5zdGRpbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIC8vICAgc2VydmVyLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24oY29ubikge1xuICAgICAgLy8gICAgIHZhciBjb25uSXAgPSBjb25uLnJlbW90ZUFkZHJlc3M7XG4gICAgICAvLyAgICAgdmFyIGNvbm5Qb3J0ID0gY29ubi5yZW1vdGVQb3J0O1xuXG4gICAgICAvLyAgICAgY29ubi5vbignY2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjb25uSXArJzonK2Nvbm5Qb3J0LCAnZGlzY29ubmVjdGVkLicpO1xuICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAvLyAgICAgY29ubi5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIC8vICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdEYXRhIHJlY2VpdmVkOiAnXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICsgaGVscGVycy5odW1hbkZpbGVTaXplKGNvbm4uYnl0ZXNSZWFkKVxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiICAgICAgICAgICAgICAgIFxcclwiKTtcbiAgICAgIC8vICAgICB9KTtcblxuICAgICAgLy8gICAgIGNvbm4ub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNvbm5JcCsnOicrY29ublBvcnQsICdlbmRlZC4nKTtcbiAgICAgIC8vICAgICAgIHJlc29sdmUobmFtZSk7XG4gICAgICAvLyAgICAgfSk7XG5cbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhuYW1lKTtcbiAgICAgIC8vICAgICAvLyBsZXQgY21kID0gY2hpbGRfcHJvY2Vzcy5zcGF3bignZG9ja2VyJywgWydpbXBvcnQnLCAnLScsIG5hbWVdKTtcbiAgICAgIC8vICAgICAvLyBjb25uLnBpcGUoZ3VuemlwKS5waXBlKGNtZC5zdGRpbik7XG4gICAgICAvLyAgIH0pO1xuICAgICAgc2VydmVyLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydHM7XG5leHBvcnRzLnJlY2VpdmUoJ2xvbHVidW50dScpO1xuIl19