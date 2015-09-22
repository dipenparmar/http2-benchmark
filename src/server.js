const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const store = require('./store');

function write(res, payload) {
  payload = Object.assign({
    status: 200,
    push: false,
  }, payload);

  if (payload.push) {
    res = res.push(payload.path);
  }

  console.log(`> ${payload.status} ${payload.push ? 'P' : ' '} ${payload.path}`);

  res.writeHead(payload.status, null, payload.headers);
  if (payload.body) {
    res.write(payload.body);
  }
  res.end();
}

const server = http2.raw.createServer({});
server.on('request', function(req, res) {
  const payload = store.getPayload(req.url);

  if (!payload) {
    write(res, {
      status: 404,
      path: req.url,
    });
    return;
  }

  if (!res.push) {
    write(res, {
      status: 406,
      path: req.url,
    });
    return;
  }

  write(res, payload);

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
