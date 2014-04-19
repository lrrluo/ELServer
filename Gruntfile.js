/**
 *
 * Created by L on 14-4-19.
 */
module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
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
			files: [ 'public/scripts/**/*.js', 'public/javascripts/*.js'],
			options: {
				//这里是覆盖JSHint默认配置的选项
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
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
	grunt.registerTask('css', ['less']);
	grunt.registerTask('js', ['jshint']);
	grunt.registerTask('default', ['watch']);
};
