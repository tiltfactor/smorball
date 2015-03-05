/**
 * Created by user on 1/12/14.
 */
(function () {
    var data;
    window.sprites = window.sprites || {};

    var SpriteMan = function (config) {
        this.config = config;
        this.playerTypes = ["player","hockey","football"];
        this.initialize();
        pl = this;
    }

    var p = SpriteMan.prototype = new createjs.Container;
    p.Sprite_initialize = p.initialize;

    p.initialize = function () {
        this.type = getRandomType(this);
        var id = this.type +"_normal";
        this.spriteData = new SpriteSheet({"id" : id, "data": PlayerData[id].data, "loader" : this.config.loader, "gameState": this.config.gameState});
        this.sprite = new createjs.Sprite(this.spriteData, "idle");
        this.extras = PlayerData[id].extras;
        this.setScale(this.extras.sX,this.extras.sY);
        this.setEffects(id);
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
    var getRandomType = function(me){
        var type = Math.floor(Math.random() * me.playerTypes.length);
        return me.playerTypes[type];
    };

    var drawBorder = function(me){
        if(me.shape != undefined){
            me.removeChild(me.shape);
        }

        me.shape = new createjs.Shape();
        me.shape.graphics.beginStroke("#000").setStrokeStyle(0.5).drawRect(0,0,me.getWidth(), me.getHeight());
        me.addChild(me.shape);

    }

    SpriteMan.prototype.setDefaultSpriteSheet = function(){
        var id = this.type+"_normal";
        this.spriteData = new SpriteSheet({"id" : id, "data": PlayerData[id].data, "loader" : this.config.loader});
        this.sprite.spriteSheet = this.spriteData;
        this.extras = PlayerData[id].extras;
        this.setScale(this.extras.sX,this.extras.sY);
        this.sprite.gotoAndPlay("idle");

    }
    SpriteMan.prototype.setPowerupSpriteSheet = function(powerupType){
        var id = this.type+"_"+powerupType;
        this.spriteData = new SpriteSheet({"id" : id, "data": PlayerData[id].data, "loader" : this.config.loader});
        this.sprite.spriteSheet = this.spriteData;
        this.extras = PlayerData[id].extras;
        this.setScale(this.extras.sX,this.extras.sY);
        this.sprite.gotoAndPlay("idle");

    }
    
    window.sprites.SpriteMan = SpriteMan;
    SpriteMan.prototype.setEffects = function(id){
       // console.log("EFFECTS");
        this.config.playerSound = PlayerData[id].extras.sound;
    }
    SpriteMan.prototype.run  = function(){
        var me = this;
        //drawBorder(this);
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
        this.sprite.gotoAndPlay("idle");
    }

    SpriteMan.prototype.confused = function(){
        this.sprite.gotoAndPlay("confused");
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
    SpriteMan.prototype.kill = function(enemyLife){
        var me = this;
        for(var i=0;i<enemyLife;i++){
            if(this.life!=0){
                this.life -= 1;

            }

        }
        if(this.life!=0){
            this.sprite.gotoAndPlay("tackle");
            this.toRun = function(){
                me.sprite.removeEventListener("animationend",me.toRun);
                me.sprite.gotoAndPlay("run");
            };
            this.sprite.addEventListener("animationend",this.toRun);
        }

        /*var fileId = this.config.playerSound.fall;
        var config = {"file": fileId , "loop": false, "type": this.config.gameState.soundType.EFFECTS, "isMain": false,"loader":this.config.loader, "gameState":me.config.gameState};
        var killSound = new Sound(config);
        EventBus.dispatch("addAudioToList",killSound);*/
        if(this.life == 0){
            this.hit = true;
            this.sprite.gotoAndPlay("tackle");
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
