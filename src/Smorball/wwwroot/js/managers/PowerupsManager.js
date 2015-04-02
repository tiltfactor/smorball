var PowerupsManager = (function () {
    function PowerupsManager() {
        this.quantities = { cleats: 0, bullhorn: 0, helmet: 0 };
    }
    PowerupsManager.prototype.init = function () {
        this.types = smorball.resources.getResource("powerups_data");
    };
    PowerupsManager.prototype.newLevel = function () {
        this.powerups = [];
    };
    PowerupsManager.prototype.spawnPowerup = function (type, lane) {
        var powerup = new Powerup(type, lane);
        var min = smorball.config.goalLine + 300;
        var max = smorball.config.width - 300;
        var x = min + Math.random() * (max - min);
        var y = smorball.config.friendlySpawnPositions[lane].y;
        powerup.x = x;
        powerup.y = y;
        this.powerups.push(powerup);
        smorball.screens.game.actors.addChild(powerup);
    };
    PowerupsManager.prototype.update = function (delta) {
        if (smorball.game.state != 2 /* Playing */)
            return;
        _.each(this.powerups, function (p) { return p.update(delta); });
    };
    return PowerupsManager;
})();
