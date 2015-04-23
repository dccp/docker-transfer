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
          console.log("Docker-transfer client connected to", host, port);
          var cmd = child_process.spawn("docker", ["save", imageHash]);
          var stream = ss.createStream();

          ss(socket).emit("docker", imageData, stream);

          var count = 0;
          cmd.stdout.on("data", function (data) {
            count += data.length;
            process.stdout.write((count / fileSize * 100).toFixed(3) + "%   \r");
          }).pipe(gzip).pipe(stream).on("end", function () {
            console.log("Docker-transfer stream ended");
            socket.close();
            resolve(true);
          });
        });
      });
    });
  }
};
//# sourceMappingURL=data:application/json;base64,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IjpbIi8vIEltcG9ydHNcbmltcG9ydCBpbyBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xuaW1wb3J0IHNzIGZyb20gXCJzb2NrZXQuaW8tc3RyZWFtXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgemxpYiBmcm9tIFwiemxpYlwiO1xuaW1wb3J0IGNoaWxkX3Byb2Nlc3MgZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCBEb2NrZXIgZnJvbSBcImRvY2tlcm9kZVwiO1xuXG5pbXBvcnQgaGVscGVycyBmcm9tIFwiLi9oZWxwZXJzLmpzXCI7XG5cbi8vIERvY2tlcm9kZSBpbnN0YW50aWF0aW9uXG5sZXQgZG9ja2VyID0gbmV3IERvY2tlcih7c29ja2V0UGF0aDogJy92YXIvcnVuL2RvY2tlci5zb2NrJ30pO1xubGV0IGd6aXAgPSB6bGliLmNyZWF0ZUd6aXAoKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBsaXN0SW1hZ2VzOiAoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiBkb2NrZXIubGlzdEltYWdlcyh7YWxsOiBmYWxzZX0sIChlcnIsIGltYWdlcykgPT4ge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKGltYWdlcyk7XG4gICAgfVxuICB9KSksXG4gIHNlbmRJbWFnZTogKGltYWdlSGFzaCwgaG9zdCwgcG9ydCA9IDEyMDgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgaW1hZ2UgPSBkb2NrZXIuZ2V0SW1hZ2UoaW1hZ2VIYXNoKTtcbiAgICBpbWFnZS5pbnNwZWN0KChlcnIsIGltYWdlRGF0YSkgPT4ge1xuICAgICAgbGV0IGZpbGVTaXplID0gaW1hZ2VEYXRhLlZpcnR1YWxTaXplO1xuICAgICAgbGV0IHNvY2tldCA9IGlvLmNvbm5lY3QoYGh0dHA6Ly8ke2hvc3R9OiR7cG9ydH1gKTtcblxuICAgICAgc29ja2V0Lm9uKCdjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnRG9ja2VyLXRyYW5zZmVyIGNsaWVudCBjb25uZWN0ZWQgdG8nLCBob3N0LCBwb3J0KTtcbiAgICAgICAgbGV0IGNtZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ2RvY2tlcicsIFsnc2F2ZScsIGltYWdlSGFzaF0pO1xuICAgICAgICBsZXQgc3RyZWFtID0gc3MuY3JlYXRlU3RyZWFtKCk7XG5cbiAgICAgICAgc3Moc29ja2V0KS5lbWl0KCdkb2NrZXInLCBpbWFnZURhdGEsIHN0cmVhbSk7XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgY21kLnN0ZG91dC5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICAgIGNvdW50ICs9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKChjb3VudCAvIGZpbGVTaXplICogMTAwKS50b0ZpeGVkKDMpICsgXCIlICAgXFxyXCIpO1xuICAgICAgICB9KS5waXBlKGd6aXApLnBpcGUoc3RyZWFtKS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdEb2NrZXItdHJhbnNmZXIgc3RyZWFtIGVuZGVkJyk7XG4gICAgICAgICAgc29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSlcbn07XG5cbiJdfQ==