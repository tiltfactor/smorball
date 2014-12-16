/**
 * Created by user on 1/12/14.
 */
(function () {
    var data;
    window.sprites = window.sprites || {};

    var SpriteMan = function (config) {
        this.config = config;
        this.initialize();
    }

    var p = SpriteMan.prototype = new createjs.Sprite();
    p.Sprite_initialize = p.initialize;

    p.initialize = function () {
        this.data = new SpriteSheet({"id" : this.config.id, "images" : this.config.images, "data": PlayerData[this.config.id], "loader" : this.config.loader});
        this.Sprite_initialize(this.data, 'stand');
        this.hit = false;
        this.speed = this.config.speed || 1;
        this.setTransform(0,0,0.5,0.5);
        this.bounds = this.getBounds();
    }
    window.sprites.SpriteMan = SpriteMan;

    SpriteMan.prototype.run  = function(){
        var me = this;
        this.gotoAndPlay("run");
        this.myTick = function(){tick(me)};
        this.addEventListener("tick", this.myTick);
    }

    SpriteMan.prototype.pause = function(){
        this.removeEventListener("tick",  this.myTick);
        this.gotoAndPlay("stand");
    }

    SpriteMan.prototype.jump = function(){
        this.gotoAndPlay("jump");
    }
    SpriteMan.prototype.setPosition = function(x, y){
        this.x  = x;
        this.y = y;
    }
    SpriteMan.prototype.setSpeed = function(speed){
        this.speed = speed;
        this._animation.speed = speed;
    }
    SpriteMan.prototype.kill = function(){
        var me = this;
        this.gotoAndPlay("fall");
        this.myAnimationEnd = function(){removeFallingAnimation(me)};
        this.addEventListener("animationend",this.myAnimationEnd);
        return 0;
    }
    SpriteMan.prototype.setEndPoint = function(endPointX){
        this.endPoint = endPointX;
    }

    var tick = function(me){
        me.x = me.x + me.speed;

        if(me.endPoint != null && me.hit == false && me.x > me.endPoint- me.bounds.x){
            me.hit = true;
            me.kill();
        }
    }

    var removeFallingAnimation = function(me){
        me.removeEventListener("animationend",me.myAnimationEnd);
        EventBus.dispatch("killme", me);
    }

}());
