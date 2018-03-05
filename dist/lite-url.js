/**
 * lite-url - Small, JS lib that uses regex for parsing a URL into it's component parts.
 * @version v1.0.5
 * @link https://github.com/sadams/lite-url
 * @license BSD-3-Clause
 */
(function(){
    'use strict';

    /**
     * Establish the root object, `window` in the browser, or `exports` on the server.
     */
    var root = this;

    /**
     * In memory cache for so we don't parse the same url twice
     * @type {{}}
     */
    var memo = {};

    /**
     * splits a string on the first occurrence of 'splitter' and calls back with the two entries.
     * @param {string} str
     * @param {string} splitter
     * @param {function} callback
     * @return *
     */
    function splitOnFirst(str, splitter, callback) {
        var parts = str.split(splitter);
        var first = parts.shift();
        return callback(first, parts.join(splitter));
    }

    /**
     *
     * @param {string} str - the url to parse
     * @returns {{
     * href: string       // http://user:pass@host.com:81/directory/file.ext?query=1#anchor
     * protocol: string,  // http:
     * origin: string,    // http://user:pass@host.com:81
     * host: string,      // host.com:81
     * hostname: string,  // host.com
     * port: string,      // 81
     * pathname: string,  // /directory/file.ext
     * search: string,    // ?query=1
     * hash: string,      // #anchor
     * username: string,  // user
     * password: string,  // pass
     * username: string,  // user
     * }}
     */
    function uriParser(str) {
        var uri = {
            hash:'',
            host:'',
            hostname:'',
            origin:'',
            pathname:'',
            protocol:'',
            search:'',
            password:'',
            username:'',
            port:''
        };
        // http://user:pass@host.com:81/directory/file.ext?query=1#anchor
        splitOnFirst(str, '#', function(nonHash, hash) {
            // http://user:pass@host.com:81/directory/file.ext?query=1, anchor
            if (hash) {
                // #anchor
                uri.hash = hash ? '#' + hash : '';
            }
            // http://user:pass@host.com:81/directory/file.ext?query=1
            splitOnFirst(nonHash, '?', function(nonSearch, search) {
                // http://user:pass@host.com:81/directory/file.ext, query=1
                if (search) {
                    // ?query=1
                    uri.search = '?' + search;
                }
                if (!nonSearch) {
                    //means we were given a query string only
                    return;
                }
                // http://user:pass@host.com:81/directory/file.ext
                splitOnFirst(nonSearch, '//', function(protocol, hostUserPortPath) {
                    // http:, user:pass@host.com:81/directory/file.ext
                    uri.protocol = protocol;
                    splitOnFirst(hostUserPortPath, '/', function(hostUserPort, path) {
                        // user:pass@host.com:81, directory/file.ext
                        uri.pathname = '/' + (path || ''); // /directory/file.ext
                        if (uri.protocol || hostUserPort) {
                            // http://user:pass@host.com:81
                            uri.origin = uri.protocol + '//' + hostUserPort;
                        }
                        // user:pass@host.com:81
                        splitOnFirst(hostUserPort, '@', function(auth, hostPort){
                            // user:pass, host.com:81
                            if (!hostPort) {
                                hostPort = auth;
                            } else {
                                // user:pass
                                var userPass = auth.split(':');
                                uri.username = userPass[0];// user
                                uri.password = userPass[1];// pass
                            }
                            // host.com:81
                            uri.host = hostPort;
                            splitOnFirst(hostPort, ':', function(hostName, port){
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
     * @param {string} uri
     * @returns {{}}
     */
    function queryParser(uri) {
        var params = {};
        var search = uri.search;
        if (search) {
            search = search.replace(new RegExp('\\?'), '');
            var pairs = search.split('&');
            for (var i in pairs) {
                if (pairs.hasOwnProperty(i) && pairs[i]) {
                    var pair = pairs[i].split('=');
                    params[pair[0]] = pair[1];
                }
            }
        }
        return params;
    }

    /**
     * Uri parsing method.
     *
     * @param {string} str
     * @returns {{
     *   href:string,
     *   origin:string,
     *   protocol:string,
     *   username:string,
     *   password:string,
     *   host:string,
     *   hostname:string,
     *   port:string,
     *   path:string,
     *   search:string,
     *   hash:string,
     *   params:{}
     * }}
     */
    function liteURL(str) {
        // We first check if we have parsed this URL before, to avoid running the
        // monster regex over and over (which is expensive!)
        var uri = memo[str];

        if (typeof uri !== 'undefined') {
            return uri;
        }

        //parsed url
        uri = uriParser(str);

        uri.params = queryParser(uri);

        // Stored parsed values
        memo[str] = uri;

        return uri;
    }

    liteURL.changeQueryParser = function(parser) {
        queryParser = parser;
    };

    //moduleType support
    if (typeof exports !== 'undefined') {
        //supports node
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = liteURL;
        }
        exports.liteURL = liteURL;
    } else {
        //supports globals
        root.liteURL = liteURL;
    }

    //supports requirejs/amd
    return liteURL;
}).call(this);
