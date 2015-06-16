var fs = require('fs');

// Use ENV vars on Travis and sauce.json locally to get credentials
if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('saucelabs.json')) {
        console.log('Missing local sauce.json with SauceLabs credentials.');
        process.exit(1);
    } else {
        process.env.SAUCE_USERNAME = require('./saucelabs').username;
        process.env.SAUCE_ACCESS_KEY = require('./saucelabs').accessKey;
    }
}

module.exports = function(config) {
    var customLaunchers = require('./test-browsers.json');
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        sauceLabs: {
            accessKey: process.env.SAUCE_ACCESS_KEY,
            'idle-timeout': 1000,
            recordScreenshots: false,
            testName: 'lite-url crossbrowers',
            username: process.env.SAUCE_USERNAME
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        browserDisconnectTimeout: 60 * 1000,
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 60 * 1000,
        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60 * 1000,
        reporters: ['dots', 'saucelabs'],
        singleRun: true,

        // frameworks to use
        frameworks: ['qunit'],

        // list of files / patterns to load in the browser
        //passed in from gulp
        files:[
            './dist/lite-url.min.js',
            './test/browser/*.test.js'
        ],

        // Log output from the `sc` process to stdout?
        verbose: true,

        // Enable verbose debugging (optional)
        verboseDebugging: true,

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO
    });
};