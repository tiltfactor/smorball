(function () {
    var GameState = function(config){
        this.config = config || {};
        this.config.store = config.store || {};
    }
    GameState.prototype.init = function(){
        this.gs = {};
        gms = this;
        this.totalLevels = 16;
        this.maxLife = 6;
        this.audioList = [];
        this.captchaDatasArray = [localData];
        this.currentState;
        this.states = {
            MAIN_MENU:0,RUN:1,SHOP:2,GAME_OVER :3
        }
        this.currentState = this.states.MAIN_MENU; // todo: have to remove
        this.soundType = {
            MAIN : 0, EFFECTS : 1
        };
        this.map = false;
        this.level = false;
        this.cleatsUnlockLevel = 4;
        this.helmetUnlockLevel = 6;
        this.bullhornUnlockLevel = 12;
        this.survivalLevel = 0;
        this.inputTextArr = [];
        this.currentLevel = 1;
        getFromStore(this);
        setFromStore(this);

    }

    GameState.prototype.reset = function(){
        this.currentLevel = 1;
        getFromStore(this);
        var music = this.config.store.music;
        var se = this.config.store.soundEffects;
        var difficulty = this.config.store.difficulty;
        this.config.store = {};
        this.config.store.music = music;
        this.config.store.soundEffects = se;
        this.config.store.difficulty = difficulty;
        setFromStore(this);
    }

    var setFromStore = function(me){
        me.gs.maxLevel = me.config.store.maxLevel || 1;
        me.gs.gameLevelPoints = me.config.store.gameLevelPoints || [];
        me.gs.music = me.config.store.music == undefined ? 50 : me.config.store.music;
        me.gs.soundEffects = me.config.store.soundEffects == undefined ? 50 : me.config.store.soundEffects;
        me.gs.dollorSpend = me.config.store.dollorSpend || 0;
        me.gs.sponserShips = me.config.store.sponserShips || [];
        me.gs.knockBack = me.config.store.knockBack||0.1;
        me.gs.extraDamage = me.config.store.extraDamage||1;
        me.gs.penalty = me.config.store.penalty||2000;
        me.gs.difficulty = me.config.store.difficulty || 1.67;
        me.gs.highScore = me.config.store.highScore ||{"min":0,"sec":0};
    }

    var getFromStore = function(me){
        var myStorage = new LocalStorage();
        var data = myStorage.getFromStore();
        me.config.store = data.gameState || {};
    }

    GameState.prototype.persist = function(){
        var data = this.gs;
        return data;
    }
    window.GameState = GameState;
}());
