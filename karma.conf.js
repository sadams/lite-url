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
    var customLaunchers = {
        sl_chrome_linux: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'linux'
        },

        sl_chrome_iphone: {
            base: 'SauceLabs',
            version: '8.1',
            browserName: 'iphone',
            platform: 'OS X 10.9'
        },

        sl_chrome_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'linux'
        },

        sl_ie_9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9'
        },

        sl_ie_8: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '8'
        },

        sl_ie_7: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows XP',
            version: '7'
        },

        //had to test manually
//        sl_ie_6: {
//            base: 'SauceLabs',
//            browserName: 'internet explorer',
//            platform: 'Windows XP',
//            version: '6'
//        },

        sl_android: {
            base: 'SauceLabs',
            browserName: 'android',
            platform: 'linux',
            version: '4.0'
        }
    };
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        sauceLabs: {
            accessKey: process.env.SAUCE_KEY,
            'idle-timeout': 1000,
            recordScreenshots: false,
            testName: 'lite-url crossbrowers',
            username: process.env.SAUCE_USER
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
        verbose: false,

        // Enable verbose debugging (optional)
        verboseDebugging: false,

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO
    });
    if (process.env.TRAVIS) {
        config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';

        if (process.env.BROWSER_PROVIDER === 'saucelabs' || !process.env.BROWSER_PROVIDER) {
            // Allocating a browser can take pretty long (eg. if we are out of capacity
            // and need to wait for another build to finish) and so the
            // `captureTimeout` typically kills an in-queue-pending request, which
            // makes no sense.
            config.captureTimeout = 0;
        }
    }
};