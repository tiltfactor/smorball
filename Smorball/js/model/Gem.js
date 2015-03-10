/**
 * Created by Abhilash on 1/12/14.
 */
(function () {
    var BounceHeight = 0.18;
    var BounceRate = 3.0;
    var BounceSync = -0.75;


    var Gem =  function(loader) {
        this.initialize(loader);
    };
    Gem.prototype  = new createjs.Bitmap();
    Gem.prototype.Bitmap_initialize = Gem.prototype.initialize;
    Gem.prototype.initialize = function(loader){
        var me = this;
        this.Bitmap_initialize(loader.getResult("gem"));
        this.addEventListener("tick", function(){tick(me)});
        this.setTransform(0,0,0.25,0.25);
    };
    Gem.prototype.setPosition = function(x,y){
        this.x = x;
        this.y = y;
        this.basePosition = new createjs.Point(this.x, this.y);
    };
    Gem.prototype.kill = function(){
        EventBus.dispatch("killme", this);
    }
    var tick = function(me){
        var t = (createjs.Ticker.getTime() / 1000) * BounceRate + me.x * BounceSync;
        var bounce = Math.sin(t) * BounceHeight * 32;
        me.y = me.basePosition.y + bounce;
    };

    window.Gem = Gem;
}());