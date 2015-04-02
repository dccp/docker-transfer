// Imports
var net = require('net');
var fs = require('fs');
var zlib = require('zlib');
var helpers = require('./helpers.js');
var child_process = require('child_process');

// Dockerode instantiation
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

export default {
  listImages() => new Promise((resolve, reject) => docker.listImages({all: false}, function(err, images) {
    if (err) {
      reject(err);
    } else {
      resolve(images);
    }
  })),
  sendImage(imageHash, host, port = 1208) => new Promise((resolve, reject) => {
    var gzip = zlib.createGzip();
    var client = new net.Socket();
    client.connect(host, port, () => {
      var cmd = child_process.spawn('docker', ['save', imageHash]);

      cmd.stderr.on('data', (data) => {
        reject(data);
      });

      cmd.stdout.pipe(gzip).pipe(client);

      resolve(true);
    });

    client.on('error', (err) => {
      reject(err);
    });
  })
}
