'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var net = require('net');
var fs = require('fs');
var zlib = require('zlib');
var helpers = require('./helpers.js');
var child_process = require('child_process');
var buffer = require('buffer');

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
var gunzip = zlib.createGunzip();

server.listen(args.port, args.host, function() {
  if (args.verbose) console.log('Bound to: ', args.host, args.port);

  server.on('connection', function(conn) {
    var connIp = conn.remoteAddress;
    var connPort = conn.remotePort;
    console.log(connIp+':'+connPort, 'connected.');

    conn.on('close', function() {
      console.log("\n" + connIp+':'+connPort, 'disconnected.');
    });

    conn.on('data', function(data) {
      process.stdout.write('Data received: ' + helpers.humanFileSize(conn.bytesRead) + "                \r");
    });

    var cmd = child_process.spawn('docker', ['import', '-', 'tjenna']);
    conn.pipe(gunzip).pipe(cmd.stdin);
  });
});

server.on('error', function(err) {
  console.log(err);
});
