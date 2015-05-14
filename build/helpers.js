'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.humanFileSize = humanFileSize;
exports.timestamp = timestamp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function humanFileSize(bytes) {
    var thresh = 1000;
    if (bytes < thresh) return bytes + ' B';
    var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (bytes >= thresh);
    return bytes.toFixed(1) + ' ' + units[u];
}

;

function timestamp() {
    return (0, _moment2['default'])().format('YYYY-MM-DD HH:mm:ss');
}