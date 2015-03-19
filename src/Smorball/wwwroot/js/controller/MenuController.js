/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../data/instructionsdata.ts" />
var MenuController = (function () {
    function MenuController(config) {
        this.config = config;
    }
    MenuController.prototype.init = function () {
        this.createDialog();
        this.loadEvents();
        $("#resumeButton").hide();
    };
    MenuController.prototype.loadEvents = function () {
        var _this = this;
        EventBus.addEventListener("exitMenu", function () { return _this.hideMenu(); });
        EventBus.addEventListener("showMenu", function () { return _this.showMenu(); });
        EventBus.addEventListener("play", function () { return _this.play(); });
        EventBus.addEventListener("showTimeout", function () { return _this.showTimeout(); });
        EventBus.addEventListener("quitTimeout", function () { return _this.quitTimeout(); });
        EventBus.addEventListener("showHelp", function () { return _this.showHelp(); });
        EventBus.addEventListener("hideHelp", function () { return _this.hideHelp(); });
        EventBus.addEventListener("showOptions", function () { return _this.showOptions(); });
        EventBus.addEventListener("hideOptions", function () { return _this.hideOptions(); });
        EventBus.addEventListener("setDifficulty", function (e) { return _this.setDifficulty(e.target); });
    };
    MenuController.prototype.onMenuResize = function () {
        var width = window.innerHeight * 4 / 3 > window.innerWidth ? window.innerWidth : window.innerHeight * 4 / 3;
        var height = width * 3 / 4 > window.innerHeight ? window.innerHeight : width * 3 / 4;
        var paddingTop = (window.innerHeight - height) / 2 > 0 ? (window.innerHeight - height) / 2 : 0;
        $("#menu-container").css({ height: height, width: width, top: paddingTop });
        $(".selectDifficulty").selectmenu("close");
    };
    MenuController.prototype.showMenu = function () {
        var _this = this;
        this.checkStatus();
        $("#canvasHolder").hide();
        this.config.gameState.currentState = this.config.gameState.states.MAIN_MENU;
        this.onMenuResize();
        window.onresize = function () {
            _this.onMenuResize();
        };
        $("#menu-container").css("display", "block");
    };
    MenuController.prototype.play = function () {
        if (this.config.gameState.gs.maxLevel > 1) {
            $('#menu-confirm-popup').css('display', 'table');
            $('#game-popup').show();
        }
        else {
            EventBus.dispatch("exitMenu");
            EventBus.dispatch("resetAll");
        }
    };
    MenuController.prototype.showHelp = function () {
        $("#helpScreen").css("display", "table");
    };
    MenuController.prototype.hideHelp = function () {
        $("#helpScreen").css("display", "none");
    };
    MenuController.prototype.showOptions = function () {
        this.checkDifficulty();
        $("#optionsScreen").css("display", "table");
        this.setSliderValue();
    };
    MenuController.prototype.createDialog = function () {
        $("#menu-container").css("display", "block");
        $(".selectDifficulty").selectmenu({
            appendTo: "#selectBox",
            width: '70%',
            change: function (event, ui) {
                EventBus.dispatch('setDifficulty', ui.item.value);
            }
        });
        this.setInstructionScreen();
        this.setSliderValue();
    };
    MenuController.prototype.setInstructionScreen = function () {
        var template = $("#sliderComponents").html();
        var compile = _.template(template);
        $("#slider").append(compile({ items: sliderData }));
        $('#slider').leanSlider({
            directionNav: '#sliderDirectionNav',
            controlNav: '#slider-control-nav'
        });
    };
    MenuController.prototype.setSliderValue = function () {
        var _this = this;
        $(".music-slider").slider({
            value: this.config.gameState.config.store.music = this.config.gameState.config.store.music == undefined ? this.config.gameState.gs.music : this.config.gameState.config.store.music,
            range: "min",
            slide: function (event, ui) {
                _this.config.gameState.gs.music = ui.value;
                _this.config.gameState.config.store.music = ui.value;
                EventBus.dispatch("saveToStore");
                EventBus.dispatch("changeSoundVolume", _this.config.gameState.soundType.MAIN);
            }
        });
        $(".effects-slider").slider({
            value: this.config.gameState.config.store.soundEffects = this.config.gameState.config.store.soundEffects == undefined ? this.config.gameState.gs.soundEffects : this.config.gameState.config.store.soundEffects,
            range: "min",
            slide: function (event, ui) {
                _this.config.gameState.gs.soundEffects = ui.value;
                _this.config.gameState.config.store.soundEffects = ui.value;
                EventBus.dispatch("saveToStore");
                _this.config.gameState.gs.soundEffects = _this.config.gameState.config.store.soundEffects;
                EventBus.dispatch("changeSoundVolume", _this.config.gameState.soundType.EFFECTS);
            }
        });
    };
    MenuController.prototype.hideOptions = function () {
        this.checkDifficulty();
        EventBus.dispatch("hideAll");
        EventBus.dispatch("showMenu");
    };
    MenuController.prototype.hideMenu = function () {
        $("#menu-container").css("display", "none");
    };
    MenuController.prototype.showTimeout = function () {
        $("#inputText").blur();
        this.checkStatus();
        $("#timeout-container").css("display", "table");
        this.setSliderValue();
        EventBus.dispatch("pauseAllSound");
    };
    MenuController.prototype.quitTimeout = function () {
        $("#timeout-container").css("display", "none");
        this.config.gameState.currentState = this.config.gameState.states.GAME_OVER;
        EventBus.dispatch("clearAllWaves");
        EventBus.dispatch("showMap");
    };
    MenuController.prototype.closeTimeoutDialog = function () {
        EventBus.dispatch("setMute");
        EventBus.dispatch("resumeGame");
    };
    MenuController.prototype.checkStatus = function () {
        var state = this.config.gameState.states;
        switch (this.config.gameState.currentState) {
            case state.MAIN_MENU: {
                break;
            }
            case state.RUN: {
                ;
                break;
            }
            case state.GAME_OVER: {
                break;
            }
            case state.SHOP: break;
        }
    };
    MenuController.prototype.setDifficulty = function (value) {
        switch (value) {
            case "veryeasy":
                this.config.gameState.gs.difficulty = 2.33;
                break;
            case "easy":
                this.config.gameState.gs.difficulty = 2;
                break;
            case "medium":
                this.config.gameState.gs.difficulty = 1.67;
                break;
            case "hard":
                this.config.gameState.gs.difficulty = 1.33;
                break;
            case "veryhard":
                this.config.gameState.gs.difficulty = 1;
                break;
        }
    };
    MenuController.prototype.checkDifficulty = function () {
        var difficulty = this.config.gameState.gs.difficulty;
        switch (difficulty) {
            case 2.33:
                $(".selectDifficulty option:eq(0)").attr('selected', 'selected');
                break;
            case 2:
                $(".selectDifficulty option:eq(1)").attr('selected', 'selected');
                break;
            case 1.67:
                $(".selectDifficulty option:eq(2)").attr('selected', 'selected');
                break;
            case 1.33:
                $(".selectDifficulty option:eq(3)").attr('selected', 'selected');
                break;
            case 1:
                $(".selectDifficulty option:eq(4)").attr('selected', 'selected');
                break;
        }
    };
    return MenuController;
})();
