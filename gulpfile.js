var gulp = require('gulp')
var pug = require('gulp-pug')
var less = require('gulp-less')
var csso = require('gulp-csso')
var plumber = require('gulp-plumber')
var argv = require('yargs').argv
var concat = require('gulp-concat')
var postcss = require('gulp-postcss')
var sourcemaps = require('gulp-sourcemaps')
var gls = require('gulp-live-server')
var babel = require('gulp-babel')
var autoprefixer = require('gulp-autoprefixer')
var manifest = require('gulp-manifest')
var responsive = require('gulp-responsive')
var gutil = require('gulp-util')
var tap = require('gulp-tap')
var server

var defaultOptions = {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 70,
      // Highest compression level for PNG
      compressionLevel: 9,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,

      errorOnUnusedConfig: false,
      errorOnUnusedImage: false,
      errorOnEnlargement: false,
      passThroughUnused: true
  }

  gulp.task('pug', function() {

  	var stream = gulp.src('./pug/**/*.pug')
  	.pipe(plumber({
  		errorHandler: function (err) {
  			console.warn(err)
  			this.emit('end')
  		}
  	}))
  	.pipe(pug({}))
  	.pipe(gulp.dest('./build'))

  	if (server) stream = stream.pipe(server.notify())

  		return stream

  })

  gulp.task('js', function() {

  	var stream = gulp.src('./js/**/*.js')
  	.pipe(plumber({
  		errorHandler: function (err) {
  			console.warn(err)
  			this.emit('end')
  		}
  	}))
  	.pipe(sourcemaps.init())
  	.pipe(concat('app.js'))
  	.pipe(babel({
  		presets: [
        'es2015',
      'react']
  	}))
  	.pipe(sourcemaps.write())
  	.pipe(gulp.dest('./build/static/js'))

  	if (argv.publish) {

  		stream = stream.pipe(rename({suffix: '.min'}))
  		.pipe(gulp.dest('./static/js'))
  		.pipe(gulp.dest('./build/static/js'))

  	}

  	if (server) stream = stream.pipe(server.notify())

  		return stream

  })

  gulp.task('vendor', function() {

  	var files = [
  	'./node_modules/jquery/dist/jquery.min.js',
  	'./node_modules/jquery-inview/jquery.inview.min.js',
  	'./node_modules/velocity-animate/velocity.min.js',
    './bower_components/clusterize/clusterize.js',
    './node_modules/react/dist/react.js',
    './node_modules/react-dom/dist/react-dom.js'
  	]

  	var stream = gulp.src(files)
    .pipe(sourcemaps.init())
  	.pipe(concat('vendor.js'))
  	.pipe(gulp.dest('./build/static/js'))

  	if (argv.publish) {

  		stream = stream.pipe(rename({suffix: '.min'}))
  		.pipe(gulp.dest('./static/js'))
  		.pipe(gulp.dest('./build/static/js'))

  	}

  	return stream

  })

  gulp.task('less', function() {

  	var stream = gulp.src('./less/app.less')
  	.pipe(sourcemaps.init())
  	.pipe(plumber({
  		errorHandler: function (err) {

  			console.warn(err)
  			this.emit('end')

  		}
  	}))

  	.pipe(less())
  	.pipe(autoprefixer('last 10 versions', 'ie 9'))
  	.pipe(sourcemaps.write())
  	.pipe(gulp.dest('./build/static/css'))

  	if (argv.publish) {

  		stream = stream.pipe(csso(true))
  		.pipe(rename({suffix: '.min'}))
  		.pipe(gulp.dest('./build/static/css'))
  	}

  	if (server) stream = stream.pipe(server.notify())

  		return stream

  })

  gulp.task('manifest', function() {

  	var stream = gulp.src(['build/**/*'], {base: './build' })
  	.pipe(manifest({
  		hash: true,
  		preferOnline: true,
  		filename: 'app.manifest',
  		exclude: 'app.manifest'
  	}))
  	.pipe(gulp.dest('build'))

  	return stream
  })

  gulp.task('default', ['js', 'vendor', 'less', 'pug', 'manifest'])

  gulp.task('dev', function() {

  	server = gls.static('build', 80)
  	server.start()

  	gulp.watch('pug/**/*', ['pug', 'manifest'])
  	gulp.watch('less/**/*', ['less', 'manifest'])
  	gulp.watch('js/**/*', ['js', 'manifest'])
	// gulp.start(['dev-img', 'watch-svg'])

})

  gulp.task('dev-img', function() {

  	gulp.watch(['src_img/**/*.png']).on('add', function(file) {
  		parseFileNameAndConvert(file)
  	})

  	gulp.watch(['src_img/**/*.png']).on('change', function(file) {
  		parseFileNameAndConvert(file)
  	})

  	gulp.start(['watch-svg'])

  })

  gulp.task('watch-svg', function() {

	// Initial copy-paste of all .svg files
	gulp.src("src_img/**/*.svg")
	.pipe(tap(function(file, t) {
		parseFileNameAndCopy(file)
	}))
    // .pipe(gulp.dest('build'));


    gulp.watch(['src_img/**/*.svg']).on('change', function(file) {
    	parseFileNameAndCopy(file)
    })
})

  function parseFileNameAndCopy(file) {
	// Check if the file is in an active directory
	if (file.path.indexOf('active') > -1 || file.path.indexOf('icons') > -1) {
		var pathArray = file.path.split('\\')
		var filePathLen = pathArray.length
		var dest = 'build/img/' + pathArray[filePathLen - 1 - 2]

		if (file.path.indexOf('icons') > -1)
		{
			dest = 'build/img/icons'
		}

		gutil.log("into", dest)

		var fileName = pathArray[filePathLen - 1].split('_')[0]

		gutil.log('copying', fileName)

		return gulp.src(file.path)
		.pipe(gulp.dest(dest));
	}
}

