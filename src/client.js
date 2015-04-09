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
  listImages: () => new Promise((resolve, reject) => docker.listImages({all: false}, (err, images) => {
    if (err) {
      reject(err);
    } else {
      resolve(images);
    }
  })),
  sendImage: (imageHash, host, port = 1208) => new Promise((resolve, reject) => {
    var gzip = zlib.createGzip();
    var client = new net.Socket();
    let image = docker.getImage(imageHash);
    image.inspect((err, imageData) => {
      let fileSize = imageData.VirtualSize;
      console.log(fileSize, host, port);
      client.connect(port, host, () => {
        console.log(fileSize, host, port);
        var cmd = child_process.spawn('docker', ['save', imageHash]);

        cmd.stderr.on('data', (data) => {
          reject(data);
        });

        let count = 0;
        cmd.stdout.on('data', (data) => {
          count += data.length;
          console.log(count / fileSize);
        }).pipe(gzip).pipe(client);

        cmd.stdout.on('end', () => {
          console.log('stream ended: finished');
          resolve(true);
        })
      });
    });

    client.on('error', (err) => {
      reject(err);
    });
  })
}
