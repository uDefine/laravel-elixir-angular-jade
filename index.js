var gulp = require('gulp');
var elixir = require('laravel-elixir');
var plugins = require('gulp-load-plugins')();
var notify = require('gulp-notify');

/*
 |----------------------------------------------------------------
 | CoffeeScript Compilation
 |----------------------------------------------------------------
 |
 | This task will compile your CoffeeScript, minify it, and then
 | optionally generate a "manifest" file that helps with your
 | browser cache-busting of previous versions of your code.
 |
 */

elixir.extend('angularJade', function(src, output, options) {

    var config = this;

    var baseDir = src || config.assetsDir + 'jade/';

    gulp.task('angularJade', function() {

        var onError = function(err) {
            notify.onError({
                title:    "Laravel Elixir",
                subtitle: "Angular Compilation Failed!",
                message:  "Error: <%= error.message %>",
                icon: __dirname + '/../laravel-elixir/icons/fail.png'
            })(err);

            this.emit('end');
        };

        return gulp.src(baseDir + '/**/*.jade')
            .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.init()))
            .pipe(plugins.jade({locals: {}}).on('error', onError))
            .pipe(plugins.angularTemplatecache({
                module: "app.templates",
                root: "/templates",
                standalone: true
            }))
            .pipe(plugins.if(config.production, plugins.uglify()))
            .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.write('.')))
            .pipe(gulp.dest(output || config.jsOutput))
            .pipe(notify({
                title: 'Laravel Elixir',
                subtitle: 'Angular Jade Compiled!',
                icon: __dirname + '/../laravel-elixir/icons/laravel.png',
                message: ' '
            }));
    });

    this.registerWatcher('angularJade', baseDir + '/**/*.jade');

    return this.queueTask('angularJade');

});