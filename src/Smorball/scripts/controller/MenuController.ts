/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../data/instructionsdata.ts" />

class MenuController {

    config: any;

    constructor(config: any) {
        this.config = config;
    }

    init() {
        this.createDialog();
        this.loadEvents();
        $("#resumeButton").hide();
    }

    private loadEvents() {
        EventBus.addEventListener("exitMenu", () => this.hideMenu() );
        EventBus.addEventListener("showMenu", () => this.showMenu());
        EventBus.addEventListener("play", () => this.play());
        EventBus.addEventListener("showTimeout", () => this.showTimeout());
        EventBus.addEventListener("quitTimeout", () => this.quitTimeout());
        EventBus.addEventListener("showHelp", () => this.showHelp());
        EventBus.addEventListener("hideHelp", () => this.hideHelp());
        EventBus.addEventListener("showOptions", () => this.showOptions());
        EventBus.addEventListener("hideOptions", () => this.hideOptions());
        EventBus.addEventListener("setDifficulty", e => this.setDifficulty(e.target));
    }

    private onMenuResize() {
        var width = window.innerHeight * 4 / 3 > window.innerWidth ? window.innerWidth : window.innerHeight * 4 / 3;
        var height = width * 3 / 4 > window.innerHeight ? window.innerHeight : width * 3 / 4;
        var paddingTop = (window.innerHeight - height) / 2 > 0 ? (window.innerHeight - height) / 2 : 0;
        $("#menu-container").css({ height: height, width: width, top: paddingTop });
        $(".selectDifficulty").selectmenu("close");
    }

    showMenu() {
        this.checkStatus();
        $("#canvasHolder").hide();
        this.config.gameState.currentState = this.config.gameState.states.MAIN_MENU;
        this.onMenuResize()
        window.onresize = () => {
            this.onMenuResize();
        };
        $("#menu-container").css("display", "block");
    }

    play() {
        if (this.config.gameState.gs.maxLevel > 1) {
            $('#menu-confirm-popup').css('display', 'table');
            $('#game-popup').show();
        }
        else {
            EventBus.dispatch("exitMenu");
            EventBus.dispatch("resetAll");
        }
    }

    showHelp() {
        $("#helpScreen").css("display", "table");
    }

    hideHelp() {
        $("#helpScreen").css("display", "none");
    }

    showOptions() {
        this.checkDifficulty();
        $("#optionsScreen").css("display", "table");
        this.setSliderValue();
    }

    private createDialog() {
        $("#menu-container").css("display", "block");
        $(".selectDifficulty").selectmenu({
            appendTo: "#selectBox",
            width: '70%',
            change: (event, ui) => {
                EventBus.dispatch('setDifficulty', ui.item.value);
            }
        });
        this.setInstructionScreen();
        this.setSliderValue();
    }
    
    private setInstructionScreen() {
        var template = $("#sliderComponents").html();
        var compile = _.template(template);
        $("#slider").append(compile({ items: sliderData }));
        $('#slider').leanSlider({
            directionNav: '#sliderDirectionNav',
            controlNav: '#slider-control-nav'
        });
    }

    private setSliderValue() {
        $(".music-slider").slider({
            value: this.config.gameState.config.store.music = this.config.gameState.config.store.music == undefined ? this.config.gameState.gs.music : this.config.gameState.config.store.music,
            range: "min",
            slide: (event, ui) => {
                this.config.gameState.gs.music = ui.value;
                this.config.gameState.config.store.music = ui.value;
                EventBus.dispatch("saveToStore");
                EventBus.dispatch("changeSoundVolume", this.config.gameState.soundType.MAIN);
            }
        });

        $(".effects-slider").slider({
            value: this.config.gameState.config.store.soundEffects = this.config.gameState.config.store.soundEffects == undefined ? this.config.gameState.gs.soundEffects : this.config.gameState.config.store.soundEffects,
            range: "min",
            slide: (event, ui) => {
                this.config.gameState.gs.soundEffects = ui.value;
                this.config.gameState.config.store.soundEffects = ui.value;
                EventBus.dispatch("saveToStore");
                this.config.gameState.gs.soundEffects = this.config.gameState.config.store.soundEffects;
                EventBus.dispatch("changeSoundVolume", this.config.gameState.soundType.EFFECTS);
            }
        });
    }

    hideOptions() {
        this.checkDifficulty();
        EventBus.dispatch("hideAll");
        EventBus.dispatch("showMenu");
    }

    hideMenu() {
        $("#menu-container").css("display", "none");
    }

    showTimeout() {
        $("#inputText").blur();
        this.checkStatus();
        $("#timeout-container").css("display", "table");
        this.setSliderValue();
        EventBus.dispatch("pauseAllSound");


    }

    quitTimeout() {
        $("#timeout-container").css("display", "none");
        this.config.gameState.currentState = this.config.gameState.states.GAME_OVER;
        EventBus.dispatch("clearAllWaves");
        EventBus.dispatch("showMap");
    }

    private closeTimeoutDialog() {
        EventBus.dispatch("setMute");
        EventBus.dispatch("resumeGame");
    }

    private checkStatus() {
        var state = this.config.gameState.states;
        switch (this.config.gameState.currentState) {
            case state.MAIN_MENU: { break; }
            case state.RUN: { ; break; }
            case state.GAME_OVER: { break; }
            case state.SHOP: break;
        }
    }

    private setDifficulty(value) {
        switch (value) {
            case "veryeasy": this.config.gameState.gs.difficulty = 2.33; break;
            case "easy": this.config.gameState.gs.difficulty = 2; break;
            case "medium": this.config.gameState.gs.difficulty = 1.67; break;
            case "hard": this.config.gameState.gs.difficulty = 1.33; break;
            case "veryhard": this.config.gameState.gs.difficulty = 1; break;
        }
    }
    
    private checkDifficulty(){
        var difficulty = this.config.gameState.gs.difficulty;
        switch (difficulty) {
            case 2.33: $(".selectDifficulty option:eq(0)").attr('selected', 'selected'); break;
            case 2: $(".selectDifficulty option:eq(1)").attr('selected', 'selected'); break;
            case 1.67: $(".selectDifficulty option:eq(2)").attr('selected', 'selected'); break;
            case 1.33: $(".selectDifficulty option:eq(3)").attr('selected', 'selected'); break;
            case 1: $(".selectDifficulty option:eq(4)").attr('selected', 'selected'); break;
        }
    }
}

