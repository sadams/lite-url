[![NPM](https://nodei.co/npm/lite-url.png?downloads=true)](https://nodei.co/npm/lite-url/)

[![dependencies](https://david-dm.org/sadams/lite-url.png)](https://david-dm.org/sadams/lite-url)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/samadamslite.svg)](https://saucelabs.com/u/samadamslite)

# lite-url

A small cross-browser JS lib for parsing a URL into its component parts.

Broadly provides the same interface as the native [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) function, 
but in a cross browser way (taken from Chrome 35):

    new URL('http://user:pass@example.com:8080/directory/file.ext?query=1#anchor'); //results in...
    
    {
      "hash": "#anchor",
      "search": "?query=1",
      "pathname": "/directory/file.ext",
      "port": "8080",
      "hostname": "example.com",
      "host": "example.com:8080",
      "password": "pass",
      "username": "user",
      "protocol": "http:",
      "origin": "http://example.com:8080",
      "href": "http://user:pass@example.com:8080/directory/file.ext?query=1#anchor"
    }

# install

### manual

grab the minified version from `dist/`

### bower

    bower install --save lite-url

### npm

    npm install --save lite-url

(Since node.js already has built-in parsing functionality,
 this is only really useful if you are using [browserify](http://browserify.org/) and want to keep the size down).


## 2 variations from chrome

### 1. more permissive

The following will parse in this lib but not in chrome (this is intentional):

1. new URL('//user:pass@example.com:8080/directory/file.ext?query=1#anchor'); //results in empty protocol
1. new URL('?foo=bar&bingobang=&king=kong@kong.com#foobar/bing/bo@ng?b#ang'); //populates only href, hash, search, params

Both of the above would throw an error in chrome's native URL() parser.

### 2. query parser

Technically, there shouldn't be a parsed version of the query in the result (since the Chrome URL parser doesn't do this).  

If you don't like the behaviour you can change it by calling `changeQueryParser` with a function. 
That function will be given the deconstructed url and expects the query params back. 

E.g. If you want duplicate keys to be turned into an array, you could do this:

    liteURL.changeQueryParser(function (uri) {
        var params = {};

        //strip the question mark from search
        var query = uri.search ? uri.search.substring(uri.search.indexOf('?') + 1) : '';
        query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
            //query isn't actually modified, .replace() is used as an iterator to populate params
            if ($1) {
                if (params[$1]) {
                    if (params[$1] instanceof Array) {
                        params[$1].push($2);
                    } else {
                        params[$1] = [params[$1], $2];
                    }
                } else {
                    params[$1] = $2;
                }
            }
        });
        return params;
    });

(The default behaviour will only ever return a string for a key,
 and it will be the last string it finds for that key.) 

## usage

    <script src="lite-url.min.js"></script>
    <script>
        var url = 'http://user:pass@example.com:8080/directory/file.ext?query=1#anchor';
        var parsed = new liteURL(url);
        console.log(parsed);
    </script>


## notes

The URL object in Chrome etc doesn't quite fit with other interpretations of the spec (http://en.wikipedia.org/wiki/URI_scheme#Examples).

## alternatives

 - https://github.com/medialize/URI.js
    - good if size isn't an issue
 - http://stevenlevithan.com/demo/parseuri/js/ 
    - good test examples but has a bug or two ('@' symbol in path or query [breaks it](http://stackoverflow.com/questions/24304920/is-the-character-valid-in-a-url-after-the-hostname)) 
 - `var x = document.createElement('a'); x.href = '/relative/url'; console.log(x.hostname)` 
    - requires a document and creating an element (just not tidy)
    - isn't compatible with lt IE10
    - can't get authentication info from URL
 - https://developer.mozilla.org/en-US/docs/Web/API/URL 
    - not cross browser

## developing

### testing

    npm install -g gulp
    npm install && bower install
    gulp

#### crossbrowser testing with saucelabs

using config file:

    cp saucelabs.example.json saucelabs.json

add your saucelabs username/secret key, and run:

    npm test

you can do the same on cmdline with:

    export SAUCE_USERNAME='your username' && export SAUCE_ACCESS_KEY='your key' && npm test

### building

for npm (assuming setup correctly with npm)

    npm publish
    
for bower, just tag correct semver and push to github.
