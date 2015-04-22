"use strict";

var server = require("http").createServer(),
    io = require("socket.io")(server),
    ss = require("socket.io-stream"),
    fs = require("fs"),
    zlib = require("zlib"),
    helpers = require("./helpers.js"),
    child_process = require("child_process"),
    buffer = require("buffer"),
    sleep = require("sleep"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxFQUFFO0lBQ3ZDLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2pDLEVBQUUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7SUFDaEMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDbEIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDdEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7SUFDakMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7SUFDeEMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDMUIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDeEIsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFakMsSUFBSSxPQUFPLEdBQUc7QUFDWixTQUFPLEVBQUEsaUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNsQixRQUFJLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRXJCLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFXO0FBQ25DLGVBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6QyxVQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDcEMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQyxZQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFTLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDakQsZ0JBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLGdCQUFJLEdBQUcsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvRCxrQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FDaEIsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFBLElBQUksRUFBSTtBQUNsQixtQkFBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDckIscUJBQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFBLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO2FBQ25GLENBQUMsQ0FDRCxFQUFFLENBQUMsS0FBSyxFQUFFLFlBQU07QUFDZixxQkFBTyxFQUFFLENBQUM7YUFDWCxDQUFDLENBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUNwQixDQUFDLENBQUM7QUFDSCxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBVztBQUNqQyxrQkFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1dBQ2hCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JILFlBQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ3hCLGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNiLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKO0NBQ0YsQ0FBQzs7aUJBRWEsT0FBTzs7QUFDdEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyIsImZpbGUiOiJzcmMvc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNlcnZlciA9IHJlcXVpcmUoJ2h0dHAnKS5jcmVhdGVTZXJ2ZXIoKSxcbiAgICBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpKHNlcnZlciksXG4gICAgc3MgPSByZXF1aXJlKCdzb2NrZXQuaW8tc3RyZWFtJyksXG4gICAgZnMgPSByZXF1aXJlKCdmcycpLFxuICAgIHpsaWIgPSByZXF1aXJlKCd6bGliJyksXG4gICAgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLFxuICAgIGNoaWxkX3Byb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyksXG4gICAgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJyksXG4gICAgc2xlZXAgPSByZXF1aXJlKCdzbGVlcCcpLFxuICAgIGd1bnppcCA9IHpsaWIuY3JlYXRlR3VuemlwKCk7XG5cbmxldCBleHBvcnRzID0ge1xuICByZWNlaXZlKG5hbWUsIHBvcnQpIHtcbiAgICBsZXQgaG9zdCA9ICcwLjAuMC4wJztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIGhvc3QsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygndGplbm5hIHNlcnZlcicsIGhvc3QsIHBvcnQpO1xuICAgICAgICBpby5zb2NrZXRzLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygndGplbm5hIGtsaWVudCEhIScpO1xuICAgICAgICAgIHNzKHNvY2tldCkub24oJ2RvY2tlcicsIGZ1bmN0aW9uKG1ldGFkYXRhLCBzdHJlYW0pIHtcbiAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICBsZXQgY21kID0gY2hpbGRfcHJvY2Vzcy5zcGF3bignZG9ja2VyJywgWydpbXBvcnQnLCAnLScsIG5hbWVdKTtcbiAgICAgICAgICAgIHN0cmVhbS5waXBlKGd1bnppcClcbiAgICAgICAgICAgICAgLm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY291bnQgKz0gZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoKGNvdW50IC8gbWV0YWRhdGEuVmlydHVhbFNpemUgKiAxMDApLnRvRml4ZWQoMikgKyAnJSAgICBcXHInKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAucGlwZShjbWQuc3RkaW4pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICAvLyAgIHNlcnZlci5vbignY29ubmVjdGlvbicsIGZ1bmN0aW9uKGNvbm4pIHtcbiAgICAgIC8vICAgICB2YXIgY29ubklwID0gY29ubi5yZW1vdGVBZGRyZXNzO1xuICAgICAgLy8gICAgIHZhciBjb25uUG9ydCA9IGNvbm4ucmVtb3RlUG9ydDtcblxuICAgICAgLy8gICAgIGNvbm4ub24oJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICAvLyAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY29ubklwKyc6Jytjb25uUG9ydCwgJ2Rpc2Nvbm5lY3RlZC4nKTtcbiAgICAgIC8vICAgICB9KTtcblxuICAgICAgLy8gICAgIGNvbm4ub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAvLyAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnRGF0YSByZWNlaXZlZDogJ1xuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICArIGhlbHBlcnMuaHVtYW5GaWxlU2l6ZShjb25uLmJ5dGVzUmVhZClcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIiAgICAgICAgICAgICAgICBcXHJcIik7XG4gICAgICAvLyAgICAgfSk7XG5cbiAgICAgIC8vICAgICBjb25uLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjb25uSXArJzonK2Nvbm5Qb3J0LCAnZW5kZWQuJyk7XG4gICAgICAvLyAgICAgICByZXNvbHZlKG5hbWUpO1xuICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAvLyAgICAgY29uc29sZS5sb2cobmFtZSk7XG4gICAgICAvLyAgICAgLy8gbGV0IGNtZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ2RvY2tlcicsIFsnaW1wb3J0JywgJy0nLCBuYW1lXSk7XG4gICAgICAvLyAgICAgLy8gY29ubi5waXBlKGd1bnppcCkucGlwZShjbWQuc3RkaW4pO1xuICAgICAgLy8gICB9KTtcbiAgICAgIHNlcnZlci5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBleHBvcnRzO1xuZXhwb3J0cy5yZWNlaXZlKCdsb2x1YnVudHUnKTtcbiJdfQ==