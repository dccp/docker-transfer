var server = require('http').createServer(),
    io = require('socket.io')(server),
    ss = require('socket.io-stream'),
    fs = require('fs'),
    zlib = require('zlib'),
    helpers = require('./helpers.js'),
    child_process = require('child_process'),
    buffer = require('buffer'),
    gunzip = zlib.createGunzip();

let open;

let exports = {
  receive(name, port) {
    let host = '0.0.0.0';

    return new Promise((resolve, reject) => {
      let callback = function() {
        log('SERVER: listening at ' + host + ":" + port);
        io.sockets.on('connection', socket => {
          log('SERVER: received connection');
          ss(socket).on('docker', function(metadata, stream) {
            let count = 0;
            let cmd = child_process.spawn('docker', ['load']);
            stream.pipe(gunzip)
              .on('data', data => {
                count += data.length;
                process.stdout.write((count / metadata.VirtualSize * 100).toFixed(2) + '%    \r');
              })
              .on('end', () => {
                log('SERVER: End of stream. Data received: ' + helpers.humanFileSize(count));
                child_process.spawn('docker', ['tag', metadata.Id, name]);
                resolve(metadata.Id);
              })
              .pipe(cmd.stdin);
          });
          socket.on('disconnect', function() {
            server.close();
            open = false;
            log('Docker-transfer server disconnected');
          });
        });
      }

      if (open) {
        socket.removeAllListeners('connection');
        server.close(function() {
            server.listen(port, host, callback);
        });
      } else {
        open = true;
        server.listen(port, host, callback());
      }
      server.on('error', err => {
        reject(err);
      });
    });
  },
  run(hash, port) {
    let ports = [port, ':', 80].join('');
    // docker run -d -p $EXTERNAL_PORT:$INTERNAL_PORT $IMAGE_HASH
    child_process.spawn('docker', ['run', '-d', '-p', ports, metadata.Id]);
  }
};

function log(str) {
    console.log(helpers.timestamp(), str);
}

export default exports;

