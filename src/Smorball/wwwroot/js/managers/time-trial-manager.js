var TimeTrailManager = (function () {
    function TimeTrailManager() {
    }
    TimeTrailManager.prototype.init = function () {
        this.survivalData = smorball.resources.getResource("survival_data");
    };
    TimeTrailManager.prototype.newLevel = function () {
        this.powerupCurrency = 0;
        this.enemyCurrency = 0;
        this.nextPowerup = this.calculateNextPowerup();
        this.nextEnemy = this.calculateNextEnemy();
    };
    TimeTrailManager.prototype.update = function (delta) {
        // If the game isnt playing then we shouldnt do anything
        if (smorball.game.state != 2 /* Playing */)
            return;
        // If this level isnt a time trail then dont do anything
        if (!smorball.game.level.timeTrial)
            return;
        // Increment the currency, this is used to spawn powerups depending on their cost
        if (this.nextPowerup != null)
            this.powerupCurrency += delta + (smorball.game.timeOnLevel / 60) * delta;
        // If we should spawn then do so then calculate what the next one to spawn is
        if (this.shouldSpawnPowerup()) {
            this.spawnPowerup();
            this.nextPowerup = this.calculateNextPowerup();
        }
        // Increment the currency, this is used to spawn enemies depending on their cost
        this.enemyCurrency += delta + (smorball.game.timeOnLevel / 60) * delta;
        // If we should spawn the enemy then do so now and work out the next enemy to spawn
        if (this.shouldSpawnEnemy()) {
            this.spawnEnemy();
            this.nextEnemy = this.calculateNextEnemy();
        }
    };
    TimeTrailManager.prototype.shouldSpawnPowerup = function () {
        // If the next powerup is null then we cant spawn but we should check to see what the next one should be
        if (this.nextPowerup == null) {
            this.nextPowerup = this.calculateNextPowerup();
            return false;
        }
        // If we have enough currency to spawn the powerup then do so
        if (this.powerupCurrency >= this.survivalData.powerups[this.nextPowerup].spawnCost)
            return true;
    };
    TimeTrailManager.prototype.shouldSpawnEnemy = function () {
        // If we have enough currency to spawn the enemy then do so now		 
        if (this.enemyCurrency >= this.survivalData.enemies[this.nextEnemy].spawnCost)
            return true;
        // OR if there are no enemies on the screen then we should spawn (will cause currency to go negative)
        if (smorball.game.enemies.length == 0)
            return true;
        // Else dont spawn the enemy
        return false;
    };
    TimeTrailManager.prototype.calculateNextPowerup = function () {
        var _this = this;
        // Get all the powerup names
        var powerups = _.keys(this.survivalData.powerups);
        // Filter by ones that can already be spawned (based on time on level)
        var potentials = _.filter(powerups, function (s) { return smorball.game.timeOnLevel >= _this.survivalData.powerups[s].startTime; });
        // Randomly pick one (no weighting)
        return Utils.randomOne(potentials);
    };
    TimeTrailManager.prototype.calculateNextEnemy = function () {
        var _this = this;
        // Get all the enemy names
        var enemies = _.keys(this.survivalData.enemies);
        // Work out which ones can be spawned at this point in the level (based on time)
        var potentials = _.filter(enemies, function (s) { return smorball.game.timeOnLevel >= _this.survivalData.enemies[s].startTime; });
        // Work out their weights (for below)
        var weights = _.map(potentials, function (s) { return 1 / _this.survivalData.enemies[s].spawnCost; });
        // Randomly pick one (with weightings based on the inverse of their cost, more expensive spawn less often)		
        return Utils.weightedRandomOne(potentials, weights);
    };
    TimeTrailManager.prototype.spawnEnemy = function () {
        this.enemyCurrency -= this.survivalData.enemies[this.nextEnemy].spawnCost;
        smorball.spawning.spawnEnemy(this.nextEnemy, false, Utils.randomOne(smorball.game.level.lanes));
        console.log("Enemy spawned, currency: ", this.enemyCurrency);
    };
    TimeTrailManager.prototype.spawnPowerup = function () {
        this.powerupCurrency -= this.survivalData.powerups[this.nextPowerup].spawnCost;
        smorball.spawning.spawnPowerup(this.nextPowerup, 1, Utils.randomOne(smorball.game.level.lanes));
        console.log("Powerup spawned, currency: ", this.powerupCurrency);
    };
    return TimeTrailManager;
})();
