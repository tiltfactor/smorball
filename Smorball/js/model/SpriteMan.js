/**
 * Created by user on 1/12/14.
 */
(function () {
    var data;
    window.sprites = window.sprites || {};

    var SpriteMan = function (config) {
        this.config = config;
        this.initialize();
        pl = this;
    }

    var p = SpriteMan.prototype = new createjs.Container;
    p.Sprite_initialize = p.initialize;

    p.initialize = function () {
        this.spriteData = new SpriteSheet({"id" : this.config.id, "data": PlayerData[this.config.id].data, "loader" : this.config.loader, "gameState": this.config.gameState});
        this.sprite = new createjs.Sprite(this.spriteData, "stand");
        this.extras = PlayerData[this.config.id].extras;
        this.setScale(this.extras.sX,this.extras.sY);
        this.setEffects();
        this.Sprite_initialize();
        this.addChild(this.sprite);
        this.hit = false;
        this.hitPowerup = false;
        this.life = 1;
        this.singleHit = false;
        this.hitEnemies = [];
        this.speed = this.config.speed || 6;

        this.bounds = this.getBounds();
        //this.setTransform(0,0,0.5,0.5);
    }

    var drawBorder = function(me){
        if(me.shape != undefined){
            me.removeChild(me.shape);
        }

        me.shape = new createjs.Shape();
        me.shape.graphics.beginStroke("#000").setStrokeStyle(0.2).drawRect(0,0,me.getWidth(), me.getHeight());
        me.addChild(me.shape);

    }

    SpriteMan.prototype.setSpriteSheet = function(id){
        this.spriteData = new SpriteSheet({"id" : id, "data": PlayerData[id].data, "loader" : this.config.loader});
        this.sprite.spriteSheet = this.spriteData;
        this.extras = PlayerData[id].extras;
        this.setScale(this.extras.sX,this.extras.sY);
       // this.setScale(1,1);
        //return nm;
    }
    
    window.sprites.SpriteMan = SpriteMan;
    SpriteMan.prototype.setEffects = function(){
        console.log("EFFECTS");
        this.config.playerSound = PlayerData[this.config.id].extras.sound;
    }
    SpriteMan.prototype.run  = function(){
        var me = this;
        this.sprite.gotoAndPlay("run");
        //var fileId = this.config.playerSound.run;
        //var config = {"file": fileId , "loop": false, "type": this.config.gameState.gs.soundType.EFFECTS, "isMain": false,"loader":this.config.loader, "gameState":me.config.gameState};
        //var runSound = new Sound(config);
        //EventBus.dispatch("addAudioToList",runSound);
        this.myTick = function(){tick(me)};
        this.addEventListener("tick", this.myTick);
    }
    SpriteMan.prototype.addPowerups = function(power){
        this.life = power.life;
        this.singleHit = power.singleHit;
    }
    SpriteMan.prototype.pause = function(){
        this.removeEventListener("tick",  this.myTick);
        this.sprite.gotoAndPlay("stand");
    }

    SpriteMan.prototype.jump = function(){
        this.sprite.gotoAndPlay("jump");
    }
    SpriteMan.prototype.setPosition = function(x, y){
        this.x  = x;
        this.y = y;
        this.regX = 0;
        this.regY = this.getHeight();///2;
    }
    SpriteMan.prototype.setSpeed = function(speed){
        this.speed = speed;
        this.sprite._animation.speed = speed;
    }
    SpriteMan.prototype.kill = function(){
        var me = this;
        this.life -= 1;  
        /*var fileId = this.config.playerSound.fall;
        var config = {"file": fileId , "loop": false, "type": this.config.gameState.soundType.EFFECTS, "isMain": false,"loader":this.config.loader, "gameState":me.config.gameState};
        var killSound = new Sound(config);
        EventBus.dispatch("addAudioToList",killSound);*/
        if(this.life == 0){
            this.hit = true;
            this.sprite.gotoAndPlay("fall");
            this.myAnimationEnd = function(){removeFallingAnimation(me)};
            me.removeEventListener("tick",  this.myTick);
            this.sprite.addEventListener("animationend",this.myAnimationEnd);
            return 0;
        } 


    }
    SpriteMan.prototype.setEndPoint = function(endPointX){
        this.endPoint = endPointX;
    }
    SpriteMan.prototype.getHeight = function(){
        return this.sprite._rectangle.height;
        //return (this.sprite.spriteSheet._frameHeight * this.sprite.scaleY) ;
    }
    SpriteMan.prototype.getWidth = function(){
        return this.sprite._rectangle.width;
        //return (this.sprite.spriteSheet._frameWidth * this.sprite.scaleX) ;
    }

    SpriteMan.prototype.setScale = function(sx,sy){
        this.sprite.setTransform(0,6,sx,sy);
        //drawBorder(this);
    }
    SpriteMan.prototype.getLaneId = function(){
        return this.config.laneId;
    }
    SpriteMan.prototype.getLife = function(){
        return this.life;
    }
    SpriteMan.prototype.setLife = function(life){
        this.life = life;
    }

    var tick = function(me){
        me.x = me.x + me.speed;

        if(me.endPoint != null && me.hit == false && me.x > me.endPoint-me.getWidth()){
            me.hit = true;
            me.kill();
        }
    }

    var removeFallingAnimation = function(me){
        me.sprite.removeEventListener("animationend",me.myAnimationEnd);
        EventBus.dispatch("killme", me);
    }

}());
