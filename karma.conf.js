var saucelabsConf;
try {
    saucelabsConf = {
        username: require('./saucelabs.json').username,
        accessKey: require('./saucelabs.json').accessKey,
        testName: 'lite-url crossbrowers'
    };
} catch (e) {
    //we don't have the saucelabs config so we assume it's handled by environment vars and just allow it to continue.
    //explained in readme.md
}
module.exports = function(config) {
    var customLaunchers = {
        sl_chrome_linux: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'linux'
        },

//        sl_chrome_iphone: {
//            base: 'SauceLabs',
//            version: '8.1',
//            browserName: 'iphone',
//            platform: 'OS X 10.9'
//        },

        sl_chrome_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'linux'
        },

//        sl_ie_9: {
//            base: 'SauceLabs',
//            browserName: 'internet explorer',
//            platform: 'Windows 7',
//            version: '9'
//        },

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
        }

//        ,
        //had to test manually
//        sl_ie_6: {
//            base: 'SauceLabs',
//            browserName: 'internet explorer',
//            platform: 'Windows XP',
//            version: '6'
//        },

//        sl_android: {
//            base: 'SauceLabs',
//            browserName: 'android',
//            platform: 'linux',
//            version: '4.0'
//        }
    };
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        sauceLabs: saucelabsConf,
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['dots', 'saucelabs'],
        singleRun: true,


        // frameworks to use
        frameworks: ['qunit'],

        // list of files / patterns to load in the browser
        //passed in from gulp
//        files:[],

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
        logLevel: config.LOG_INFO,

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000
    });
};