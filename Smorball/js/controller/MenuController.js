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
        
        var pl = function(){me.play(me)};
        EventBus.addEventListener("play",pl);

        var st = function(){me.showTimeout(me)};
        EventBus.addEventListener("showTimeout",st);
        
        var qt = function(){me.quitTimeout(me)};
        EventBus.addEventListener("quitTimeout",qt);
        
        var sh = function(){me.showHelp(me)};
        EventBus.addEventListener("showHelp",sh);
        
        var hh = function(){me.hideHelp(me)};
        EventBus.addEventListener("hideHelp",hh);
        
        var so = function(){me.showOptions(me)};
        EventBus.addEventListener("showOptions",so);
        
        var ho = function(){me.hideOptions(me)};
        EventBus.addEventListener("hideOptions",ho);

        var sd = function(e){setDifficulty(me, e.target)};
        EventBus.addEventListener("setDifficulty",sd);

    }
    
    MenuController.prototype.showMenu = function (me) {
        checkStatus(me);
        $("#canvasHolder").hide();
        me.config.gameState.currentState = me.config.gameState.states.MAIN_MENU;
        $("#menu-container" ).css("display","block");
    } 
   
    MenuController.prototype.play = function (me) {
        if(me.config.gameState.currentLevel > 1){
            $('#menu-confirm-popup').css('display','table');
            $('#game-popup').show();
        }
        else{
            EventBus.dispatch("exitMenu");
            EventBus.dispatch("resetAll");
        }
    }

    MenuController.prototype.showHelp = function () {
        $("#helpScreen" ).css("display","table");
    }
    
    MenuController.prototype.hideHelp = function () {
       $("#helpScreen" ).css("display", "none");
    }
    
    MenuController.prototype.showOptions = function () {
        checkDifficulty(this);
        $(".mainWrapper").css("display", "none");
        $("#optionsScreen" ).css("display","table");
        setSliderValue(this);
    }
    var createDialog = function(me){
        $("#menu-container" ).css("display","block");
        setSliderValue(me);
    }
    var setSliderValue = function(me){
        $(".music-slider").slider({
            value: me.config.gameState.config.store.music = me.config.gameState.config.store.music == undefined ? 50 : me.config.gameState.config.store.music,
            range: "min",
            slide: function( event, ui ) {
                me.config.gameState.gs.music = ui.value;
                me.config.gameState.config.store.music = ui.value;
                EventBus.dispatch("saveToStore");
                EventBus.dispatch("changeSoundVolume",me.config.gameState.soundType.MAIN);
            }
        });

        $(".effects-slider").slider({
            value: me.config.gameState.config.store.soundEffects = me.config.gameState.config.store.soundEffects == undefined ? 50 : me.config.gameState.config.store.soundEffects,
            range: "min",
            slide: function( event, ui ) {
                me.config.gameState.gs.soundEffects = ui.value;
                me.config.gameState.config.store.soundEffects = ui.value;
                EventBus.dispatch("saveToStore");
                me.config.gameState.gs.soundEffects = me.config.gameState.config.store.soundEffects;
                EventBus.dispatch("changeSoundVolume",me.config.gameState.soundType.EFFECTS);
            }
        });
    }
    MenuController.prototype.hideOptions = function () {
        checkDifficulty(this);
        $(".mainWrapper").css("display", "none");
        $( "#menu-container" ).css("display","table");
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
        EventBus.dispatch("clearAllWaves");
        EventBus.dispatch("showMap");
    }
    
    var closeTimeoutDialog =  function() {
        EventBus.dispatch("setMute");
        EventBus.dispatch("resumeGame");
    };
    var checkStatus = function(me){
        var state = me.config.gameState.states;
        switch(me.config.gameState.currentState){
            case state.MAIN_MENU:{break;}
            case state.RUN:{$("#resumeButton").show();break;}
            case state.GAME_OVER: {$("#resumeButton").hide();break;}
            case state.SHOP:break;
        }
    };
    var setDifficulty = function(me,value){
        switch(value){
            case "veryeasy": me.config.gameState.gs.difficulty = 2.33;break;
            case "easy": me.config.gameState.gs.difficulty = 2;break;
            case "medium": me.config.gameState.gs.difficulty = 1.67;break;
            case "hard": me.config.gameState.gs.difficulty = 1.33;break;
            case  "veryhard": me.config.gameState.gs.difficulty = 1;break;
        }
    }
    var checkDifficulty = function(me){
        var difficulty = me.config.gameState.gs.difficulty;
        switch (difficulty){
            case 2.33 :$(".selectDifficulty option:eq(0)").attr('selected', 'selected');break;
            case 2 : $(".selectDifficulty option:eq(1)").attr('selected', 'selected');break;
            case 1.67 : $(".selectDifficulty option:eq(2)").attr('selected', 'selected');break;
            case 1.33 : $(".selectDifficulty option:eq(3)").attr('selected', 'selected');break;
            case 1 : $(".selectDifficulty option:eq(4)").attr('selected', 'selected');break;
        }
    }
}