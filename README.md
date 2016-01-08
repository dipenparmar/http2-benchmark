# http2-benchmark

Simple benchmark of HTTP/2 server push using [`node-http2`](https://github.com/molnarg/node-http2).

## How to run locally

Ensure `./node_modules/.bin` is in your path, then run:

```bash
npm install
node src/server.js &
node src/client.js http://localhost:3000/tweets/1
```

## How it works

TODO
