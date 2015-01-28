/**
 * Created by Abhilash on 23/1/15.
 */
(function(){
    var Level = function(config){
        this.config = config;
        this.labels=[];
        this.initialize();
    };
    Level.prototype = new createjs.Container();
    Level.prototype.Container_initialize = Level.prototype.initialize;
    Level.prototype.initialize = function(){
        this.Container_initialize();
        drawStadium(this)

    };
    var drawStadium = function(me){
        var label = new createjs.Text();
        label.text = me.config.id;
        label.id =me.config.id;
        label.font = "bold 30px Arial";
        label.color = "black";
        label.locked = me.config.locked;
        label.x = me.config.stadiumInfo.x;
        label.y = me.config.stadiumInfo.y;
        if(label.locked){
            label.alpha = 0.5;
        }else{
            label.addEventListener("click",startLevel);
        }
        me.addChild(label);

    }
    var startLevel = function(e){
        EventBus.dispatch("setLevel", e.target);
    }

    window.Level = Level


}());