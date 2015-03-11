'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var net = require('net');
var fs = require('fs');
var zlib = require('zlib');
var helpers = require('./helpers.js');
var child_process = require('child_process');

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Zeppelin client'
});
parser.addArgument(['-H', '--host'], {defaultValue: 'localhost', help: 'Set the host to connect to'});
parser.addArgument(['-p', '--port'], {defaultValue: 1208, type: 'int', help: 'Set the port number to connect to'});
parser.addArgument(['-V', '--verbose'], {defaultValue: true, action: 'storeTrue', help: 'Print debug information'});
parser.addArgument(['imageHash'], {help: 'The hash to use'});

var args = parser.parseArgs();

if (args.verbose) console.dir(args);

var gzip = zlib.createGzip();
var client = new net.Socket();

client.connect(args.port, args.host, function() {
  if (args.verbose) {
    console.log('Connected to: ', args.host, args.port);
    child_process.exec('docker inspect ' + args.imageHash, function(error, stdout, stderr) {
      var images = JSON.parse(stdout);
      console.log('Image size: ', helpers.humanFileSize(images[0]['VirtualSize']));
    });
    console.log('Connected to: ', args.host, args.port);
    console.log('Reading docker image:', args.imageHash);
  }
  var cmd = child_process.spawn('docker', ['save', args.imageHash]);
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
