/// <reference path="../typings/smorball/smorball.d.ts" />
var smorball;
$(function () {
    $.getJSON("data/smorball config.json", function (config) {
        smorball = new SmorballManager(config);
        smorball.init();
    });
});
