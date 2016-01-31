require('shelljs/global');
var spawn = require('child_process').spawn;

function MochaPlugin(options) {
    // Configure your plugin with options...
}

module.exports = MochaPlugin;

MochaPlugin.prototype.apply = function(compiler) {
    compiler.plugin("done", function(stats) {
        spawn("mocha", ["./dist"], {stdio: "inherit"});
    });
};
