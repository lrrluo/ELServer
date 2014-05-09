/**
 *
 * Created by L on 14-4-19.
 */
module.exports = function(grunt) {
	var CONFIG_FILES = [
		'Gruntfile.js'
	];
	var CLIENT_FILES = [
		'public/scripts/**/*.js'
	];
	var MIN_FILES =[
		'public/scripts/**/*.js'
	];
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat:{
			options:{
				separator: ';',
				stripBanners: true
			},
			dist: {
				src: MIN_FILES,
				dest: 'public/jsMin/all.js'
			}
		},
		uglify:{
			options:{

			},
			dist:{
				files:{
					'public/jsMin/all.min.js':'public/jsMin/all.js'
				}
			}
		},
		less: {
			development: {
				options: {
					//compress: true,
					//yuicompress: true,
					optimization: 2
				},
				files: {
					// target.css file: source.less file
					"public/resourses/css/main.css": "less/main.less"
				}
			}
		},
		jshint: {
			config: {
				files: {
					src: CONFIG_FILES
				},
				options: {
					node: true
				}
			},
			client: CLIENT_FILES,
			options: {
				asi:true,
				curly:true,
				latedef:true,
				forin:false,
				noarg:false,
				sub:true,
				undef:true,
				unused:'vars',
				boss:true,
				eqnull:true,
				browser:true,
				laxcomma:true,
				devel:true,
				smarttabs:true,
				predef:[
					"require"
					,"define"
					,"console"
					,"extend"
					,"LANG"
					,"ROOT"
					,"PUBJS"
					,"_T"
					,"seajs"
					,"BASE"
				],
				globals: {
					jQuery: true
					,browser:true
				}
			}
		},
		watch: {
			styles: {
				// Which files to watch (all .less files recursively in the less directory)
				files: ['sites/all/themes/jiandan/less/**/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('css', ['less']);
	grunt.registerTask('js', ['jshint']);
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('minjs', ['concat','uglify']);
	grunt.registerTask('alljs', ['concat']);
};
