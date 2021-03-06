/* jscs:disable requireDotNotation */

const fixtures = require('../data/fixtures');

function dedupe(arr) {
  return Object.keys(arr.reduce((obj, value) => {
    obj[value] = true;
    return obj;
  }, {}));
}

const store = module.exports = {
  getPayload(path) {
    const fixture = fixtures[path];
    if (!fixture) {
      return null;
    }

    const obj = {
      path,
      body: JSON.stringify(fixture),
      references: store.getReferences(fixture),
    };

    const headers = obj.headers = {
      'content-type': 'application/json',
      'content-length': obj.body.length,
    };
    if (fixture['__etag']) {
      headers.etag = fixture['__etag'];
    }

    return obj;
  },

  getReferences(fixture) {
    return dedupe(Object.keys(fixture).reduce((refs, key) => {
      const value = fixture[key];
      if (value && typeof value === 'object') {
        const path = value['__path'];
        if (path) {
          refs.push(path);
        } else {
          refs = refs.concat(store.getReferences(value));
        }
      }
      return refs;
    }, []));
  },
};
