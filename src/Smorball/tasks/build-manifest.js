var fs = require('fs');

module.exports = function (grunt) {
	grunt.registerTask('build-manifest', function () {

		var file = fs.readFileSync("wwwroot/data/main game resources manifest.json", 'utf8');

		console.log("building manifestt..", file);
	});
};