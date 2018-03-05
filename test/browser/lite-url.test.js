var assert = window.chai.assert;

var fixtures = [
  {
    arguments: ['http://www.example.com'],
    expected: {
      hash: '',
      search: '',
      pathname: '/',
      port: '',
      hostname: 'www.example.com',
      host: 'www.example.com',
      password: '',
      username: '',
      protocol: 'http:',
      origin: 'http://www.example.com',
      href: 'http://www.example.com/',
      params: {}
    }
  },
  {
    arguments: ['http://www.example.com/#asdf'],
    expected: {
      hash: '#asdf',
      search: '',
      pathname: '/',
      port: '',
      hostname: 'www.example.com',
      host: 'www.example.com',
      password: '',
      username: '',
      protocol: 'http:',
      origin: 'http://www.example.com',
      href: 'http://www.example.com/#asdf',
      params: {}
    }
  },
  {
    arguments: ['http://www.example.com?foo=bar'],
    expected: {
      hash: '',
      search: '?foo=bar',
      pathname: '/',
      port: '',
      hostname: 'www.example.com',
      host: 'www.example.com',
      password: '',
      username: '',
      protocol: 'http:',
      origin: 'http://www.example.com',
      href: 'http://www.example.com/?foo=bar',
      params: {
        foo: 'bar'
      }
    }
  },
  {
    arguments: ['https://www.example.com/my/path'],
    expected: {
      hash: '',
      search: '',
      pathname: '/my/path',
      port: '',
      hostname: 'www.example.com',
      host: 'www.example.com',
      password: '',
      username: '',
      protocol: 'https:',
      origin: 'https://www.example.com',
      href: 'https://www.example.com/my/path',
      params: {}
    }
  },
  {
    arguments: ['http://www.example.com?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang'],
    expected: {
      hash: '#foobar/bing/bo@ng?bang',
      search: '?foo=bar&bingobang=&king=kong@kong.com',
      pathname: '/',
      port: '',
      hostname: 'www.example.com',
      host: 'www.example.com',
      password: '',
      username: '',
      protocol: 'http:',
      origin: 'http://www.example.com',
      href: 'http://www.example.com/?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang',
      params: {
        foo: 'bar',
        bingobang: '',
        king: 'kong@kong.com'
      }
    }
  },
  {
    arguments: ['http://a:b@example.com:890/path/wah@t/foo.js?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang'],
    expected: {
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
    }
  },
  {
    arguments: ['//a:b@example.com:890/path/wah@t/foo.js?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang'],
    expected: {
      hash: '#foobar/bing/bo@ng?bang',
      search: '?foo=bar&bingobang=&king=kong@kong.com',
      pathname: '/path/wah@t/foo.js',
      port: '890',
      hostname: 'example.com',
      host: 'example.com:890',
      password: 'b',
      username: 'a',
      protocol: '',
      origin: '//a:b@example.com:890',
      href: '//a:b@example.com:890/path/wah@t/foo.js?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang',
      params: {
        foo: 'bar',
        bingobang: '',
        king: 'kong@kong.com'
      }
    }
  },
  {
    arguments: ['?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?b#ang'],
    expected: {
      hash: '#foobar/bing/bo@ng?b#ang',
      search: '?foo=bar&bingobang=&king=kong@kong.com',
      pathname: '',
      port: '',
      hostname: '',
      host: '',
      password: '',
      username: '',
      protocol: '',
      origin: '',
      href: '?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?b#ang',
      params: {
        foo: 'bar',
        bingobang: '',
        king: 'kong@kong.com'
      }
    }
  },
  {
    arguments: ['http://192.20.10.112?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang'],
    expected: {
      hash: '#foobar/bing/bo@ng?bang',
      search: '?foo=bar&bingobang=&king=kong@kong.com',
      pathname: '/',
      port: '',
      hostname: '192.20.10.112',
      host: '192.20.10.112',
      password: '',
      username: '',
      protocol: 'http:',
      origin: 'http://192.20.10.112',
      href: 'http://192.20.10.112/?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang',
      params: {
        foo: 'bar',
        bingobang: '',
        king: 'kong@kong.com'
      }
    }
  },
  {
    arguments: ['http://192.20.10.112?&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang'],
    expected: {
      hash: '#foobar/bing/bo@ng?bang',
      search: '?&bingobang=&king=kong@kong.com',
      pathname: '/',
      port: '',
      hostname: '192.20.10.112',
      host: '192.20.10.112',
      password: '',
      username: '',
      protocol: 'http:',
      origin: 'http://192.20.10.112',
      href: 'http://192.20.10.112/?&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?bang',
      params: {
        bingobang: '',
        king: 'kong@kong.com'
      }
    }
  }
];
describe('liteURL', function () {
  fixtures.forEach(function (test) {
    it('test url: ' + test.arguments[0], function () {
      var actual = liteURL.apply(this, test.arguments);
      assert.deepEqual(actual, test.expected, 'liteURL didn\'t like: ' + test.arguments.join(', '));
    });
  });

  it('query parser', function () {
    var url = 'http://www.example.com?foo=bar&foo=pub&lipsum=lorem&lipsum=ipsum&lipsum=dolor#foobar/bing/bo@ng?bang';
    var expected = {
      hash: '#foobar/bing/bo@ng?bang',
      search: '?foo=bar&foo=pub&lipsum=lorem&lipsum=ipsum&lipsum=dolor',
      pathname: '/',
      port: '',
      hostname: 'www.example.com',
      host: 'www.example.com',
      password: '',
      username: '',
      protocol: 'http:',
      origin: 'http://www.example.com',
      href: 'http://www.example.com/?foo=bar&foo=pub&lipsum=lorem&lipsum=ipsum&lipsum=dolor#foobar/bing/bo@ng?bang',
      params: {
        foo: [
          'bar',
          'pub'
        ],
        lipsum: [
          'lorem',
          'ipsum',
          'dolor'
        ]
      }
    };
    liteURL.changeQueryParser(function (uri) {
      // strip the question mark from search
      var query = uri.search ? uri.search.substring(uri.search.indexOf('?') + 1) : '';
      var extractedParams = {};
      var existingParam;
      query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (ignore, key, value) {
        existingParam = extractedParams[key];
        // query isn't actually modified, .replace() is used as an iterator to populate params
        if (key) {
          if (existingParam) {
            if (existingParam instanceof Array) {
              existingParam.push(value);
            } else {
              extractedParams[key] = [existingParam, value];
            }
          } else {
            extractedParams[key] = value;
          }
        }
      });
      return extractedParams;
    });

    assert.deepEqual(liteURL(url), expected, 'liteURL didn\'t use new parser for query params in: ' + url);
  });
});
