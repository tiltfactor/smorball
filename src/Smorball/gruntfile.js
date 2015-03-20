/// <binding AfterBuild='default' ProjectOpened='bower, typescript' />
// This file in the main entry point for defining grunt tasks and using grunt plugins.
// Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409

module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        typescript: {

        	options: {
        		module: 'amd', //or commonjs 
        		target: 'es5', //or es3 
        		basePath: 'scripts',
        		sourceMap: false,
        		declaration: false,
        		watch: 'scripts',
        		noEmitOnError: false
        	},
        	build: {
        		src: ['scripts/**/*.ts', 'typings/**/*.ts'],
        		dest: 'wwwroot/js',
        		options: {
					watch: false
        		}
        	},
            watch: {
                src: ['scripts/**/*.ts', 'typings/**/*.ts'],
                dest: 'wwwroot/js'                
            }
        },       
        injector: {
            options: {
                ignorePath: 'wwwroot/',
                addRootSlash: false
            },
            js_libs: {
                files: {
                    'wwwroot/index.html': ['wwwroot/lib/jquery/**/*.js', 'wwwroot/lib/**/*.js'],
                }
            },
            css: {
                files: {
                    'wwwroot/index.html': ['wwwroot/css/**/*.css'],
                }
            }
        }
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("default", ["bower:install", "typescript:build", "injector"]);
    grunt.registerTask("watch", ["typescript:watch"]);

    // The following line loads the grunt plugins.
    // This line needs to be at the end of this this file.
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks('grunt-typescript');
    //grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-asset-injector');

};