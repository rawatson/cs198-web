module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                options: {
                    middleware: function(connect, options, middlewares) {
                        var modRewrite = require('connect-modrewrite');
                        var rules = [
                            '!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif$ /index.html'
                        ];
                        middlewares.unshift(modRewrite(rules));
                        return middlewares;
                    },
                    base: 'public',
                    livereload: true,
                    port: 8000
                }
            }
        },

        watch: {
            react: {
                files: 'src/*.jsx',
                tasks: ['browserify']
            }
        },

        browserify: {
            options: {
                transform: [require('grunt-react').browserify]
            },
            client: {
                src: ['src/**/*.jsx'],
                dest: 'public/js/app.built.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', [
        'browserify'
    ]);

    grunt.registerTask('serve', [
        'browserify',
        'connect:server',
        'watch'
    ]);
};
