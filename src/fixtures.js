module.exports = {

  '/tweets/1': {
    __etag: 'forever',

    id: 'tweet_1',
    contents: 'This is a tweet.',

    author: { __path: '/users/1' },
  },

  '/tweets/2': {
    __etag: 'forever',

    id: 'tweet_2',
    contents: 'This is another tweet.',

    author: { __path: '/users/1' },
  },

  '/users/1': {
    __etag: 'updated yesterday',

    id: 'user_1',
    name: 'James Reggio',
    handle: 'jamesreggio',
  },

};
