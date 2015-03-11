'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var net = require('net');
var fs = require('fs');
var spawn = require('child_process').spawn;

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

var client = new net.Socket();

client.connect(args.port, args.host, function() {
  if (args.verbose) console.log('Connected to: ', args.host, args.port);
  if (args.verbose) console.log('Reading docker image:', args.imageHash);
  var cmd = spawn('docker', ['save', args.imageHash]);
  if (args.verbose) console.log('Sending docker image...');
  cmd.stdout.pipe(client);
  cmd.stderr.on('data', function(data) { console.log("err: " + data); });
});

client.on('error', function(err) {
  console.log(err);
});
