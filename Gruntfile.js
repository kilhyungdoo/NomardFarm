module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['*.html', 'js/**', 'css/**'],
      },
    },
    connect: {
      server: {
        options: {
            hostname: '*',
            open: {
                target: 'http://127.0.0.1:9000'
            },
            port: 9000,
        },
      },
    },
  });

  // plugin
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // task
  grunt.registerTask('default', ['connect', 'watch']);

};
