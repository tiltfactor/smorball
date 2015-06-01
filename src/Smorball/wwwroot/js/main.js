/// <reference path="../typings/smorball/smorball.d.ts" />
var smorball;
$(function () {
    $.getJSON("data/smorball config.json", function (config) {
        // If debug defined in the config then we are debug, else look at the URL of the page
        config.debug = config.debug ? true : Utils.deparam(location.href).debug == "true";
        smorball = new SmorballManager(config);
        smorball.init();
    });
});
