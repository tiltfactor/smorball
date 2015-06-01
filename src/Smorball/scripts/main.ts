/// <reference path="../typings/smorball/smorball.d.ts" />

var smorball: SmorballManager;

$(() => {
    $.getJSON("data/smorball config.json",(config: SmorballConfig) => {

        // If debug defined in the config then we are debug, else look at the URL of the page
        config.debug = config.debug ? true : Utils.deparam(location.href).debug == "true";

		smorball = new SmorballManager(config);
		smorball.init();
	});
});
