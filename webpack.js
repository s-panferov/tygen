var SELECTOR_MATCHER = /[a-z][_][a-z]|:/;
var path = require('path');

module.exports.postcss = function(webpack) {
    return [
        require('postcss-import')({
            path: [path.join(__dirname, 'src', 'explorer')],
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
        // require('postcss-initial')({
        //     reset: 'inherited' // reset only inherited rules
        // }),
        require('postcss-font-magician'),
        require('colorguard')
    ];
};
