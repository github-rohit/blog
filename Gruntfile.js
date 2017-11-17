module.exports = function(grunt) {

  // Time how long tasks take
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
        src: 'public',
        dest: 'public'
    },
    // Syntax check
    jshint: {
        lib: {
            src: ['<%= dirs.src %>/app/**/*.js']
        },
        options: {
            curly:    true,
            eqeqeq:   true,
            eqnull:   true,
            browser:  true,
            jquery:   true,
            yui:      true
        }
    },
    // minimize js files
    uglify: {
        options: {
            mangle: false,
            sourceMap: true
          },
        build: {
            files: {
                '<%= dirs.dest %>/js/core.min.js': [

                    '<%= dirs.src %>/js/angular.js',
                    '<%= dirs.src %>/js/tinymce.js',
                    '<%= dirs.src %>/js/angular-moment.min.js',
                    '<%= dirs.src %>/js/angular-cookies.js',
                    '<%= dirs.src %>/js/angular-route.js',
                    '<%= dirs.src %>/js/angular-sanitize.js',
                    '<%= dirs.src %>/js/angular-resource.js',
                    
                    '<%= dirs.src %>/js/all.fine.uploader.js',
                    '<%= dirs.src %>/js/dateTimePicker.min.js',
                    
                    '<%= dirs.src %>/app/app.js',
                    '<%= dirs.src %>/app/routes/user.routes.js',
                    '<%= dirs.src %>/app/routes/routes.js',
                    '<%= dirs.src %>/app/run/run.js',
                    
                    '<%= dirs.src %>/app/filters/filter.js',
                    
                    '<%= dirs.src %>/app/services/formerror.service.js',
                    '<%= dirs.src %>/app/services/authentication.service.js',
                    '<%= dirs.src %>/app/services/register.service.js',
                    '<%= dirs.src %>/app/services/post.service.js',
                    '<%= dirs.src %>/app/services/user.update.service.js',
                    '<%= dirs.src %>/app/services/pagination.service.js',

                    '<%= dirs.src %>/app/directives/directive.js',
                    '<%= dirs.src %>/app/directives/search/search.directive.js',
                    '<%= dirs.src %>/app/directives/loader/loader.directive.js',
                    '<%= dirs.src %>/app/directives/nav/nav.directive.js',
                    '<%= dirs.src %>/app/directives/list/list.directive.js',
                    '<%= dirs.src %>/app/directives/pagination/pagination.directive.js',
                    
                    '<%= dirs.src %>/app/nav/nav.controller.js',
                    '<%= dirs.src %>/app/index/home.controller.js',
                    '<%= dirs.src %>/app/register/register.controller.js',
                    '<%= dirs.src %>/app/register/emailVerification.controller.js',
                    '<%= dirs.src %>/app/register/forgotpassword.controller.js',
                    '<%= dirs.src %>/app/register/resetpassword.controller.js',
                    '<%= dirs.src %>/app/login/login.controller.js',
                    '<%= dirs.src %>/app/logout/logout.controller.js',
                    '<%= dirs.src %>/app/profile/view/view.controller.js',
                    '<%= dirs.src %>/app/profile/update/update.controller.js',

                    '<%= dirs.src %>/app/dashboard/dashboard.controller.js',
                    '<%= dirs.src %>/app/post/create/create.controller.js',
                    '<%= dirs.src %>/app/post/read/read.controller.js',

                    '<%= dirs.src %>/app/search/search.controller.js'       
                ]
            }
        }
    }
});

// Load the plugins that provide the tasks.
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-import');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-handlebars');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-clean');

  // Tasks
  grunt.registerTask('default', ['uglify:build']);

};
