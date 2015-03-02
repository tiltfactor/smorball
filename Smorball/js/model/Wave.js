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
        this.pause = false;
        if(this.config.gameState.currentLevel == this.config.gameState.survivalLevel){
            loadEnemiesOnSurvival(this);
        }else{
            generateEnemyProperties(this);
        }


        this.push();
        //console.log("start of wave");
        // setTimer(this);
    }

    var loadEnemiesOnSurvival = function(me){
        //var enemyList = [EnemyData.boss,EnemyData.enemy_regular, EnemyData.weak];
        me.counter = 1;
        me.surivalTime = 6000;
        var property = [EnemyData.enemy_regular.extras.id, 2, me.surivalTime];
        me.config.data.stageDatas.push(property);
        me.timer = setInterval(function(){if(me.config.data.stageDatas.length < 50){ createData(me)}},1000);
    }

    var createData = function(me){
        ++me.counter;

        var mainType = getTypeForSurvival(me);
        var type = getTypeForSurvival(me,mainType);
        var lane = Math.floor((Math.random()*3))+1;
        var time = getTimeForSurvival(mainType,type, me);
        var property = [type.extras.id, lane, time,"", mainType];
        me.config.data.stageDatas.push(property);

    }
    var getTimeForSurvival = function(mainType, type,me){
        if(mainType == "powerup"){
            return 1000;
        }else{
            if(me.counter % 8 == 0){
                me.surivalTime = (me.surivalTime - Math.ceil(me.surivalTime*.2)) < 500 ? 500 : (me.surivalTime - Math.ceil(me.surivalTime*.2));
                console.log("updated survival time---->"+me.surivalTime);
            }


            return me.surivalTime + type.extras.life *.4*1000;
        }

    }
    var getTypeForSurvival = function(me, type){
        var enemyList = [EnemyData.boss,EnemyData.enemy_regular, EnemyData.weak,EnemyData.badGuy,EnemyData.fast,EnemyData.regular];
        var powerupList = [PowerupsData.cleats,PowerupsData.cleats,PowerupsData.bullhorn];
        if(type == undefined){
            if(me.counter % 5 == 0){
                return "powerup";
            }else{
                return "enemy";
            }
        }else{
            if(type == "enemy"){
                return enemyList[Math.floor(Math.random() * enemyList.length)];
            }else{
                return powerupList[Math.floor(Math.random() * powerupList.length)];
            }
        }

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
       // console.log(time);
       // me.currentTime = 0;
        me.time = time;
        me.startTimer = true;
        me.timer = setTimeout(function(){
            if(!me.pause){
                console.log("testing the timer............"+createjs.Ticker.getTime());
                me.push();
                me.startTimer = false;
            }

        }, time);
    }

    Wave.prototype.paused = function(pause){
        if(this.startTimer && !pause){
            //this.push();
            setNext(this.time/2, this);
            this.pause = false;
        }else{
            this.pause = true;
            clearTimeout(this.timer);
        }
    }



    Wave.prototype.forcePush = function(){
        clearTimeout(this.timer);
        this.push();
    }

    Wave.prototype.push = function(){
        if(!this.complete){
            var properties = this.config.data.stageDatas.shift();
            if(properties[4] == undefined || properties[4] == "enemy"){
                this.pushEnemy(properties,this.config.lanesObj);
                this.activeIndex++;
            }else{
                this.pushPowerUp(properties);
            }
            this.currentIndex++;


            if(this.currentIndex >= this.config.data.size && this.config.gameState.currentLevel != this.config.gameState.survivalLevel) {
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
        //console.log("time===============  :::::::::::::::>>>>"+ time);
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

    Wave.prototype.pushEnemy = function(enemyProperties,lanesObj){
        console.log(this.currentIndex +"  //"+ this.complete);
        var type = enemyProperties[0];
        var lane = enemyProperties[1];
        var time = enemyProperties[2];
        if(time!= -1){
            time = time * this.config.gameState.gs.difficulty;
        }
        var msg =  enemyProperties[3];
        lane = this.config.lanes == 1? 2 : lane;
        console.log("time===============  :::::::::::::::>>>>"+ time);
        var onKill = (time == undefined || time == -1) ? true: false;
        var config = {"id": type, "lanesObj" : lanesObj, "laneId": lane, "waveId": this.config.id, "onKill": onKill, "loader" : this.config.loader, "gameState" : this.config.gameState};
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
    Wave.prototype.clearAll = function(){
        clearTimeout(this.timer);
        clearInterval(this.timer);
        this.timer = 0;
    }

    window.Wave = Wave;

}());