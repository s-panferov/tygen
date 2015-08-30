module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        mochaTest: {
          test: {
            options: {
              reporter: 'spec',
            },
            src: ['test/doc/test/**/*.js']
          }
        },
        ts: {
            default: {
                options: {
                    compiler: './node_modules/typescript/bin/tsc',
                    module: "commonjs",
                    preserveConstEnums: true
                },
                src: 'src/doc/**/*.ts',
                outDir: 'test'
            }
        },
        watch: {
            scripts: {
                files: 'src/doc/**/*.ts',
                tasks: ['ts', 'mochaTest'],
                options: {
                    interrupt: true,
                }
            }
        }
    });

    grunt.registerTask('dev', ['ts:default', 'mochaTest', 'watch']);
    grunt.registerTask('default', ['ts:default']);
};
