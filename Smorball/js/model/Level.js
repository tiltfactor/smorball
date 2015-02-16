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
        drawStadium(this);
        //drawShop(this);
        this.setPosition();
        this.addEventListener("mouseover",function ( evt ) {
            evt.target.cursor = 'pointer'
        });

    };
    var drawStadium = function(me){
        var stadiumBase = new createjs.Bitmap(me.config.loader.getResult("stadium_base"));
        me.addChild(stadiumBase);
        var stadium = new createjs.Bitmap();

        if(me.config.locked){
            stadium.image = me.config.loader.getResult("lock");
            stadium.id = me.config.id;
            stadium.x = stadiumBase.getTransformedBounds().width/4;
            stadium.y = -stadium.getTransformedBounds().height/2;

        }else{
            stadium.image = me.config.loader.getResult("stadium");
            stadium.id = me.config.id;
            stadium.addEventListener("click",startLevel);
            stadium.x = stadiumBase.getTransformedBounds().width/8;
            stadium.y = -stadium.getTransformedBounds().height/4;

        }


        me.addChild(stadium);

    }
    Level.prototype.setPosition=function(){
        this.x = this.config.stadiumInfo.x;
        this.y = this.config.stadiumInfo.y;
    }


    var startLevel = function(e){
        EventBus.dispatch("setLevel", e.target);
    }


    window.Level = Level


}());