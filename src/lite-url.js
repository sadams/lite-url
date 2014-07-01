(function(){
    'use strict';
    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;
    var memo = {};

    //http://stackoverflow.com/questions/27745/getting-parts-of-a-url-regex
    //              /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
    //https://gist.github.com/jlong/2428561#comment-310066
    //              /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/;
    //              /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?([^#]+))?)(#.*)?/; // gives query and search portions (without and with '?'
    //              /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?([^#]+))?)(#.*)?/; // as above but accepting missing password
    // Attribution to http://www.php.net/manual/en/function.parse-url.php#104958
    //              /^(([^:\/?#]+):)?((\/\/)?([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/
    //http://blog.stevenlevithan.com/archives/parseuri
    //              /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/


    /*
     ^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?([^#]+))?)(#.*)?

     */

    var uriParser = /^(?:(?:(([^:\/#\?]+:)?(?:(?:\/\/)(?:(?:(?:([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((?:\/?(?:[^\/\?#]+\/+)*)(?:[^\?#]*)))?(\?[^#]+)?)(#.*)?/;
//    var keys = ['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'];
    var keys = [
        "href",                    // http://user:pass@host.com:81/directory/file.ext?query=1#anchor
//        "noFragment",              // http://user:pass@host.com:81/directory/file.ext?query=1
//        "noQuery",                 // http://user:pass@host.com:81/directory/file.ext
        "origin",                  // http://user:pass@host.com:81
        "protocol",                // http:
//        "slashes",                 // //
//        "authority",               // user:pass@host.com:81
//        "userInfo",                // user:pass
        "username",                // user
        "password",                // pass
        "host",                    // host.com:81
        "hostname",                // host.com
        "port",                    // 81
        "pathname",                // /directory/file.ext
//        "directory",               // /directory/
//        "filename",                // file.ext
        "search",                  // ?query=1
        "hash"                     // #anchor
    ];
//    {
//        "hash": "#anchor",
//        "search": "?query=1",
//        "pathname": "/directory/file.ext",
//        "port": "8080",
//        "hostname": "example.com",
//        "host": "example.com:8080",
//        "password": "pass",
//        "username": "user",
//        "protocol": "http:",
//        "origin": "http://example.com:8080",
//        "href": "http://user:pass@example.com:8080/directory/file.ext?query=1#anchor"
//    }
    var queryParser = /(?:^|&)([^&=]*)=?([^&]*)/g;

    /**
     * Uri parsing method.
     * Inspired by http://blog.stevenlevithan.com/archives/parseuri
     *
     * @param str
     * @returns {{
     *   anchor:string,
     *   query:string,
     *   file:string,
     *   directory:string,
     *   path:string,
     *   relative:string,
     *   port:string,
     *   host:string,
     *   password:string,
     *   user:string,
     *   userInfo:string,
     *   authority:string,
     *   protocol:string,
     *   source:string,
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

        uri.params = {};

        var query = uri.search ? uri.search.substring( uri.search.indexOf('?') + 1 ) : '';
        query.replace(queryParser, function ($0, $1, $2) {
            //search isn't actually modified, .replace is used as an iterator to populate params
            if ($1) {
                uri.params[$1] = $2;
            }
        });

        // Stored parsed values
        memo[str] = uri;

        return uri;
    }

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