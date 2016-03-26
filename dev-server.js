var webpack = require('webpack');
var path = require('path');
var _ = require('lodash-node');
var WebpackDevServer = require('webpack-dev-server');

var optimist = require('optimist');
require('webpack/bin/config-optimist')(optimist);

var argv = optimist.argv;
var cliOptions = require('webpack/bin/convert-argv')(optimist, _.assign({}, argv, { progress: true }));

var PRODUCTION = process.env.NODE_ENV === 'production';

var devServerConfing = {
    publicPath: '/assets',
    contentBase: './dist',
    historyApiFallback: true,
    stats: { colors: true, modules: true },
    inline: !PRODUCTION,
    hot: !PRODUCTION
};

if (!PRODUCTION) {
    cliOptions.entry.app.unshift('webpack/hot/only-dev-server');
    cliOptions.entry.app.unshift('webpack-dev-server/client?http://localhost:8080');
}

new WebpackDevServer(webpack(cliOptions), devServerConfing).listen(process.env.NODE_PORT || 8080, 'localhost', function (err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Webpack dev server listening at localhost:8080');
    }
});
