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
     * For parsing query params out
     * @type {RegExp}
     */
    var queryParserRegex = /(?:^|&)([^&=]*)=?([^&]*)/g;

    /**
     * For parsing a url into component parts
     * there are other parts which are suppressed (?:) but we only want to represent what would be available
     *  from `(new URL(urlstring))` in this api.
     *
     * @type {RegExp}
     */
    var uriParser = /^(?:(?:(([^:\/#\?]+:)?(?:(?:\/\/)(?:(?:(?:([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((?:\/?(?:[^\/\?#]+\/+)*)(?:[^\?#]*)))?(\?[^#]+)?)(#.*)?/;
    var keys = [
        "href",                    // http://user:pass@host.com:81/directory/file.ext?query=1#anchor
        "origin",                  // http://user:pass@host.com:81
        "protocol",                // http:
        "username",                // user
        "password",                // pass
        "host",                    // host.com:81
        "hostname",                // host.com
        "port",                    // 81
        "pathname",                // /directory/file.ext
        "search",                  // ?query=1
        "hash"                     // #anchor
    ];

    /**
     * @param {string} uri
     * @returns {{}}
     */
    function queryParser(uri) {
        var params = {};

        //strip the question mark from search
        var query = uri.search ? uri.search.substring( uri.search.indexOf('?') + 1 ) : '';
        query.replace(queryParserRegex, function ($0, $1, $2) {
            //query isn't actually modified, .replace() is used as an iterator to populate params
            if ($1) {
                params[$1] = $2;
            }
        });
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
        } else {
            //final object to return
            uri = {};
        }

        //parsed url
        var matches   = uriParser.exec(str);

        //number of indexes pulled from the url via the urlParser (see 'keys')
        var i   = keys.length;

        while (i--) {
            uri[keys[i]] = matches[i] || '';
        }

        uri.params = queryParser(uri);

        // Stored parsed values
        memo[str] = uri;

        return uri;
    }

    /**
     * @callback queryParser
     */
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