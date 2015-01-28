/**
 * Created by user on 9/12/14.
 */
function GameLevelController(config){
    this.config = config;
    gl =this;

     GameLevelController.prototype.init = function(){

         this.config.stage.canvas.width = window.innerWidth;
         this.config.stage.canvas.height = window.innerHeight;
         this.scaleFactorX = window.innerWidth/800;
         this.scaleFactorY = window.innerHeight/600;
        loadEvents(this);
        EventBus.dispatch("hideLevel");
        createBackground(this);
        var levelLabel = this.config.gameState.gs.maxLevel;
        this.levelScreen = new LevelMap({"loader":this.config.loader,"Level":levelLabel});
        this.levelScreen.scaleX = window.innerWidth/800;
        this.levelScreen.scaleY = window.innerHeight/600;
        this.config.stage.addChild(this.levelScreen);

        this.config.stage.update();
    }
    var loadEvents = function (me) { 
        var sl = function(){me.showLevel()};
        EventBus.addEventListener("showLevel",sl);
        var el = function(){me.hideLevel()};
        EventBus.addEventListener("hideLevel", el);
        var tl = function(level){me.setLevel(level.target)};
        EventBus.addEventListener("setLevel", tl);
    }
    GameLevelController.prototype.showLevel = function () {
        if(this.config.gameState.gs.currentLevel<=7){
            this.levelScreen.activate(this.config.gameState.gs.maxLevel);
            $("#myCanvas").hide();
            $("#canvasHolder").hide();
            $("#dialog-utility").show();
            this.config.stage.update();
        }
        else{
            this.config.gameState.gs.currentLevel = 1;
            EventBus.dispatch("showMenu");
        }
        
    }
    GameLevelController.prototype.hideLevel = function () {
        $("#dialog-utility").hide();
        //$( "#dialog-utility" ).dialog("close");
    }
    GameLevelController.prototype.setLevel = function(label){
        this.config.gameState.gs.currentLevel=label.id;
        EventBus.dispatch("hideLevel");
        EventBus.dispatch("newGame");
        $("#myCanvas").show();


    }

    var createDialog = function(){
        $( "#dialog-utility" ).dialog({
                dialogClass: "no-close-utility",
                modal: true,
                closeOnEscape: true,
                width:window.innerWidth-150,
                height:window.innerHeight-100

        });
    }
    var createBackground = function(me){
        var container = new createjs.Container();
        var bitmap = new createjs.Bitmap(me.config.loader.getResult("level"));
        bitmap.scaleX = 0.5;
        bitmap.scaleY = 0.5;
        container.addChild(bitmap);
        container.setTransform(0,0,me.scaleFactorX,me.scaleFactorY);
        me.config.stage.addChild(container);
    };
    var levelText = function (me) {
        var levelLabel = me.config.gameState.gs.currentLevel;
        document.getElementById('levelButton').value = 'Level '+ (levelLabel);
    }
}