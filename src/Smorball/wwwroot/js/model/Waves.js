/// <reference path="wave.ts" />
var Waves = (function () {
    function Waves(config) {
        this.config = config;
        this.activeWaves = [];
        this.extraPowerups = [];
        this.currentIndex = 0;
        this.pushPositions = 0;
        this.complete = false;
        this.loadEvents();
    }
    Waves.prototype.init = function () {
        this.totalOpponents = this.config.waves.enemySize;
        this.start();
    };
    Waves.prototype.loadEvents = function () {
        var _this = this;
        EventBus.addEventListener("forcePush", function (object) { return _this.forcePush(object.target); });
        EventBus.addEventListener("pushExtraPowerup", function (type) { return _this.createExtraPowerup(type.target); });
        EventBus.addEventListener("pauseWaves", function (ob) { return _this.pauseWaves(ob.target); });
        EventBus.addEventListener("clearAllWaves", function () { return _this.clearAll(); });
    };
    Waves.prototype.getPendingEnemies = function () {
        if (this.config.gameState.currentLevel == this.config.gameState.survivalLevel) {
            return 0;
        }
        return --this.totalOpponents;
    };
    Waves.prototype.start = function () {
        var data = JSON.parse(JSON.stringify(this.config.waves.data[this.currentIndex]));
        var config = { "id": this.currentIndex, "lanesObj": this.config.lanesObj, data: data, "lanes": this.config.lanes, "loader": this.config.loader, "gameState": this.config.gameState };
        var wave = new Wave(config);
        this.currentIndex++;
        this.activeWaves.push(wave);
    };
    Waves.prototype.activateMultipleWaves = function () {
        var _this = this;
        for (var i = 1; i < this.config.waves.activeWaves; i++) {
            setTimeout(function () {
                _this.start();
            }, this.config.waves.time);
        }
    };
    Waves.prototype.getStatus = function () {
        return this.complete;
    };
    Waves.prototype.getWaveFromId = function (waveId) {
        for (var i = 0; i < this.activeWaves.length; i++) {
            var wave = this.activeWaves[i];
            if (wave.getId() == waveId) {
                return wave;
            }
        }
        return null;
    };
    Waves.prototype.update = function (waveId, onKillPush, type) {
        var wave = this.getWaveFromId(waveId);
        if (type == "enemy") {
            wave.killEnemy();
        }
        if (wave)
            var status = wave.isComplete();
        if (status) {
            var index = this.activeWaves.indexOf(wave);
            this.activeWaves.splice(index, 1);
        }
        else {
            if (onKillPush)
                wave.push();
        }
        if (status) {
            if (this.currentIndex < this.config.waves.data.length) {
                this.start();
            }
            else {
                this.complete = true;
            }
        }
    };
    Waves.prototype.clearAll = function () {
        for (var i = 0; i < this.activeWaves.length; i++) {
            var wave = this.activeWaves.pop();
            wave.clearAll();
        }
        this.currentIndex = 0;
    };
    Waves.prototype.pauseWaves = function (flag) {
        for (var i = 0; i < this.activeWaves.length; i++) {
            var wave = this.activeWaves[i];
            wave.paused(flag);
        }
    };
    Waves.prototype.forcePush = function (waveId) {
        var wave = this.getWaveFromId(waveId);
        if (wave != null && !wave.isComplete()) {
            wave.forcePush();
        }
    };
    Waves.prototype.createExtraPowerup = function (type) {
        var properties = {};
        properties[0] = type;
        properties[1] = Math.floor(Math.random() * this.config.lanes) + 1;
        properties[2] = 0;
        properties[3] = "";
        if (this.activeWaves[0]) {
            this.activeWaves[0].pushPowerUp(properties);
        }
    };
    return Waves;
})();
