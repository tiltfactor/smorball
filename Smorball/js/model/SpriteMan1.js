/**
 * Created by user on 1/12/14.
 */
(function () {
    var data;
    window.sprites = window.sprites || {};

    var SpriteMan1 = function (config) {
        this.config = config;
        this.initialize();
    }

    var p = SpriteMan1.prototype = new createjs.Container;
    p.Sprite_initialize = p.initialize;

    p.initialize = function () {
        this.spriteData = new SpriteSheet({"id" : this.config.id, "data": PlayerData[this.config.id], "loader" : this.config.loader});
        this.sprite = new createjs.Sprite(this.spriteData, "stand");
        this.setScale(1,1);
        this.Sprite_initialize();
        this.addChild(this.sprite);
        this.hit = false;
        this.speed = this.config.speed || 6;

        this.bounds = this.getBounds();
        //this.setTransform(0,0,0.5,0.5);
    }

    var drawBorder = function(me){
        var shape = new createjs.Shape();
        shape.graphics.beginStroke("#000").setStrokeStyle(0.2).drawRect(0,0,me.getWidth(), me.getHeight());
        me.addChild(shape);

    }

    window.sprites.SpriteMan1 = SpriteMan1;

    SpriteMan1.prototype.run  = function(){
        var me = this;
        this.sprite.gotoAndPlay("run");
        this.myTick = function(){tick(me)};
        this.addEventListener("tick", this.myTick);
    }

    SpriteMan1.prototype.pause = function(){
        this.removeEventListener("tick",  this.myTick);
        this.sprite.gotoAndPlay("stand");
    }

    SpriteMan1.prototype.jump = function(){
        this.sprite.gotoAndPlay("jump");
    }
    SpriteMan1.prototype.setPosition = function(x, y){
        this.x  = x;
        this.y = y;
        this.regX = 0;
        this.regY = this.getHeight()/2;
    }
    SpriteMan1.prototype.setSpeed = function(speed){
        this.speed = speed;
        this.sprite._animation.speed = speed;
    }
    SpriteMan1.prototype.kill = function(){
        var me = this;
        this.sprite.gotoAndPlay("fall");
        this.myAnimationEnd = function(){removeFallingAnimation(me)};
        me.removeEventListener("tick",  this.myTick);
        this.sprite.addEventListener("animationend",this.myAnimationEnd);
        return 0;
    }
    SpriteMan1.prototype.setEndPoint = function(endPointX){
        this.endPoint = endPointX;
    }
    SpriteMan1.prototype.getHeight = function(){
        return (this.sprite.spriteSheet._frameHeight * this.sprite.scaleY) ;
    }
    SpriteMan1.prototype.getWidth = function(){
        return (this.sprite.spriteSheet._frameWidth * this.sprite.scaleX) ;
    }

    SpriteMan1.prototype.setScale = function(sx,sy){
        this.sprite.setTransform(0,6,sx,sy);
        drawBorder(this);
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
