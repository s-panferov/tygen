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
        },

        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'chore(ver): v%VERSION%',
                commitFiles: [
                    'package.json',
                    'CHANGELOG.md',
                ],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        },

        conventionalChangelog: {
            options: {
                changelogOpts: {
                    // conventional-changelog options go here
                    preset: 'angular'
                }
            },
            release: {
                src: 'CHANGELOG.md'
            }
        },

        shell: {
            addChangelog: {
                command: 'git add CHANGELOG.md'
            },
            buildLib: {
                command: 'npm run build'
            }
        },
    });

    grunt.registerTask('release', 'Release a new version', function(target) {
        if (!target) {
            target = 'patch';
        }
        return grunt.task.run(
            'bump-only:' + target,
            'conventionalChangelog',
            'shell:addChangelog',
            'bump-commit'
        );
    });
};
