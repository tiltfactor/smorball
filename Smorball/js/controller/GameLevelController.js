/**
 * Created by user on 9/12/14.
 */
function GameLevelController(config){
    this.config = config;
    gl =this;

     GameLevelController.prototype.init = function(){

         this.gameLevels = [];

         this.config.stage.canvas.width = window.innerWidth;
         this.config.stage.canvas.height = window.innerHeight;
         this.scaleFactorX = window.innerWidth/800;
         this.scaleFactorY = window.innerHeight/600;
        loadEvents(this);
    }
    var loadEvents = function (me) { 
        var sl = function(){me.showMap()};
        EventBus.addEventListener("showMap",sl);

        var tl = function(level){me.setLevel(level.target)};
        EventBus.addEventListener("setLevel", tl);
    }

    GameLevelController.prototype.showMap = function(){
        this.config.stage.removeAllChildren();
        $("#dialog-utility").show();
        this.map = new createjs.Container();
        this.map.scaleX = this.scaleFactorX;
        this.map.scaleY = this.scaleFactorY;

        this.config.stage.addChild(this.map);
        var levelmap = new createjs.Bitmap(this.config.loader.getResult("levelmap"));
        levelmap.setTransform(0,0,0.5,0.5);
        this.map.addChild(levelmap);

        drawLevels(this);


    }

    var drawLevels = function(me){
        var totLevels = 7;
        for(var i =0 ; i< totLevels ; i++){
            var isLocked = me.config.gameState.gs.maxLevel <= i ? true : false;
            var config = {"stadiumInfo" : MapData[i], "locked" :isLocked ,"loader":me.config.loader,"id":i+1};
            var level = new Level(config);
            me.gameLevels.push(level);
            me.map.addChild(level);
        }
        me.config.stage.update();

    }

    GameLevelController.prototype.setLevel = function(label){
        this.config.gameState.gs.currentLevel=label.id;
        EventBus.dispatch("hideAll");
        EventBus.dispatch("newGame");
        $("#myCanvas").show();

    }

}