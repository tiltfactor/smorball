function MenuController(config) {
    this.config = config || {};
    MenuController.prototype.init = function(){
        createDialog(this);
        loadEvents(this);
        $("#resumeButton").hide();
    }

    var loadEvents = function (me) {
        EventBus.addEventListener("exitMenu", me.hideMenu);
        var sm = function(){me.showMenu(me)};
        EventBus.addEventListener("showMenu",sm);

        var sm = function(){me.showTimeout(me)};
        EventBus.addEventListener("showTimeout",sm);
        
        var qt = function(){me.quitTimeout(me)};
        EventBus.addEventListener("quitTimeout",qt);
    }

    MenuController.prototype.showMenu = function (me) {
        checkStatus(me);
        $("#canvasHolder").hide();
        me.config.gameState.currentState = me.config.gameState.states.MAIN_MENU;
        $("#menu-container" ).css("display","table");
    } 
    MenuController.prototype.hideMenu = function () {
        $( "#menu-container" ).css("display","none");
    }

    MenuController.prototype.showTimeout = function (me) {
        checkStatus(me);
        me.config.gameState.currentState = me.config.gameState.states.MAIN_MENU;
        $("#timeout-container" ).css("display","table");
        EventBus.dispatch("pauseAllSound");
    } 
    
    MenuController.prototype.quitTimeout = function (me) {
        $("#timeout-container" ).css("display","none");
        me.config.gameState.currentState = me.config.gameState.states.GAME_OVER;
        EventBus.dispatch("showMap");
    }
    
    var closeTimeoutDialog =  function() {
         EventBus.dispatch("resumeGame");
         EventBus.dispatch("setMute");
    };

    var createDialog = function(me){
          $("#menu-container" ).css("display","table");
            $("#music-slider").slider({
                value: me.config.gameState.config.store.music,
                range: "min",
                slide: function( event, ui ) {
                    me.config.gameState.gs.music = ui.value;
                    EventBus.dispatch("saveToStore");
                    EventBus.dispatch("changeSoundVolume",me.config.gameState.soundType.MAIN);
                }
            });
            
            $("#effects-slider").slider({
                value: me.config.gameState.config.store.soundEffects,
                range: "min",
                slide: function( event, ui ) {
                    me.config.gameState.gs.soundEffects = ui.value;
                    EventBus.dispatch("saveToStore");
                    EventBus.dispatch("changeSoundVolume",me.config.gameState.soundType.EFFECTS);
                }
            });              
    }
    var checkStatus = function(me){
        var state = me.config.gameState.states;
        switch(me.config.gameState.currentState){
            case state.MAIN_MENU:{break;}
            case state.RUN:{$("#resumeButton").show();break;}
            case state.GAME_OVER: {$("#resumeButton").hide();break;}
            case state.SHOP:break;
        }
    }
}