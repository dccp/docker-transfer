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
//# sourceMappingURL=data:application/json;base64,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LENBQUMsQ0FBQztBQUM5QixrQkFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2YsbUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNmLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUM7R0FBQTtDQUNIIiwiZmlsZSI6InNyYy9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnRzXG5pbXBvcnQgaW8gZnJvbSBcInNvY2tldC5pby1jbGllbnRcIjtcbmltcG9ydCBzcyBmcm9tIFwic29ja2V0LmlvLXN0cmVhbVwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHpsaWIgZnJvbSBcInpsaWJcIjtcbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgRG9ja2VyIGZyb20gXCJkb2NrZXJvZGVcIjtcblxuaW1wb3J0IGhlbHBlcnMgZnJvbSBcIi4vaGVscGVycy5qc1wiO1xuXG4vLyBEb2NrZXJvZGUgaW5zdGFudGlhdGlvblxubGV0IGRvY2tlciA9IG5ldyBEb2NrZXIoe3NvY2tldFBhdGg6ICcvdmFyL3J1bi9kb2NrZXIuc29jayd9KTtcbmxldCBnemlwID0gemxpYi5jcmVhdGVHemlwKCk7XG5cbmZ1bmN0aW9uIGxvZyhzdHIpIHtcbiAgICBjb25zb2xlLmxvZyhoZWxwZXJzLnRpbWVzdGFtcCgpLCBzdHIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGxpc3RJbWFnZXM6ICgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGRvY2tlci5saXN0SW1hZ2VzKHthbGw6IGZhbHNlfSwgKGVyciwgaW1hZ2VzKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoaW1hZ2VzKTtcbiAgICB9XG4gIH0pKSxcbiAgc2VuZEltYWdlOiAoaW1hZ2VIYXNoLCBob3N0LCBwb3J0ID0gMTIwOCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBpbWFnZSA9IGRvY2tlci5nZXRJbWFnZShpbWFnZUhhc2gpO1xuICAgIGltYWdlLmluc3BlY3QoKGVyciwgaW1hZ2VEYXRhKSA9PiB7XG4gICAgICBsZXQgZmlsZVNpemUgPSBpbWFnZURhdGEuVmlydHVhbFNpemU7XG4gICAgICBsZXQgc29ja2V0ID0gaW8uY29ubmVjdChgaHR0cDovLyR7aG9zdH06JHtwb3J0fWApO1xuXG4gICAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIGxvZygnQ0xJRU5UOiBjb25uZWN0ZWQgdG8nICsgaG9zdCArIFwiOlwiICsgcG9ydCk7XG4gICAgICAgIGxvZygnQ0xJRU5UOiBjb21wcmVzc2luZyBpbWFnZSAnICsgaW1hZ2VIYXNoKTtcbiAgICAgICAgbGV0IGNtZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ2RvY2tlcicsIFsnc2F2ZScsIGltYWdlSGFzaF0pO1xuICAgICAgICBsZXQgc3RyZWFtID0gc3MuY3JlYXRlU3RyZWFtKCk7XG5cbiAgICAgICAgc3Moc29ja2V0KS5lbWl0KCdkb2NrZXInLCBpbWFnZURhdGEsIHN0cmVhbSk7XG5cbiAgICAgICAgbG9nKCdDTElFTlQ6IHNlbnQgaW1hZ2UgbWV0YWRhdGEgZm9yICcgKyBpbWFnZUhhc2gpO1xuXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGNtZC5zdGRvdXQub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICBjb3VudCArPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgoY291bnQgLyBmaWxlU2l6ZSAqIDEwMCkudG9GaXhlZCgyKSArIFwiJSAgIFxcclwiKTtcbiAgICAgICAgfSkucGlwZShnemlwKS5waXBlKHN0cmVhbSkub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICBsb2coJ0NMSUVOVDogRW5kIG9mIHN0cmVhbS4nKTtcbiAgICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KVxufTtcblxuIl19