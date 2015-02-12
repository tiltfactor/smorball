/**
 * Created by user on 1/12/14.
 */
(function () {

    window.sprites = window.sprites || {};

    var Enemy = function (config) {
        this.config = config || {};
        this.lifes = [];
        this.speed = config.speed || 1;
        this.lifeRectSize = 5;
        this.hit = false;
        this.initialize();

    }

    var p = Enemy.prototype = new createjs.Container;
    p.Sprite_initialize = p.initialize;
    p.initialize = function () {

        this.spriteData = new SpriteSheet({"id" : this.config.id, "data": EnemyData[this.config.id].data, "loader" : this.config.loader});
        this.sprite = new createjs.Sprite(this.spriteData, "stand");
        this.setScale(1,1);
        this.setEffects();
        this.Sprite_initialize();
        this.addChild(this.sprite);
        this.life = this.config.life ||  EnemyData[this.config.id].extras.life;
        generateLife(this);
        setExtras(this);
        this.bounds = this.getBounds();
    }
    var setExtras = function(me){
        me.extras = EnemyData[me.config.id].extras;
        me.life = me.extras.life || 1;
        me.speed = me.extras.speed || 1;
        if(me.extras.changeLane){
            setTimeout(function(){EventBus.dispatch("changeLane", me)},2000);
        }
    }

    var drawBorder = function(me){
        var shape = new createjs.Shape();
        shape.graphics.beginStroke("#000").setStrokeStyle(0.1).drawRect(0,0,me.getWidth(),me.getHeight());
        me.addChild(shape);

    }

    window.sprites.Enemy = Enemy;
    Enemy.prototype.run  = function(){
        var me = this;
        this.sprite.gotoAndPlay("run");
        //var fileId = this.config.enemySound.run;
        //var config = {"file": fileId , "loop": false, "type": this.config.gameState.soundType.EFFECTS, "isMain": false,"loader":this.config.loader, "gameState":me.config.gameState};
        //var runSound = new Sound(config);
        //EventBus.dispatch("addAudioToList",runSound);
        this.myTick = function(){tick(me)};
        this.addEventListener("tick",  this.myTick);
    }

    Enemy.prototype.pause = function(){
        this.removeEventListener("tick",  this.myTick);
        this.sprite.gotoAndPlay("stand");
    }

    Enemy.prototype.die = function(){
        this.sprite.gotoAndPlay("die");
    }
    Enemy.prototype.kill = function(){
        var me = this;
        this.removeLife();
        var fileId = this.config.enemySound.hit;
        var config = {"file": fileId , "loop": false, "type": this.config.gameState.soundType.EFFECTS, "isMain": false,"loader":this.config.loader, "gameState":me.config.gameState};
        var hitSound = new Sound(config);
        EventBus.dispatch("addAudioToList",hitSound);
        var lanesObj = this.config.lanesObj;
        for(var i=0; i<lanesObj.length; i++){
            if(this.config.laneId == lanesObj[i].laneId){
                var currentLaneObj = lanesObj[i];
            }
        }
        if(this.lifes.length == 0){
            this.hit = true;
            var fileId = this.config.enemySound.die;
            var config = {"file": fileId , "loop": false, "type": this.config.gameState.soundType.EFFECTS, "isMain": false,"loader":this.config.loader, "gameState":me.config.gameState};
            var dieSound = new Sound(config);
            EventBus.dispatch("addAudioToList",dieSound);
            this.sprite.gotoAndPlay("die");
            this.removeEventListener("tick", this.myTick);
            this.myAnimationEnd = function(){removeFallingAnimation(me)};
            this.sprite.addEventListener("animationend",this.myAnimationEnd);
        }
        else{
            this.x = this.x + 0.1 * currentLaneObj.config.width;
            console.log(0.1 * currentLaneObj.config.width);
        }
        return this.lifes.length;
    }
    Enemy.prototype.setSpeed = function(speed){
        this.speed = speed;
        this.sprite._animation.speed = speed;
    }

    Enemy.prototype.setPosition = function(x, y){
        this.x = x;
        this.y = y;
        this.regX = 0;
        this.regY = this.getHeight(); ///2;
    }
    Enemy.prototype.addLife = function(start){
        var life = new createjs.Shape();
        life.graphics.beginFill("#123").drawRect(0,0,this.lifeRectSize,this.lifeRectSize);
        this.addChild(life);
        this.lifes.push(life);
        if(!start){
            updateLifePos(this);
        }
    }
    Enemy.prototype.removeLife = function(){
        var life = this.lifes.pop();
        this.removeChild(life);
        updateLifePos(this);
    }
    Enemy.prototype.getHeight = function(){
        return (this.sprite.spriteSheet._frameHeight * this.sprite.scaleY) + this.lifeRectSize + 1;
    }
    Enemy.prototype.getWidth = function(){
        return (this.sprite.spriteSheet._frameWidth * this.sprite.scaleX) ;
    }

    Enemy.prototype.setScale = function(sx,sy){
        this.sprite.setTransform(0,6,sx,sy);
        drawBorder(this);
        updateLifePos(this);
    }
    Enemy.prototype.setEffects = function(){
        console.log("EFFECTS");
        this.config.enemySound = EnemyData[this.config.id].extras.sound;
    }
    var generateLife = function(me){
        for(var i = 0 ; i< me.life; i++){
            me.addLife(false);
        }
        updateLifePos(me);
    }

    var updateLifePos = function(me){

        var sx = (me.getWidth()/2) - (me.life * (me.lifeRectSize))/2 ;
        var sy = 0;

        for(var i= 0 ; i< me.lifes.length ; i++){
            var life = me.lifes[i];
            life.x = sx;
            sx = sx+(me.lifeRectSize+1);
            life.y = sy;
        }
    }
    Enemy.prototype.setEndPoint = function(endPointX){
        this.endPoint = endPointX;
    }

    var tick = function(me){
        me.x = me.x - me.speed;
        if(me.endPoint != null && me.hit == false && me.x < me.endPoint){
            me.hit = true;
            me.lifes.length =0;
            me.kill();
            EventBus.dispatch("killLife");


        }
    }

    var removeFallingAnimation = function(me){
        me.sprite.removeEventListener("animationend",me.myAnimationEnd);
        EventBus.dispatch("killme", me);
        EventBus.dispatch("resetTimer");
    }

    Enemy.prototype.getWaveId = function(){
        return this.config.waveId;
    }

    Enemy.prototype.getLaneId = function(){
        return this.config.laneId;
    }
    Enemy.prototype.setLaneId = function(laneId){
        this.config.laneId = laneId;
    }

    Enemy.prototype.onKillPush = function(){
        return this.config.onKill;
    }


}());