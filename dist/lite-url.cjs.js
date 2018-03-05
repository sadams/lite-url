/**
 * @version v1.0.5 (Mon, 05 Mar 2018 21:35:58 GMT)
 * @link https://github.com/sadams/lite-url.git
 * @license BSD-3-Clause
 */

'use strict';

/**
 * In memory cache for so we don't parse the same url twice
 * @type {Object}
 */
var memo = {};

/**
 * splits a string on the first occurrence of 'splitter' and calls back with the two entries.
 * @param {String} str
 * @param {String} splitter
 * @param {Function} callback
 */
function splitOnFirst(str, splitter, callback) {
  var parts = str.split(splitter);
  var first = parts.shift();
  callback(first, parts.join(splitter));
}

/**
 * @param {!String} str - the url to parse
 * @returns {Object}
 */
function uriParser(str) {
  var uri = {
    hash: '',
    host: '',
    hostname: '',
    origin: '',
    pathname: '',
    protocol: '',
    search: '',
    password: '',
    username: '',
    port: ''
  };
  var userPass;
  // http://user:pass@host.com:81/directory/file.ext?query=1#anchor
  splitOnFirst(str, '#', function (nonHash, hash) {
    // http://user:pass@host.com:81/directory/file.ext?query=1, anchor
    if (hash) {
      // #anchor
      uri.hash = hash ? `#${hash}` : '';
    }
    // http://user:pass@host.com:81/directory/file.ext?query=1
    splitOnFirst(nonHash, '?', function (nonSearch, search) {
      // http://user:pass@host.com:81/directory/file.ext, query=1
      if (search) {
        // ?query=1
        uri.search = `?${search}`;
      }
      if (!nonSearch) {
        // means we were given a query string only
        return;
      }
      // http://user:pass@host.com:81/directory/file.ext
      splitOnFirst(nonSearch, '//', (protocol, hostUserPortPath) => {
        // http:, user:pass@host.com:81/directory/file.ext
        uri.protocol = protocol;
        splitOnFirst(hostUserPortPath, '/', (hostUserPort, path) => {
          // user:pass@host.com:81, directory/file.ext
          uri.pathname = `/${path || ''}`; // /directory/file.ext
          if (uri.protocol || hostUserPort) {
            // http://user:pass@host.com:81
            uri.origin = `${uri.protocol}//${hostUserPort}`;
          }
          // user:pass@host.com:81
          splitOnFirst(hostUserPort, '@', (auth, hostPort) => {
            // user:pass, host.com:81
            if (!hostPort) {
              hostPort = auth;
            } else {
              // user:pass
              userPass = auth.split(':');
              uri.username = userPass[0];// user
              uri.password = userPass[1];// pass
            }
            // host.com:81
            uri.host = hostPort;
            splitOnFirst(hostPort, ':', (hostName, port) => {
              // host.com, 81
              uri.hostname = hostName; // host.com
              if (port) {
                uri.port = port; // 81
              }
            });
          });
        });
      });
    });
  });

  uri.href = uri.origin + uri.pathname + uri.search + uri.hash;

  return uri;
}

/**
 * @param {{
 *  search:?String
 * }} url
 * @returns {Object}
 */
function queryParser(url) {
  var params = {};
  var i;
  var pairs;
  var pair;
  let search = url.search;
  if (search) {
    search = search.replace(new RegExp('\\?'), '');
    pairs = search.split('&');
    for (i in pairs) {
      if (pairs.hasOwnProperty(i) && pairs[i]) {
        pair = pairs[i].split('=');
        params[pair[0]] = pair[1];
      }
    }
  }
  return params;
}

/**
 * Uri parsing method.
 * Returns: {
 * href: String,       // http://user:pass@host.com:81/directory/file.ext?query=1#anchor
 * protocol: String,  // http:
 * origin: String,    // http://user:pass@host.com:81
 * host: String,      // host.com:81
 * hostname: String,  // host.com
 * port: String,      // 81
 * pathname: String,  // /directory/file.ext
 * search: String,    // ?query=1
 * hash: String,      // #anchor
 * username: String,  // user
 * password: String
 * }
 * @param {String} str
 * @returns {{
 * href: String,
 * protocol: String,
 * origin: String,
 * host: String,
 * hostname: String,
 * port: String,
 * pathname: String,
 * search: String,
 * hash: String,
 * username: String,
 * password: String
 * }}
 * @export
 */
function liteURL(str) {
  let uri = memo[str];

  if (typeof uri !== 'undefined') {
    return uri;
  }

  // parsed url
  uri = uriParser(str);

  uri.params = queryParser(uri);

  // Stored parsed values
  memo[str] = uri;

  return uri;
}

liteURL.changeQueryParser = function (parser) {
  queryParser = parser;
};

module.exports = liteURL;
