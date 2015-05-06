// Imports
import io from "socket.io-client";
import ss from "socket.io-stream";
import fs from "fs";
import zlib from "zlib";
import child_process from "child_process";
import Docker from "dockerode";

import helpers from "./helpers.js";

// Dockerode instantiation
let docker = new Docker({socketPath: '/var/run/docker.sock'});
let gzip = zlib.createGzip();

function log(str) {
    console.log(helpers.timestamp(), str);
}

export default {
  listImages: () => new Promise((resolve, reject) => docker.listImages({all: false}, (err, images) => {
    if (err) {
      reject(err);
    } else {
      resolve(images);
    }
  })),
  sendImage: (imageHash, host, port = 1208) => new Promise((resolve, reject) => {
    let image = docker.getImage(imageHash);
    image.inspect((err, imageData) => {
      let fileSize = imageData.VirtualSize;
      let socket = io.connect(`http://${host}:${port}`);

      socket.on('connect', () => {
        log('CLIENT: connected to' + host + ":" + port);
        log('CLIENT: compressing image ' + imageHash);
        let cmd = child_process.spawn('docker', ['save', imageHash]);
        let stream = ss.createStream();

        ss(socket).emit('docker', imageData, stream);

        log('CLIENT: sent image metadata for ' + imageHash);

        let count = 0;
        cmd.stdout.on('data', data => {
          count += data.length;
          process.stdout.write((count / fileSize * 100).toFixed(2) + "%   \r");
        }).pipe(gzip).pipe(stream).on('end', () => {
          log('CLIENT: End of stream.');
          socket.close();
          resolve(true);
        });
      });
    });
  })
};

