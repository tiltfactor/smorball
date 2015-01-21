/**
 * Created by user on 2/1/15.
 */
(function(){
    var Waves = function(config){
        this.config = config;
        this.activeWaves = [];
        this.currentIndex = 0;
        this.complete = false;
        loadEvents(this);
    }

    Waves.prototype.init = function(){

        this.start();
        //activateMultipleWaves(this);
    }
    var loadEvents = function(me){
        var fp = function(object){forcePush(me,object.target)};
        EventBus.addEventListener("forcePush",fp);
    }


    Waves.prototype.start = function(){
        var config = {"id": this.currentIndex, data : this.config.waves.data[this.currentIndex],"lanes": this.config.lanes, "loader" : this.config.loader };
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
            var index = this.activeWaves.indexOf(wave)
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
    var forcePush = function(me, waveId){
        var wave = getWaveFromId(waveId, me);
        if(wave != null && !wave.isComplete()){
            wave.forcePush();
        }
    }


    window.Waves = Waves;

}());
