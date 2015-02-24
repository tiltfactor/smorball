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
        this.team = this.config.stadiumInfo.team;

        drawStadium(this);
        //drawShop(this);
        this.setPosition();
        this.addEventListener("mouseover",function ( evt ) {
            evt.target.cursor = 'pointer';
            EventBus.dispatch("changeLevelInfoBar",evt.target.parent)
        });

    };
    var drawStadium = function(me){
        var stadiumBase = new createjs.Bitmap(me.config.loader.getResult("stadium_base"));
        me.addChild(stadiumBase);
        var stadium = new createjs.Bitmap();

        if(me.config.locked){
            stadium.image = me.config.loader.getResult("lock");
            me.id = me.config.id;

            stadium.x = stadiumBase.getTransformedBounds().width/4;
            stadium.y = -stadium.getTransformedBounds().height/2;
            me.addChild(stadium);

        }else{
            stadium.image = me.config.loader.getResult("stadium");
            me.id = me.config.id;
            me.addEventListener("click",startLevel);
            stadium.x = stadiumBase.getTransformedBounds().width/8;
            stadium.y = -stadium.getTransformedBounds().height/4;
            me.addChild(stadium);
            drawLogo(me,stadium);

        }




    }
    Level.prototype.setPosition=function(){
        this.x = this.config.stadiumInfo.x;
        this.y = this.config.stadiumInfo.y;
    }


    var startLevel = function(e){
        EventBus.dispatch("setLevel", e.target.parent.id);
    }
    var drawLogo = function(me,stadium){
         var logo = new createjs.Bitmap(me.config.loader.getResult(me.config.stadiumInfo.logo));
        logo.setTransform(0,stadium.y,0.3,0.3);
        logo.y = stadium.y - logo.getTransformedBounds().height/2 - 25;
        me.addChild(logo);
    };


    window.Level = Level


}());