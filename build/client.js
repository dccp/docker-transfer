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

module.exports = {
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
          log("Docker-transfer client connected to", host, port);
          var cmd = child_process.spawn("docker", ["save", imageHash]);
          var stream = ss.createStream();

          ss(socket).emit("docker", imageData, stream);

          var count = 0;
          cmd.stdout.on("data", function (data) {
            count += data.length;
            process.stdout.write((count / fileSize * 100).toFixed(2) + "%   \r");
          }).pipe(gzip).pipe(stream).on("end", function () {
            log("Docker-transfer stream ended");
            socket.close();
            resolve(true);
          });
        });
      });
    });
  }
};
//# sourceMappingURL=data:application/json;base64,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QyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osQ0FBQztHQUFBO0NBQ0giLCJmaWxlIjoic3JjL2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBpbyBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xuaW1wb3J0IHNzIGZyb20gXCJzb2NrZXQuaW8tc3RyZWFtXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgemxpYiBmcm9tIFwiemxpYlwiO1xuaW1wb3J0IGNoaWxkX3Byb2Nlc3MgZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCBEb2NrZXIgZnJvbSBcImRvY2tlcm9kZVwiO1xuXG5pbXBvcnQgaGVscGVycyBmcm9tIFwiLi9oZWxwZXJzLmpzXCI7XG5cbi8vIERvY2tlcm9kZSBpbnN0YW50aWF0aW9uXG5sZXQgZG9ja2VyID0gbmV3IERvY2tlcih7c29ja2V0UGF0aDogJy92YXIvcnVuL2RvY2tlci5zb2NrJ30pO1xubGV0IGd6aXAgPSB6bGliLmNyZWF0ZUd6aXAoKTtcblxuZnVuY3Rpb24gbG9nKHN0cikge1xuICAgIGNvbnNvbGUubG9nKGhlbHBlcnMudGltZXN0YW1wKCksIHN0cik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbGlzdEltYWdlczogKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gZG9ja2VyLmxpc3RJbWFnZXMoe2FsbDogZmFsc2V9LCAoZXJyLCBpbWFnZXMpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZShpbWFnZXMpO1xuICAgIH1cbiAgfSkpLFxuICBzZW5kSW1hZ2U6IChpbWFnZUhhc2gsIGhvc3QsIHBvcnQgPSAxMjA4KSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IGltYWdlID0gZG9ja2VyLmdldEltYWdlKGltYWdlSGFzaCk7XG4gICAgaW1hZ2UuaW5zcGVjdCgoZXJyLCBpbWFnZURhdGEpID0+IHtcbiAgICAgIGxldCBmaWxlU2l6ZSA9IGltYWdlRGF0YS5WaXJ0dWFsU2l6ZTtcbiAgICAgIGxldCBzb2NrZXQgPSBpby5jb25uZWN0KGBodHRwOi8vJHtob3N0fToke3BvcnR9YCk7XG5cbiAgICAgIHNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgbG9nKCdEb2NrZXItdHJhbnNmZXIgY2xpZW50IGNvbm5lY3RlZCB0bycsIGhvc3QsIHBvcnQpO1xuICAgICAgICBsZXQgY21kID0gY2hpbGRfcHJvY2Vzcy5zcGF3bignZG9ja2VyJywgWydzYXZlJywgaW1hZ2VIYXNoXSk7XG4gICAgICAgIGxldCBzdHJlYW0gPSBzcy5jcmVhdGVTdHJlYW0oKTtcblxuICAgICAgICBzcyhzb2NrZXQpLmVtaXQoJ2RvY2tlcicsIGltYWdlRGF0YSwgc3RyZWFtKTtcblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBjbWQuc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgICAgY291bnQgKz0gZGF0YS5sZW5ndGg7XG4gICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoKGNvdW50IC8gZmlsZVNpemUgKiAxMDApLnRvRml4ZWQoMikgKyBcIiUgICBcXHJcIik7XG4gICAgICAgIH0pLnBpcGUoZ3ppcCkucGlwZShzdHJlYW0pLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgbG9nKCdEb2NrZXItdHJhbnNmZXIgc3RyZWFtIGVuZGVkJyk7XG4gICAgICAgICAgc29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSlcbn07XG5cbiJdfQ==