const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const parse = require('url').parse;
const multi = require('multimeter')(process);

// Parse arguments.
const url = process.argv.pop();
const warmth = parseInt(process.argv.pop(), 10) || 30;

// Initialize client.
const options = Object.assign(parse(url), {
  key: fs.readFileSync(path.join(__dirname, '../data/localhost.key')),
  ca: fs.readFileSync(path.join(__dirname, '../data/localhost.crt')),
});
const request = http2.get(options);

var requests = 0;
function receive(path, push, bar, res) {
  var bytesRead = 0;
  //res.resume();
  res.on('data', (data) {
    bytesRead +=
    bar.progress(
    multi.charm.write('Data!\n');
  });
  res.on('end', () => {
    multi.charm.write('Done!\n');
    requests--;
    if (!requests) {
      //process.exit();
    }
  });
}

multi.on('^C', process.exit);
multi.charm.reset();

request.on('response', receive.bind(null, options.path, false));
request.on('push', (push) => {
  const width = 20;
  const bar = multi(0, requests++, {
    width,
    solid: {text: '|'},
    empty: {text: ' '},
  });

  multi.charm.move(width + 10, 0);
  multi.charm.write(push.url + '\n');

  // Simulate warm cache by cancelling some push promises.
  if ((Math.random() * 100) < warmth) {
    //push.cancel();
    //return;
  }
  console.log(push.headers);

  push.on('response', receive.bind(null, push.url, true));
});
