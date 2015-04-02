// Imports
var net = require('net');
var fs = require('fs');
var zlib = require('zlib');
var helpers = require('./helpers.js');
var child_process = require('child_process');

// Dockerode instantiation
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

// app.get('/getAvailableImages', function(req, res) {
//   docker.listImages({all: false}, function(err, images) {
//     res.json(images);
//   });
// });

/*
 * Functions
 */
function sendDocker(host, port, imageHash) {
  var gzip = zlib.createGzip();
  var client = new net.Socket();
  client.connect(host, port, function() {
    if (args.verbose) {
      console.log('Connected to: ', host, port);
      child_process.exec('docker inspect ' + imageHash, function(error, stdout, stderr) {
        var images = JSON.parse(stdout);
        console.log('Image size: ', helpers.humanFileSize(images[0]['VirtualSize']));
      });
      console.log('Connected to: ', host, port);
      console.log('Reading docker image:', imageHash);
    }
    var cmd = child_process.spawn('docker', ['save', imageHash]);
    if (args.verbose) console.log('Sending docker image...');
    // var interval = setInterval(function() {
    //   process.stdout.write('Written ' + helpers.humanFileSize(client.bytesWritten) + "         \r");
    // }, 1000);

    cmd.stdout.pipe(gzip).pipe(client);
    // .on('finish', function() {
    //   clearInterval(interval);
    //   if (args.verbose) console.log('Finished successfully!');
    // });

    cmd.stderr.on('data', function(data) {
      console.log("err: " + data);
    });
  });

  client.on('error', function(err) {
    console.log(err);
  });
}
