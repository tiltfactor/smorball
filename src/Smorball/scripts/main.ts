/// <reference path="../typings/smorball/smorball.d.ts" />

var smorball: SmorballManager;

$(() => {
	$.getJSON("data/smorball config.json",(config: SmorballConfig) => {
		smorball = new SmorballManager(config);
		smorball.init();
	});
});