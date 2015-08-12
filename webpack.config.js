var confBuilder = require('./webpack-conf-builder');

module.exports = confBuilder({
    isTest: false,
    isProduction: process.env.NODE_ENV == 'production',
    isStandalone: process.env.NODE_TARGET == 'standalone',
    doTypeCheck: true
});
