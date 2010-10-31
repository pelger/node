var assert =require('assert');
var net = require('net');
var IOWatcher = process.binding('io_watcher').IOWatcher;

var stdout = new net.Stream(1);
var w = stdout._writeWatcher;

mb = 50*1024*1024;
b = Buffer(mb);
for (var i = 0; i < mb; i++) {
  b[i] = 100;
}

/* Total size 2*1024*1024 + 6 = 2097158 */


IOWatcher.dumpQueue.next = w;
w.buckets = { data: b };
w.buckets.next = { data: b };
w.buckets.next.next = { data: b };
w.buckets.next.next.next = { data: b };
w.buckets.next.next.next.next = { data: "\ndone\n" };

setTimeout(function () {
  // In the first 10 ms, we haven't pushed out the 2mb of data.
  assert.ok(null !==  IOWatcher.dumpQueue.next);
}, 10);

setTimeout(function () {
  // But after one second, we have.
  //assert.equal(null, IOWatcher.dumpQueue.next);
}, 1000);
