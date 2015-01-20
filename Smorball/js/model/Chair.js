/**
 * Created by Abhilash on 19/1/15.
 */
(function () {
    var Chair = function(config){
        this.config = config;
        this.id = config.id;
        this.ox = config.x;
        this.oy = config.y;
        this.initialize();

    };
    Chair.prototype = new createjs.Container();

    Chair.prototype.Container_initialize = Chair.prototype.initialize;

    Chair.prototype.initialize = function(){
        this.Container_initialize();
        var bitmap = new createjs.Bitmap(this.config.loader.getResult("seat"));
        bitmap.setTransform(this.ox,this.oy,0.5,0.5);
        this.addChild(bitmap);

    };
    Chair.prototype.play = function(){

    };
    window.Chair = Chair;
}());