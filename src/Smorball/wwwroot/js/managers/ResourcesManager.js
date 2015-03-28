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
    ResourcesManager.prototype.loadManifest = function (manifest, completeCallback) {
        this.queue.on("complete", completeCallback, this, true);
        this.queue.loadManifest(manifest, true);
    };
    ResourcesManager.prototype.getResource = function (resourceId) {
        return this.queue.getResult(resourceId);
    };
    return ResourcesManager;
})();