function parseFileNameAndConvert(file) {
	gutil.log(file.path)
		// Check if the file is in an active directory
		if (file.path.indexOf('active') > -1) {

			gutil.log(file.path)

			var pathArray = file.path.split('\\')
			var filePathLen = pathArray.length
			var fileNameArray = pathArray[filePathLen - 1].split('.')
			var fileNameLen = fileNameArray.length

			var fileNameFull = pathArray[filePathLen - 1].split('.')[0]
			var fileName = pathArray[filePathLen - 1].split('_')[0]
			var fileType = '.' + fileNameArray[fileNameLen - 1]

			var desiredFileType = null
			var quality = null

			var options = JSON.parse(JSON.stringify(defaultOptions))

			// The destination folder is in format build/img/project/image.ext
			var dest = 'build/img/' + pathArray[filePathLen - 1 - 2]

			// Regex to identify qXX format to determine image quality
			var qRegEx = /(q\d\d)/i

			if (file.path.match(qRegEx)) {

				quality = file.path.match(qRegEx)[0].substring(1, 3)
				options.quality = parseInt(quality)

			}

			if (fileNameFull.indexOf('jpg') > -1) {
				gutil.log(fileNameFull, 'should export to jpg at quality', quality)
				desiredFileType = '.jpg'
				options.flatten = true
				options.background = '#ffffff'
			}

			if (fileNameFull.indexOf('png') > -1) {
				gutil.log(fileNameFull, 'should export to png')
				desiredFileType = '.png'
			}

			if (!desiredFileType) {

				// Default to jpg
				desiredFileType = '.jpg'

			}

			gutil.log('filename:', fileName, 'filetype:', fileType, 'desired filetype:', desiredFileType)
			gutil.log(options)
			responsiveResize(file.path, dest, fileName, desiredFileType, options)
		}
	}

	function responsiveResize(path, dest, fileName, fileType, options) {
		return gulp.src(path)
		.pipe(responsive({

			'*.png': [{
				width: 500,
				rename: {
					basename: fileName,
					suffix: '-500px',
					extname: fileType
				},
			}, {
				width: 1000,
				rename: {
					basename: fileName,
					suffix: '-1000px',
					extname: fileType
				},
			}, {
				width: 2000,
				rename: {
					basename: fileName,
					suffix: '-2000px',
					extname: fileType
				},
			}, {
				width: 4000,
				rename: {
					basename: fileName,
					suffix: '-4000px',
					extname: fileType
				},
			}],

		}, options))
		.pipe(gulp.dest(dest));
	}
