/**
 * Created by user on 12/12/14.
 */
(function () {
    var Wave = function(config){
        // var config = {"level": 2, "waves": 5, "enemyPerWave" : 2, "lanes" : 2, "life" : 1, "types" : ["boss"]}
        this.config = config;
        this.currentIndex = 0;
        this.activeIndex = 0;
        this.complete = false;
        this.timer = 0;
        generateEnemyProperties(this);
        this.push();
        console.log("start of wave");
       // setTimer(this);
    }

    var generateEnemyProperties = function(me){
        if(me.config.data.stageDatas.length == 0){
            var types = me.config.data.types;
            var size = me.config.data.size;
            for(var i = 0; i< size; i++){
                var properties = {};
                properties[0] = types[Math.floor(Math.random()*types.length)];
                properties[1] = Math.floor(Math.random()*me.config.lanes)+1;
                properties[2] = me.config.data.time;
                properties[3] = "";

                me.config.data.stageDatas.push(properties);
            }
        }


    }

    var setNext = function(time, me){
        console.log(time);
        me.timer = setTimeout(function(){
            me.push();
        }, time);
    }

    Wave.prototype.forcePush = function(){
        clearTimeout(this.timer);
        this.push();
    }

    Wave.prototype.push = function(){
        if(!this.complete){
            var properties = this.config.data.stageDatas[this.currentIndex];
            if(properties[4] == undefined){
                this.pushEnemy(properties);
                this.activeIndex++;
            }else{
                this.pushPowerUp(properties);
            }
            this.currentIndex++;
            

            if(this.currentIndex >= this.config.data.size) {
                console.log("complete");
                this.complete = true;
            }

        }
    }

    Wave.prototype.pushPowerUp = function(properties){
        console.log("power up");
        //set config and call new Gem.
        //dispatch to pushGem.
        //currently set some constant postion in lane, later can modify.
        var type = properties[0];
        var lane = properties[1];
        var time = properties[2];
        var msg = properties[3];
        lane = this.config.lanes == 1? 2 : lane;
        var onKill = (time == undefined || time == -1) ? true: false;
        var config = {"id": type, "laneId": lane, "waveId": this.config.id, "onKill": onKill, "loader" : this.config.loader};
        var powerup = new sprites.Powerup(config);
        EventBus.dispatch("pushPowerup",powerup);
        if(!(msg==""||msg==undefined)){
            EventBus.dispatch("showCommentary",msg);
        }
        if(!onKill){
            setNext(time, this);
        }
    }
    
  Wave.prototype.pushEnemy = function(enemyProperties){
      console.log(this.currentIndex +"  //"+ this.complete)
            var type = enemyProperties[0];
            var lane = enemyProperties[1];
            var time = enemyProperties[2];
            var msg =  enemyProperties[3];
            lane = this.config.lanes == 1? 2 : lane;
            var onKill = (time == undefined || time == -1) ? true: false;
            var config = {"id": type, "laneId": lane, "waveId": this.config.id, "onKill": onKill, "loader" : this.config.loader, "gameState" : this.config.gameState};
            var enemy = new sprites.Enemy(config);
            if(!(msg==""||msg==undefined)){
                EventBus.dispatch("showCommentary",msg);
            }
            EventBus.dispatch("pushEnemy",enemy);
            if(!onKill){
                setNext(time, this);
            }

    }

    Wave.prototype.killEnemy = function(){
        this.activeIndex--;

    }
    Wave.prototype.isComplete = function(){
        if(this.complete && this.activeIndex == 0){
            return true;
        }else{
            //resetTimer(this);
            return false;
        }
    }
    Wave.prototype.getId = function(){
        return this.config.id;
    }

    window.Wave = Wave;

}());
