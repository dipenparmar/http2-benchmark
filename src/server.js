const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const store = require('./store');

function write(res, payload) {
  payload = Object.assign({
    status: 200,
    push: false,
  }, payload);

  // If a pushed resource, send the push promise.
  if (payload.push) {
    res = res.push(payload.path);
  }

  //console.log(
  //  `> ${payload.status} ${payload.push ? 'P' : ' '} ${payload.path}`
  //);

  // Write the payload.
  res.writeHead(payload.status, payload.headers);
  if (payload.body) {
    res.write(payload.body);
  }
  res.end();
}

const server = http2.createServer({
  key: fs.readFileSync(path.join(__dirname, '../data/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../data/localhost.crt')),
});
server.on('request', (req, res) => {
  const payload = store.getPayload(req.url);

  // Check for top-level payload at URL.
  if (!payload) {
    write(res, {
      status: 404,
      path: req.url,
    });
    return;
  }

  // Check that the client supports server push.
  if (!res.push) {
    write(res, {
      status: 406,
      path: req.url,
    });
    return;
  }

  // Write the top-level payload.
  write(res, payload);

  // Push each reference.
  payload.references.forEach((path) => {
    const payload = store.getPayload(path);
    if (!payload) {
      return;
    }
    write(res, Object.assign(payload, {push: true}));
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('http2-benchmark server is running on port', port);
});
