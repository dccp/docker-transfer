// Imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _socketIoClient = require("socket.io-client");

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var _socketIoStream = require("socket.io-stream");

var _socketIoStream2 = _interopRequireDefault(_socketIoStream);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _zlib = require("zlib");

var _zlib2 = _interopRequireDefault(_zlib);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _dockerode = require("dockerode");

var _dockerode2 = _interopRequireDefault(_dockerode);

var helpers = require("./helpers.js");

// Dockerode instantiation
var docker = new _dockerode2["default"]({ socketPath: "/var/run/docker.sock" });
var gzip = _zlib2["default"].createGzip();

function log(str) {
  console.log(helpers.timestamp(), str);
}

var _exports = {
  listImages: function listImages() {
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
  sendImage: function sendImage(imageHash, host) {
    var port = arguments[2] === undefined ? 1208 : arguments[2];
    return new Promise(function (resolve, reject) {
      var image = docker.getImage(imageHash);
      image.inspect(function (err, imageData) {
        var fileSize = imageData.VirtualSize;
        var socket = _socketIoClient2["default"].connect("http://" + host + ":" + port);

        socket.on("connect", function () {
          log("CLIENT: connected to " + host + ":" + port);
          log("CLIENT: compressing image " + imageHash);
          var cmd = _child_process2["default"].spawn("docker", ["save", imageHash]);
          var stream = _socketIoStream2["default"].createStream();

          (0, _socketIoStream2["default"])(socket).emit("docker", imageData, stream);

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

exports["default"] = _exports;
module.exports = exports["default"];