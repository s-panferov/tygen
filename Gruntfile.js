module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        symlink: {
            self: {
                src: '.',
                dest: 'node_modules/docscript'
            },
            doc: {
                src: './example/doc',
                dest: 'dist/doc'
            },
            generated: {
                src: './doc/generated',
                dest: 'dist/generated'
            },
        }
    });
};
