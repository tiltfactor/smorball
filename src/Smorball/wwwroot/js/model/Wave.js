/// <reference path="../data/enemydata.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
var Wave = (function () {
    function Wave(config) {
        this.config = config;
        this.currentIndex = 0;
        this.activeIndex = 0;
        this.complete = false;
        this.timer = 0;
        this.pause = false;
        if (this.config.gameState.currentLevel == this.config.gameState.survivalLevel) {
            this.loadEnemiesOnSurvival();
        }
        else {
            this.generateEnemyProperties();
        }
        this.push();
    }
    Wave.prototype.loadEnemiesOnSurvival = function () {
        var _this = this;
        this.counter = 1;
        this.surivalTime = 6000;
        var property = [EnemyData.wideCenters.id, 2, this.surivalTime];
        this.config.data.stageDatas.push(property);
        this.timer = setInterval(function () {
            if (_this.config.data.stageDatas.length < 50) {
                _this.createData();
            }
        }, 1000);
    };
    Wave.prototype.createData = function () {
        ++this.counter;
        var mainType = this.getTypeForSurvival();
        var type = this.getTypeForSurvival(mainType);
        var lane = Math.floor((Math.random() * 3)) + 1;
        var time = this.getTimeForSurvival(mainType, type);
        var property = [type.extras.id, lane, time, "", mainType];
        this.config.data.stageDatas.push(property);
    };
    Wave.prototype.getTimeForSurvival = function (mainType, type) {
        if (mainType == "powerup") {
            return 1000;
        }
        else {
            if (this.counter % 8 == 0) {
                this.surivalTime = (this.surivalTime - Math.ceil(this.surivalTime * .2)) < 500 ? 500 : (this.surivalTime - Math.ceil(this.surivalTime * .2));
            }
            return this.surivalTime + type.extras.life * .4 * 1000;
        }
    };
    Wave.prototype.getTypeForSurvival = function (type) {
        var enemyList = [EnemyData.wideCenters, EnemyData.coach, EnemyData.walkingBacks, EnemyData.tallstops, EnemyData.fast, EnemyData.winger];
        var powerupList = [PowerupsData.cleats, PowerupsData.cleats, PowerupsData.bullhorn];
        if (type == undefined) {
            if (this.counter % 5 == 0) {
                return "powerup";
            }
            else {
                return "enemy";
            }
        }
        else {
            if (type == "enemy") {
                return enemyList[Math.floor(Math.random() * enemyList.length)];
            }
            else {
                return powerupList[Math.floor(Math.random() * powerupList.length)];
            }
        }
    };
    Wave.prototype.generateEnemyProperties = function () {
        if (this.config.data.stageDatas.length == 0) {
            var types = this.config.data.types;
            var size = this.config.data.size;
            for (var i = 0; i < size; i++) {
                var properties = {};
                properties[0] = types[Math.floor(Math.random() * types.length)];
                properties[1] = Math.floor(Math.random() * this.config.lanes) + 1;
                properties[2] = this.config.data.time;
                properties[3] = "";
                this.config.data.stageDatas.push(properties);
            }
        }
    };
    Wave.prototype.setNext = function (time) {
        var _this = this;
        this.time = time;
        this.startTimer = true;
        this.timer = setTimeout(function () {
            if (!_this.pause) {
                _this.push();
                _this.startTimer = false;
            }
        }, time);
    };
    Wave.prototype.paused = function (pause) {
        if (this.startTimer && !pause) {
            //this.push();
            this.setNext(this.time / 2);
            this.pause = false;
        }
        else {
            this.pause = true;
            clearTimeout(this.timer);
        }
    };
    Wave.prototype.forcePush = function () {
        clearTimeout(this.timer);
        this.push();
    };
    Wave.prototype.push = function () {
        if (!this.complete) {
            var properties = this.config.data.stageDatas.shift();
            if (properties[4] == undefined || properties[4] == "enemy") {
                this.pushEnemy(properties, this.config.lanesObj);
                this.activeIndex++;
            }
            else {
                this.pushPowerUp(properties);
            }
            this.currentIndex++;
            if (this.currentIndex >= this.config.data.size && this.config.gameState.currentLevel != this.config.gameState.survivalLevel) {
                this.complete = true;
            }
        }
    };
    Wave.prototype.pushPowerUp = function (properties) {
        var type = properties[0];
        var lane = properties[1];
        var time = properties[2];
        var msg = properties[3];
        lane = this.config.lanes == 1 ? 2 : lane;
        var onKill = (time == undefined || time == -1) ? true : false;
        var config = { "id": type, "laneId": lane, "waveId": this.config.id, "onKill": onKill, "loader": this.config.loader };
        var powerup = new sprites.Powerup(config);
        EventBus.dispatch("pushPowerup", powerup);
        if (!(msg == "" || msg == undefined)) {
            EventBus.dispatch("showCommentary", msg);
        }
        if (!onKill) {
            this.setNext(time);
        }
    };
    Wave.prototype.pushEnemy = function (enemyProperties, lanesObj) {
        var type = enemyProperties[0];
        var lane = enemyProperties[1];
        var time = enemyProperties[2];
        if (time != -1) {
            time = time * this.config.gameState.gs.difficulty;
        }
        var msg = enemyProperties[3];
        lane = this.config.lanes == 1 ? 2 : lane;
        var onKill = (time == undefined || time == -1) ? true : false;
        var config = { "id": type, "lanesObj": lanesObj, "laneId": lane, "waveId": this.config.id, "onKill": onKill, "loader": this.config.loader, "gameState": this.config.gameState };
        var enemy = new Enemy(config);
        if (!(msg == "" || msg == undefined)) {
            EventBus.dispatch("showCommentary", msg);
        }
        // Add an enemy to the stage
        smorball.stageController.addEnemy(enemy);
        if (!onKill) {
            this.setNext(time);
        }
    };
    Wave.prototype.killEnemy = function () {
        this.activeIndex--;
    };
    Wave.prototype.isComplete = function () {
        if (this.complete && this.activeIndex == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    Wave.prototype.getId = function () {
        return this.config.id;
    };
    Wave.prototype.clearAll = function () {
        clearTimeout(this.timer);
        clearInterval(this.timer);
        this.timer = 0;
    };
    return Wave;
})();
