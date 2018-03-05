const assert = require('assert');

const liteUrl = require('../../');

describe('lite URL', () => {
  it('works as module', () => {
    // more advanced tests are run through browser
    const url = 'http://a:b@example.com:890/path/wah@t/foo.js?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang';
    const expected = {
      hash: '#foobar/bing/bo@ng?bang',
      search: '?foo=bar&bingobang=&king=kong@kong.com',
      pathname: '/path/wah@t/foo.js',
      port: '890',
      hostname: 'example.com',
      host: 'example.com:890',
      password: 'b',
      username: 'a',
      protocol: 'http:',
      origin: 'http://a:b@example.com:890',
      href: 'http://a:b@example.com:890/path/wah@t/foo.js?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang',
      params: {
        foo: 'bar',
        bingobang: '',
        king: 'kong@kong.com'
      }
    };
    assert.deepEqual(liteUrl(url), expected, 'url didn\'t match expected parsed output');
  });
});
