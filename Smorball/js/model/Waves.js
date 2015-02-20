/**
 * Created by user on 2/1/15.
 */
    (function(){
    var Waves = function(config){
        this.config = config;
        this.activeWaves = [];
        this.extraPowerups = [];
        this.currentIndex = 0;
        this.pushPositions=0;
        this.complete = false;
        loadEvents(this);
    }

    Waves.prototype.init = function(){
        this.totalOpponents = this.config.waves.enemySize;
        this.start();
        //activateMultipleWaves(this);
    }
    var loadEvents = function(me){
        var fp = function(object){forcePush(me,object.target)};
        EventBus.addEventListener("forcePush",fp);

        var pn = function(type){createExtraPowerup(me,type.target)};
        EventBus.addEventListener("pushExtraPowerup",pn);
    }

    Waves.prototype.getPendingEnemies = function(){
       if(this.config.gameState.currentLevel == this.config.gameState.survivalLevel){
           return 0;
       }

        return --this.totalOpponents;
    }

    Waves.prototype.start = function(){
        var config = {"id": this.currentIndex,"lanesObj" : this.config.lanesObj, data : this.config.waves.data[this.currentIndex],"lanes": this.config.lanes, "loader" : this.config.loader, "gameState" : this.config.gameState };
        var wave = new Wave(config);
        this.currentIndex++;
        this.activeWaves.push(wave);
    }


    var activateMultipleWaves = function(me){
        for(var i= 1 ; i< me.config.waves.activeWaves; i++){
            setTimeout(function(){me.start();}, me.config.waves.time);
        }
    }


    Waves.prototype.getStatus = function(){
        return this.complete;
    }

    var getWaveFromId = function(waveId, me){
        for(var i= 0 ; i< me.activeWaves.length; i++){
            var wave = me.activeWaves[i];
            if(wave.getId() == waveId){
                return wave
            }
        }
        return null;
    }

    Waves.prototype.update = function(waveId, onKillPush,type){
        var wave = getWaveFromId(waveId, this);
        if(type == "enemy"){
            wave.killEnemy();
        }
        var status = wave.isComplete();

        if(status){
            var index = this.activeWaves.indexOf(wave);
            this.activeWaves.splice(index,1);
        }else{
            if(onKillPush)
                wave.push();
        }

        if(status){
            if(this.currentIndex < this.config.waves.data.length){
                this.start();
                console.log("New wave started");
            }else{
                this.complete = true;
                console.log("Level Completed");
            }
        }

    }
    Waves.prototype.clearAll = function(){
        for(var i = 0 ; i< this.activeWaves.length; i++){
            var wave = this.activeWaves.pop();
            wave.clearAll();
        }
        this.currentIndex = 0;
    }
    var forcePush = function(me, waveId){
        var wave = getWaveFromId(waveId, me);
        if(wave != null && !wave.isComplete()){
            wave.forcePush();
        }
    }

    var createExtraPowerup = function(me,type){
        var properties = {};
        properties[0] = type;
        properties[1] = Math.floor(Math.random()*me.config.lanes)+1;
        properties[2] = 0;
        properties[3] = "";
        if(me.activeWaves[0]){
            me.activeWaves[0].pushPowerUp(properties);
        }


    }



    window.Waves = Waves;

}());