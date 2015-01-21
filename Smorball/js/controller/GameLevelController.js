/**
 * Created by user on 9/12/14.
 */
function GameLevelController(config){
    this.config = config;

     GameLevelController.prototype.init = function(){
        this.config.stage = new createjs.Stage("loaderCanvas");
        createDialog();
        loadEvents(this);
        EventBus.dispatch("hideLevel");
        var levelLabel = this.config.gameState.gs.currentLevel;
        document.getElementById('levelButton').value = 'Level '+ (levelLabel);        
        
    }
    var loadEvents = function (me) { 
        var sl = function(){me.showLevel()};
        EventBus.addEventListener("showLevel",sl);
        var el = function(){me.hideLevel()}
        EventBus.addEventListener("hideLevel", el);
    }
    GameLevelController.prototype.showLevel = function () {
        if(this.config.gameState.gs.currentLevel<=7){
            levelText(this);
            $( "#dialog-level" ).dialog("open");
        }
        else{
            this.config.gameState.gs.currentLevel = 1;
            EventBus.dispatch("showMenu");
        }
        
    }
    GameLevelController.prototype.hideLevel = function () {
        $( "#dialog-level" ).dialog("close");
    }

    var createDialog = function(){
        $( "#dialog-level" ).dialog({
                dialogClass: "no-close-level",
                modal: true,
                closeOnEscape: true
        });
    }
    var levelText = function (me) {
        var levelLabel = me.config.gameState.gs.currentLevel;
        document.getElementById('levelButton').value = 'Level '+ (levelLabel);
    }
}