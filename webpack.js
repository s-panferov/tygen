var SELECTOR_MATCHER = /[a-z][_][a-z]|:/;
var path = require('path');

module.exports.postcss = function(webpack) {
    return [
        require('postcss-import')({
            path: [__dirname],
            addDependencyTo: webpack
        }),
        require('precss'),
        require('postcss-cssnext')({
            // features: {
            //     autoprefixer: false,
            //     initial: false
            // }
        }),
        // require('postcss-initial')({
        //     reset: 'inherited' // reset only inherited rules
        // }),
        require('colorguard')
    ];
};
