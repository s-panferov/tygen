var SELECTOR_MATCHER = /[a-z][_][a-z]|:/;
var path = require('path');

module.exports.postcss = function(webpack) {
    return [
        require('postcss-import')({
            path: [__dirname],
            addDependencyTo: webpack
        }),
        require('postcss-fontpath'),
        require('postcss-url')({
            url: "rebase" // or "inline" or "copy"
        }),
        require('precss'),
        require('postcss-cssnext')({
            features: {
                autoprefixer: false,
                initial: false
            }
        }),
        require('postcss-font-magician')({
           foundries: 'google'
        }),
        // require('postcss-initial')({
        //     reset: 'inherited' // reset only inherited rules
        // }),
        require('colorguard')
    ];
};
