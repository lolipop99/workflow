var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var rimraf = require('rimraf');
var Promise = require('bluebird');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var SOURCE_DIR='src';
var BUILD_DIR='static';

var clearBuildDir=function(){
    return new Promise(function(resolve,reject){
        rimraf(BUILD_DIR,function(err){
            if(err) reject(err);
            resolve();
        })
    })
};

gulp.task('default', function() {
    clearBuildDir().then(function(){
        var assetsPrefix='/assets';
        var cssPrefix='/css';
        var htmlPrefix='/html';
        var jsPrefix='/js';
        var libPrefix='/lib';
        var modulePrefix='/module';
        gulp.src(SOURCE_DIR+assetsPrefix+'/**').pipe(gulp.dest(BUILD_DIR+assetsPrefix));
        gulp.src(SOURCE_DIR+cssPrefix+'/**/*.css')
            .pipe(plugins.minifyCss())
            .pipe(gulp.dest(BUILD_DIR+cssPrefix));
        gulp.src([SOURCE_DIR+cssPrefix+'/**','!'+SOURCE_DIR+cssPrefix+'/**/*.css'])
            .pipe(gulp.dest(BUILD_DIR+cssPrefix));
        gulp.src(SOURCE_DIR+htmlPrefix+'/**').pipe(gulp.dest(BUILD_DIR+htmlPrefix));
        gulp.src(SOURCE_DIR+jsPrefix+'/**/*.js')
            .pipe(plugins.uglify())
            .pipe(gulp.dest(BUILD_DIR+jsPrefix));
        gulp.src(SOURCE_DIR+libPrefix+'/**').pipe(gulp.dest(BUILD_DIR+libPrefix));
        gulp.src(SOURCE_DIR+modulePrefix+'/**/*.js')
            .pipe(plugins.uglify())
            .pipe(gulp.dest(BUILD_DIR+modulePrefix));
        gulp.src(SOURCE_DIR+modulePrefix+'/**/*.css')
            .pipe(plugins.minifyCss())
            .pipe(gulp.dest(BUILD_DIR+modulePrefix));
        gulp.src(SOURCE_DIR+modulePrefix+'/**/*.html').pipe(gulp.dest(BUILD_DIR+modulePrefix));
    }).catch(function(err){
        console.error('编译失败')
        console.error(err)
    })
});

gulp.task('test', function(){
    clearBuildDir().then(function(){
        var assetsPrefix='/assets';
        var cssPrefix='/css';
        var htmlPrefix='/html';
        var jsPrefix='/js';
        var libPrefix='/lib';
        var modulePrefix='/module';
        gulp.src(SOURCE_DIR+assetsPrefix+'/**').pipe(gulp.dest(BUILD_DIR+assetsPrefix));
        gulp.src(SOURCE_DIR+cssPrefix+'/**/*.css')
            .pipe(gulp.dest(BUILD_DIR+cssPrefix));
        gulp.src([SOURCE_DIR+cssPrefix+'/**','!'+SOURCE_DIR+cssPrefix+'/**/*.css'])
            .pipe(gulp.dest(BUILD_DIR+cssPrefix));
        gulp.src(SOURCE_DIR+htmlPrefix+'/**').pipe(gulp.dest(BUILD_DIR+htmlPrefix));
        gulp.src(SOURCE_DIR+jsPrefix+'/**/*.js')
            .pipe(gulp.dest(BUILD_DIR+jsPrefix));
        gulp.src(SOURCE_DIR+libPrefix+'/**').pipe(gulp.dest(BUILD_DIR+libPrefix));
        gulp.src(SOURCE_DIR+modulePrefix+'/**/*.js')
            .pipe(rev())
            .pipe(gulp.dest(BUILD_DIR+modulePrefix))
            .pipe(rev.manifest())
            .pipe(gulp.dest('static/rev/js'));
        //gulp.src(['static/rev/js/*.json', SOURCE_DIR+modulePrefix+'/**/*.js'])
        //    .pipe(rev())
        //    .pipe(revCollector())
        //    .pipe(gulp.dest(BUILD_DIR+modulePrefix));
        gulp.src(SOURCE_DIR+modulePrefix+'/**/*.css')
            .pipe(gulp.dest(BUILD_DIR+modulePrefix));
        gulp.src(SOURCE_DIR+modulePrefix+'/**/*.html').pipe(gulp.dest(BUILD_DIR+modulePrefix));
    }).catch(function(err){
        console.error('编译失败')
        console.error(err)
    })
})

gulp.task('rev', function(){
    return gulp.src(['static/rev/**/*.json', BUILD_DIR+'/module'+'/**/*.js'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(BUILD_DIR+'/module'));
});

gulp.task('html', function(){
    return gulp.src(['static/rev/**/*.json', BUILD_DIR+'/module'+'/**/*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(BUILD_DIR+'/module'));
});

gulp.task('clean', function(){
    return gulp.src('static', {read: false})
        .pipe(clean());
});
