"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

// Imports

var io = _interopRequire(require("socket.io-client"));

var ss = _interopRequire(require("socket.io-stream"));

var fs = _interopRequire(require("fs"));

var zlib = _interopRequire(require("zlib"));

var child_process = _interopRequire(require("child_process"));

var Docker = _interopRequire(require("dockerode"));

var helpers = _interopRequire(require("./helpers.js"));

// Dockerode instantiation
var docker = new Docker({ socketPath: "/var/run/docker.sock" });
var gzip = zlib.createGzip();

function log(str) {
  console.log(helpers.timestamp(), str);
}

var exports = {
  listImages: function () {
    return new Promise(function (resolve, reject) {
      return docker.listImages({ all: false }, function (err, images) {
        if (err) {
          reject(err);
        } else {
          resolve(images);
        }
      });
    });
  },
  sendImage: function (imageHash, host) {
    var port = arguments[2] === undefined ? 1208 : arguments[2];
    return new Promise(function (resolve, reject) {
      var image = docker.getImage(imageHash);
      image.inspect(function (err, imageData) {
        var fileSize = imageData.VirtualSize;
        var socket = io.connect("http://" + host + ":" + port);

        socket.on("connect", function () {
          log("CLIENT: connected to" + host + ":" + port);
          log("CLIENT: compressing image " + imageHash);
          var cmd = child_process.spawn("docker", ["save", imageHash]);
          var stream = ss.createStream();

          ss(socket).emit("docker", imageData, stream);

          log("CLIENT: sent image metadata for " + imageHash);

          var count = 0;
          cmd.stdout.on("data", function (data) {
            count += data.length;
            process.stdout.write((count / fileSize * 100).toFixed(2) + "%   \r");
          }).pipe(gzip).pipe(stream).on("end", function () {
            log("CLIENT: End of stream.");
            socket.close();
            resolve(true);
          });
        });
      });
    });
  }
};

module.exports = exports;
//# sourceMappingURL=data:application/json;base64,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QUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQzlCLGtCQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixtQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ2YsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osQ0FBQztHQUFBO0NBQ0gsQ0FBQzs7aUJBRWEsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW1wb3J0c1xuaW1wb3J0IGlvIGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XG5pbXBvcnQgc3MgZnJvbSBcInNvY2tldC5pby1zdHJlYW1cIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB6bGliIGZyb20gXCJ6bGliXCI7XG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IERvY2tlciBmcm9tIFwiZG9ja2Vyb2RlXCI7XG5cbmltcG9ydCBoZWxwZXJzIGZyb20gXCIuL2hlbHBlcnMuanNcIjtcblxuLy8gRG9ja2Vyb2RlIGluc3RhbnRpYXRpb25cbmxldCBkb2NrZXIgPSBuZXcgRG9ja2VyKHtzb2NrZXRQYXRoOiAnL3Zhci9ydW4vZG9ja2VyLnNvY2snfSk7XG5sZXQgZ3ppcCA9IHpsaWIuY3JlYXRlR3ppcCgpO1xuXG5mdW5jdGlvbiBsb2coc3RyKSB7XG4gICAgY29uc29sZS5sb2coaGVscGVycy50aW1lc3RhbXAoKSwgc3RyKTtcbn1cblxubGV0IGV4cG9ydHMgPSB7XG4gIGxpc3RJbWFnZXM6ICgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGRvY2tlci5saXN0SW1hZ2VzKHthbGw6IGZhbHNlfSwgKGVyciwgaW1hZ2VzKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoaW1hZ2VzKTtcbiAgICB9XG4gIH0pKSxcbiAgc2VuZEltYWdlOiAoaW1hZ2VIYXNoLCBob3N0LCBwb3J0ID0gMTIwOCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBpbWFnZSA9IGRvY2tlci5nZXRJbWFnZShpbWFnZUhhc2gpO1xuICAgIGltYWdlLmluc3BlY3QoKGVyciwgaW1hZ2VEYXRhKSA9PiB7XG4gICAgICBsZXQgZmlsZVNpemUgPSBpbWFnZURhdGEuVmlydHVhbFNpemU7XG4gICAgICBsZXQgc29ja2V0ID0gaW8uY29ubmVjdChgaHR0cDovLyR7aG9zdH06JHtwb3J0fWApO1xuXG4gICAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIGxvZygnQ0xJRU5UOiBjb25uZWN0ZWQgdG8nICsgaG9zdCArIFwiOlwiICsgcG9ydCk7XG4gICAgICAgIGxvZygnQ0xJRU5UOiBjb21wcmVzc2luZyBpbWFnZSAnICsgaW1hZ2VIYXNoKTtcbiAgICAgICAgbGV0IGNtZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ2RvY2tlcicsIFsnc2F2ZScsIGltYWdlSGFzaF0pO1xuICAgICAgICBsZXQgc3RyZWFtID0gc3MuY3JlYXRlU3RyZWFtKCk7XG5cbiAgICAgICAgc3Moc29ja2V0KS5lbWl0KCdkb2NrZXInLCBpbWFnZURhdGEsIHN0cmVhbSk7XG5cbiAgICAgICAgbG9nKCdDTElFTlQ6IHNlbnQgaW1hZ2UgbWV0YWRhdGEgZm9yICcgKyBpbWFnZUhhc2gpO1xuXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGNtZC5zdGRvdXQub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICBjb3VudCArPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgoY291bnQgLyBmaWxlU2l6ZSAqIDEwMCkudG9GaXhlZCgyKSArIFwiJSAgIFxcclwiKTtcbiAgICAgICAgfSkucGlwZShnemlwKS5waXBlKHN0cmVhbSkub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICBsb2coJ0NMSUVOVDogRW5kIG9mIHN0cmVhbS4nKTtcbiAgICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0cztcblxuIl19