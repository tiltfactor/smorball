/// <reference path="../../typings/smorball/smorball.d.ts" />
var ResourcesManager = (function () {
    function ResourcesManager() {
        this.queue = new createjs.LoadQueue();
    }
    ResourcesManager.prototype.loadInitialResources = function (completeCallback) {
        this.loadManifest("data/initial manifest.json", completeCallback);
    };
    ResourcesManager.prototype.loadMainGameResources = function (completeCallback) {
        this.loadManifest("data/main game resources manifest.json", completeCallback);
    };
    ResourcesManager.prototype.loadCaptchas = function () {
    };
    ResourcesManager.prototype.loadLevelResources = function (levelIndx) {
        var level = smorball.game.levels[levelIndx];
        // We need to dynamically construct the manifest to load here
        var entries = [];
        // Add the required enemy variation
        _.each(smorball.game.enemyTypes, function (enemy) {
            var path = Utils.format(enemy.spritesPathTemplate, Utils.zeroPad(level.team.outfit, 2));
            entries.push({ src: path + ".json", id: enemy.id + "_" + Utils.zeroPad(levelIndx, 2) + "_json" });
            entries.push({ src: path + ".png", id: enemy.id + "_" + Utils.zeroPad(levelIndx, 2) + "_png" });
        });
        this.queue.loadManifest({ manifest: entries }, true);
    };
    ResourcesManager.prototype.loadManifest = function (manifest, completeCallback) {
        this.queue.on("complete", completeCallback, this, true);
        this.queue.loadManifest(manifest, true);
    };
    ResourcesManager.prototype.getResource = function (resourceId) {
        return this.queue.getResult(resourceId);
    };
    ResourcesManager.prototype.load = function (url, id, callback) {
        var _this = this;
        this.queue.loadFile({ src: url, id: id }, true);
        this.queue.on("complete", function () {
            if (callback != null)
                callback(_this.getResource(id));
        }, this, true);
    };
    return ResourcesManager;
})();
