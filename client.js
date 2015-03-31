'use strict';

// Imports
var ArgumentParser = require('argparse').ArgumentParser;
var net = require('net');
var fs = require('fs');
var zlib = require('zlib');
var helpers = require('./helpers.js');
var child_process = require('child_process');
var express = require('express');
var app = express();

// Dockerode instantiation
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

/*
 * Arguments
 */
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Zeppelin client'
});
parser.addArgument(['-p', '--port'], {defaultValue: 1208, type: 'int', help: 'Set the port number to connect to'});
parser.addArgument(['-V', '--verbose'], {defaultValue: true, action: 'storeTrue', help: 'Print debug information'});
var args = parser.parseArgs();
if (args.verbose) console.dir(args);

/*
 * REST routes
 */
var server = app.listen(args.port, function() {
  console.log('Docker transfer running on %s:%s', server.address().address, server.address().port);
});

app.get('/getAvailableImages', function(req, res) {
  docker.listImages({all: false}, function(err, images) {
    res.json(images);
  });
});

app.post('/sendDocker', function(req, res) {
  res.json({test:'dooonee'});
})

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
