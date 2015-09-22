const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const parse = require('url').parse;

const url = parse(process.argv.pop());
const request = http2.raw.get(url);

var requests = 1;
function receive(path, push, res) {
  console.log(`< ${res.statusCode} ${push ? 'P' : ' '} ${path}`);
  res.resume();
  res.on('end', () => {
    requests--;
    if (!requests) {
      process.exit();
    }
  });
}

request.on('response', receive.bind(null, url.path, false));
request.on('push', (push) => {
  push.on('response', receive.bind(null, push.url, true));
  requests++;
});
