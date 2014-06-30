lite-url
=================

Small, JS lib that uses regex for parsing a URL into it's component parts.

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

usage
=====

    <script src="tiny-url.min.js"></script>
    <script>
        var url = 'http://user:pass@example.com:8080/directory/file.ext?query=1#anchor';
        var parsed = new tinyURL(url);
        console.log(parsed);
    </script>

alternatives
=====

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