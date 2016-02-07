module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        symlink: {
            self: {
                src: '.',
                dest: 'node_modules/docscript'
            },
        }
    });
};
