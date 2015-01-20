/**
 * Created by user on 1/12/14.
 */
(function () {

    window.sprites = window.sprites || {};

    var Powerup = function (config) {
        this.config = config || {};
        this.config.status = "";
        this.used = false;
        this.speed = config.speed || 1;
        this.hit = false;
        this.onTop = false;
        this.initialize();

    }

    var p = Powerup.prototype = new createjs.Container;
    p.Sprite_initialize = p.initialize;
    p.initialize = function () {

        this.spriteData = new SpriteSheet({"id" : this.config.id, "data": PowerupsData[this.config.id].data, "loader" : this.config.loader});
        this.sprite = new createjs.Sprite(this.spriteData, "stand");
        this.setScale(1,1);
        this.Sprite_initialize();
        this.addChild(this.sprite);
        loadEvents(this);
        
    }
    var loadEvents = function(me){
        var handle = function(){me.handleClick(me)};
        me.addEventListener("click", handle);
    }
    Powerup.prototype.handleClick = function(ob){
        console.log("KFDTUDTUGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
        if (ob.config.status == "ToActivate"){
            ob.config.status = "Activated";
            EventBus.dispatch("removeFromMyPowerups", ob);    

        } 
    };
    window.sprites.Powerup = Powerup;

    Powerup.prototype.run  = function(){
        var me = this;
        this.sprite.gotoAndPlay("run");
        this.myTick = function(){tick(me)};
        this.addEventListener("tick",  this.myTick);
    }

    Powerup.prototype.pause = function(){
        this.removeEventListener("tick",  this.myTick);
        this.sprite.gotoAndPlay("stand");
    }
    Powerup.prototype.showOnTop = function(){
        this.x = 200;
        this.y = 20;
        this.onTop = true;
    }
    Powerup.prototype.onKillPush = function(){
        return this.config.onKill;
    }

    Powerup.prototype.stand = function(){
        this.sprite.gotoAndPlay("stand");
    }
    Powerup.prototype.kill = function(){
        var me = this;
        this.hit = true;
        this.sprite.gotoAndPlay("die");
        this.removeEventListener("tick", this.myTick);
        this.myAnimationEnd = function(){removeFallingAnimation(me)};
        this.sprite.addEventListener("animationend",this.myAnimationEnd);
    }
    Powerup.prototype.setSpeed = function(speed){
        this.speed = speed;
        this.sprite._animation.speed = speed;
    }
    
    Powerup.prototype.getHeight = function(){
        return (this.sprite.spriteSheet._frameHeight * this.sprite.scaleY) + 1;
    }
    Powerup.prototype.getWidth = function(){
        return (this.sprite.spriteSheet._frameWidth * this.sprite.scaleX) ;
    }

    Powerup.prototype.setScale = function(sx,sy){
        this.sprite.setTransform(0,6,sx,sy);
    }
    Powerup.prototype.setPosition = function(x,y){
        this.x = x;
        this.y = y;
        this.regY = this.getHeight()/2;
    }

    var tick = function(me){
        me.x = me.x ;
        //if(me.endPoint != null && me.hit == false && me.x < me.endPoint){
            //me.hit = true;
            //me.lifes.length =0;
            //me.kill();
            //EventBus.dispatch("killLife");

        //}
        /*if(me.hit == false && me.endPoint == ){

        }*/
        /*if(me.onTop){
            console.log(me.onTop);
        }*/
    }

    var removeFallingAnimation = function(me){
        me.sprite.removeEventListener("animationend",me.myAnimationEnd);
        EventBus.dispatch("killme", me);
        EventBus.dispatch("resetTimer");
    }

    Powerup.prototype.getWaveId = function(){
        return this.config.waveId;
    }

    Powerup.prototype.getLaneId = function(){
        return this.config.laneId;
    }
}());
