/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
var SmbLoadQueue = (function () {
    function SmbLoadQueue(config) {
        this.config = config;
        this.initialize();
    }
    SmbLoadQueue.prototype.initialize = function () {
        var _this = this;
        this.events = {};
        this.fg_loader = new createjs.LoadQueue(true, "", false);
        this.bg_loader = new createjs.LoadQueue(false, "", false);
        this.active = false;
        this.captchaLoad = false;
        this.localCapthcaSize = 8;
        var me = this;
        setTimeout(function () {
            _this.loadLocalImages();
        }, 10000);
    };
    SmbLoadQueue.prototype.updateLoader = function (e) {
        this.loaderClass.updateLoader(e.progress);
        this.config.stage.update();
    };
    SmbLoadQueue.prototype.addEventsonLoad = function (manifest, callback, ob) {
        var _this = this;
        this.events.loaderEvent = function (e) {
            _this.updateLoader(e);
        };
        this.fg_loader.addEventListener("progress", this.events.loaderEvent);
        this.fg_loader.loadManifest(manifest);
        this.events.click = function () {
            _this.loadComplete(callback, ob);
        };
        this.fg_loader.addEventListener("complete", this.events.click);
        this.events.error = function (e) {
            console.log(e);
        };
        this.fg_loader.addEventListener("error", this.events.error);
    };
    SmbLoadQueue.prototype.loadLevelQueue = function (manifest, level) {
        $("#loaderDiv").show();
        this.active = true;
        var config = { "stage": this.config.stage, "gameState": this.config.gameState, "currentLevel": level, "loader": this.fg_loader, "type": 1 };
        this.loaderClass = new LoaderClass(config);
        this.config.stage.addChild(this.loaderClass);
        if (manifest.length != 0) {
            this.addEventsonLoad(manifest);
        }
        else {
            this.loadComplete();
        }
    };
    SmbLoadQueue.prototype.initialLoad = function (manifest, callback, ob) {
        var _this = this;
        var me = this;
        $("#loaderDiv").show();
        var text = new createjs.Text("LOADING...", "Bold 60px Boogaloo", "#ffffff");
        text.setTransform(800, 600);
        this.config.stage.addChild(text);
        this.fg_loader.loadManifest(manifest);
        this.fg_loader.addEventListener("complete", function () {
            //
            _this.config.stage.removeAllChildren();
            _this.fg_loader.removeAllEventListeners();
            callback(ob);
        });
    };
    SmbLoadQueue.prototype.loadQueue = function (manifest, callback, ob, level) {
        $("#loaderDiv").show();
        if (manifest.length != 0) {
            var me = this;
            this.active = true;
            var config = { "stage": this.config.stage, "gameState": this.config.gameState, "currentLevel": level, "loader": this.fg_loader, "type": 0 };
            this.loaderClass = new LoaderClass(config);
            this.config.stage.addChild(this.loaderClass);
            this.addEventsonLoad(manifest, callback, ob);
        }
        else {
            callback(ob);
        }
    };
    SmbLoadQueue.prototype.getbgloader = function () {
        return this.bg_loader;
    };
    SmbLoadQueue.prototype.getfgloader = function () {
        return this.fg_loader;
    };
    SmbLoadQueue.prototype.getResult = function (imgID) {
        var url = this.fg_loader.getResult(imgID);
        if (!url) {
            url = this.bg_loader.getResult(imgID);
        }
        return url;
    };
    SmbLoadQueue.prototype.load = function (manifest, callback, ob) {
        var _this = this;
        if (manifest.length != 0) {
            var me = this;
            this.events.loadComplete = function () {
                _this.active = false;
                _this.bg_loader.removeEventListener("complete", _this.events.loadComplete);
                callback(ob);
            };
            this.bg_loader.addEventListener("complete", this.events.loadComplete);
            this.bg_loader.loadManifest(manifest);
        }
        else {
            callback(ob);
        }
    };
    SmbLoadQueue.prototype.loadComplete = function (callback, ob) {
        this.active = false;
        this.fg_loader.removeEventListener("complete", this.events.click);
        this.fg_loader.removeEventListener("progress", this.events.loaderEvent);
        if (callback) {
            this.config.stage.removeAllChildren();
            this.config.stage.update();
            $("#loaderDiv").hide();
            callback(ob);
        }
        else {
            this.loaderClass.drawPlayButton();
            this.config.stage.update();
        }
    };
    SmbLoadQueue.prototype.loadLocalImages = function () {
        var _this = this;
        var manifest = [];
        if (this.localCapthcaSize + 10 <= localData.differences.length) {
            if (!this.active && !this.captchaLoad) {
                this.captchaLoad = true;
                for (var i = this.localCapthcaSize; i <= this.localCapthcaSize + 10; i++) {
                    var img = {};
                    var name = this.zeroFill(i, 3);
                    img.src = "shapes/captcha/" + name + ".png";
                    img.id = name;
                    manifest.push(img);
                }
                this.localCapthcaSize += 10;
                this.fg_loader.loadManifest(manifest);
                this.fg_loader.addEventListener("complete", function () {
                    _this.captchaLoad = false;
                });
            }
            setTimeout(function () {
                _this.loadLocalImages();
            }, 10000);
        }
    };
    // creates number in format 000
    SmbLoadQueue.prototype.zeroFill = function (number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + "";
    };
    return SmbLoadQueue;
})();
