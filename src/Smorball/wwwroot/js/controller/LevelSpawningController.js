/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
var LevelSpawningController = (function () {
    function LevelSpawningController() {
    }
    LevelSpawningController.prototype.startNewLevel = function (level) {
        this.level = level;
        this.enemySpawnsThisLevel = this.countEnemySpawns(level);
        this.wave = this.level.waves[0];
        this.action = this.wave.actions[0];
        this.logWave();
        this.logAction();
    };
    LevelSpawningController.prototype.countEnemySpawns = function (level) {
        var count = 0;
        _.each(level.waves, function (wave) {
            _.each(wave.actions, function (action) {
                if (action.type == "spawn" && action.enemy != undefined)
                    count++;
            });
        });
        return count;
    };
    LevelSpawningController.prototype.update = function (delta) {
        var startAction = this.action;
        var startWave = this.wave;
        // increment these first
        this.waveTimer += delta;
        this.actionTimer += delta;
        // Update whatever the current action is
        if (this.action != null)
            this.updateAction(this.action);
        // If the next action is null then lets wait until all enemyies are 
        // killed then try to start the next wave
        if (this.action == null && smorball.stageController.enemies.length == 0) {
            this.wave = this.getNextWave();
            // If the next wave is null then the level is done
            if (this.wave == null) {
                smorball.stageController.showResultScreen(1);
                return;
            }
            else {
                this.action = this.getNextAction();
            }
        }
        if (this.wave != startWave)
            this.logWave();
        if (this.action != startAction)
            this.logAction();
    };
    LevelSpawningController.prototype.logWave = function () {
        if (this.wave == null)
            return;
        console.log("Starting new wave", this.level.waves.indexOf(this.wave) + 1, "of", this.level.waves.length, this.wave);
    };
    LevelSpawningController.prototype.logAction = function () {
        if (this.action == null || this.wave == null)
            return;
        console.log("Starting new action", this.wave.actions.indexOf(this.action) + 1, "of", this.wave.actions.length, this.action);
    };
    LevelSpawningController.prototype.updateAction = function (action) {
        // Switch over the type of action we are currently on
        if (this.action.type == "spawn") {
            if (this.action.enemy != undefined) {
                this.spawnEnemy(this.action.enemy);
                this.action = this.getNextAction();
            }
        }
        else if (this.action.type == "commentate") {
            smorball.stageController.commentryBox.showCommentary(this.action.commentry);
            this.action = this.getNextAction();
        }
        else if (this.action.type == "delay") {
            if (this.actionTimer > this.action.time)
                this.action = this.getNextAction();
        }
    };
    LevelSpawningController.prototype.spawnEnemy = function (enemyType) {
        // Spawn on a random lane
        var lane = Utils.randomOne(smorball.stageController.level.lanes);
        // Create the enemy and start running
        var enemy = new Enemy(enemyType, lane);
        smorball.stageController.addEnemy(enemy);
        enemy.run();
    };
    LevelSpawningController.prototype.getNextWave = function () {
        // Reset the wave timer
        this.waveTimer = 0;
        // Work out what wave index we are currently on and then return the next one
        var indx = this.level.waves.indexOf(this.wave);
        if (indx < this.level.waves.length)
            return this.level.waves[indx + 1];
        // If we get here there are no more waves and so we are done with the level
        return null;
    };
    LevelSpawningController.prototype.getNextAction = function () {
        // Reset the action timer
        this.actionTimer = 0;
        var nextAction = null;
        // If we have only just started then we need to use the first action
        if (this.wave == null)
            nextAction = this.wave.actions[0];
        // Work out what action index we are currently on and then return the next one
        var indx = this.wave.actions.indexOf(this.action);
        if (indx < this.wave.actions.length)
            return this.wave.actions[indx + 1];
        // If we get here then there are no more actions in this wave
        return null;
    };
    return LevelSpawningController;
})();
