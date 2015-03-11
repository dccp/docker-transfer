'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var net = require('net');
var fs = require('fs');
var buffer = require('buffer');
var spawn = require('child_process').spawn;

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Zeppelin server'
});
parser.addArgument(['-H', '--host'], {defaultValue: 'localhost', help: 'Set the host to bind to'});
parser.addArgument(['-p', '--port'], {defaultValue: 1208, type: 'int', help: 'Set the port number to listen to'});
parser.addArgument(['-V', '--verbose'], {defaultValue: true, action: 'storeTrue', help: 'Print debug information'});

var args = parser.parseArgs();

if (args.verbose) console.dir(args);

var server = new net.createServer();

server.listen(args.port, args.host, function() {
  if (args.verbose) console.log('Bound to: ', args.host, args.port);

  server.on('connection', function(conn) {
    console.log('Client connected!');
    conn.on('data', function(data) {
      console.log('data received: ', data);
    });
  });
});

server.on('error', function(err) {
  console.log(err);
});
