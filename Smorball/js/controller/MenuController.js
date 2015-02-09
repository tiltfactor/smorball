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
        $( "#timeout-popup" ).dialog("open");
        EventBus.dispatch("pauseAllSound");
    }   
    
    var closeTimeoutDialog =  function() {
         EventBus.dispatch("resumeGame");
    };

    var createDialog = function(me){
          $("#menu-container" ).css("display","table");
            $( "#timeout-popup" ).dialog({
                dialogClass: "timeout-popup-box",
                modal: true,
                closeOnEscape: false,
                autoOpen: false,
                close: closeTimeoutDialog,
                open: function () {
                    $(this).dialog('option', 'position', 'center');
                },
                buttons: [
                    {
                        text: "HELP",
                        click: function() {
                            //show help screen
                        }
                    },
                    {
                        text: "QUIT",
                        click: function() {
                            $(this).dialog( "close" );
                            EventBus.dispatch("setTickerStatus");
                            EventBus.dispatch("showMap");
                        }
                    }
                ]
            });
  
            $("#music-slider").slider({
                value: me.config.gameState.gs.music,
                range: "min",
                slide: function( event, ui ) {
                    me.config.gameState.gs.music = ui.value;
                    EventBus.dispatch("changeSoundVolume",me.config.gameState.soundType.MAIN);
                }
            });
            
            $("#effects-slider").slider({
                value: me.config.gameState.gs.soundEffects,
                range: "min",
                slide: function( event, ui ) {
                    me.config.gameState.gs.soundEffects = ui.value;
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