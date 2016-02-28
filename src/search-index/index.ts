self.window = self;
self.window.window = self;

importScripts('/assets/search-index-lib.js');

let { buffer, stream, level, si } = (window as any).__search_index_lib__;

let searchIndex = fetch('/doc/index.gz').then(res => res.arrayBuffer());

Promise.all([searchIndex]).then(([idx]) => {
    let options = {
        indexPath: 'reutersindex',
        db: level
    };

    let buf = new buffer.Buffer(idx);
    let bufferStream = new stream.PassThrough();
    bufferStream.end(buf);

    console.log('serialization started');

    si(options, (err, index) => {
        console.log(err);
        index.replicate(bufferStream, function(callback) {
          console.log('db serialized');
        });
    });
});

// addEventListener('message', function(e) {
//   let data = e.data;
//   switch (data.cmd) {
//     case 'start':
//       self.postMessage('WORKER STARTED: ' + data.msg);
//       break;
//     default:
//       self.postMessage('Unknown command: ' + data.msg);
//   };
// }, false);
