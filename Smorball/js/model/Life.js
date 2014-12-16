(function () {

    var Life =  function(loader) {
        this.initialize(loader);
    };
    Life.prototype  = new createjs.Bitmap();
    Life.prototype.Bitmap_initialize = Life.prototype.initialize;
    Life.prototype.initialize = function(loader){
        this.Bitmap_initialize(loader.getResult("heart"));
    };
    Life.prototype.setPosition = function(x,y){
        this.x = x;
        this.y = y;
    };
    Life.prototype.getWidth = function(){
        return this.getBounds().width * this.scaleX;
    }

    window.Life = Life;
}());