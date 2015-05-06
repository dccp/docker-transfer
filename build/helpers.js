"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.humanFileSize = humanFileSize;
exports.timestamp = timestamp;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var moment = _interopRequire(require("moment"));

function humanFileSize(bytes) {
    var thresh = 1000;
    if (bytes < thresh) {
        return bytes + " B";
    }var units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (bytes >= thresh);
    return bytes.toFixed(1) + " " + units[u];
}

;

function timestamp() {
    return moment().format("YYYY-MM-DD h:mm:ss");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7UUFFZ0IsYUFBYSxHQUFiLGFBQWE7UUFZYixTQUFTLEdBQVQsU0FBUzs7Ozs7SUFkbEIsTUFBTSwyQkFBTSxRQUFROztBQUVwQixTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUU7QUFDakMsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUcsS0FBSyxHQUFHLE1BQU07QUFBRSxlQUFPLEtBQUssR0FBRyxJQUFJLENBQUM7S0FBQSxBQUN2QyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztBQUN0RCxRQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNYLE9BQUc7QUFDQyxhQUFLLElBQUksTUFBTSxDQUFDO0FBQ2hCLFVBQUUsQ0FBQyxDQUFDO0tBQ1AsUUFBTyxLQUFLLElBQUksTUFBTSxFQUFFO0FBQ3pCLFdBQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3hDOztBQUFBLENBQUM7O0FBRUssU0FBUyxTQUFTLEdBQUc7QUFDeEIsV0FBTyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQztDQUNoRCIsImZpbGUiOiJzcmMvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuZXhwb3J0IGZ1bmN0aW9uIGh1bWFuRmlsZVNpemUoYnl0ZXMpIHtcbiAgICB2YXIgdGhyZXNoID0gMTAwMDtcbiAgICBpZihieXRlcyA8IHRocmVzaCkgcmV0dXJuIGJ5dGVzICsgJyBCJztcbiAgICB2YXIgdW5pdHMgPSBbJ2tCJywnTUInLCdHQicsJ1RCJywnUEInLCdFQicsJ1pCJywnWUInXTtcbiAgICB2YXIgdSA9IC0xO1xuICAgIGRvIHtcbiAgICAgICAgYnl0ZXMgLz0gdGhyZXNoO1xuICAgICAgICArK3U7XG4gICAgfSB3aGlsZShieXRlcyA+PSB0aHJlc2gpO1xuICAgIHJldHVybiBieXRlcy50b0ZpeGVkKDEpKycgJyt1bml0c1t1XTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBoOm1tOnNzJyk7XG59XG4iXX0=