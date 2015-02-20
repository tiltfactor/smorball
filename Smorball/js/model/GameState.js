(function () {
    var GameState = function(config){
        this.config = config || {};
        this.config.store = config.store || {};
    }
    GameState.prototype.init = function(){
        this.gs = {};
        this.totalLevels = 16;
        this.maxLife = 6;
        //this.life;
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
        this.helmetUnlockLevel = 5;
        this.bullhornUnlockLevel = 7;

        //this.snike = false;
        //this.brawlin = false;
        //this.loudMouth = false;

        this.reset();


        //this.gs.inBag = this.config.inBag || [];


    }

    GameState.prototype.reset = function(){
        this.currentLevel = 1;
        getFromStore(this);
        setFromStore(this);
    }

    var setFromStore = function(me){
        me.gs.maxLevel = me.config.store.maxLevel || 1;
        me.gs.gameLevelPoints = me.config.store.gameLevelPoints || [];
        me.gs.music = me.config.store.music || 50;
        me.gs.soundEffects = me.config.store.soundEffects || 50;
        me.gs.dollorSpend = me.config.store.dollorSpend || 0;
        me.gs.sponserShips = me.config.store.sponserShips || [];
        me.gs.knockBack = me.config.store.knockBack||0.1;
        me.gs.extraDamage = me.config.store.extraDamage||1;
        me.gs.penalty = me.config.store.penalty||2000;
        me.gs.difficulty = me.config.store.difficulty || 1;
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

//function GameState(config){
//    this.config = config || {};
//
//    GameState.prototype.init = function(json){
//        gst = this;
//        this.json = json || {}
//        this.gs = {};
//
//        this.totalLevels = 18;
//        this.maxLife = 6;
//        this.captchaDatasArray = [localData];
//
//        this.gs.States = {
//            MAIN_MENU:0,RUN:1,SHOP:2,GAME_OVER :3
//        }
//        this.gs.currentState = this.gs.States.MAIN_MENU;
//
//        this.gs.currentLevel = this.json.currentLevel || 1;
//        this.gs.maxLevel = this.json.maxLevel || 1;
//        this.gs.life = this.json.life || 6;
//        this.gs.maxLife = 6;
//        this.gs.points = this.json.points || 0;
//        this.gs.gameLevelPoints = this.json.gameLevelPoints || [];
//        this.gs.level = this.json.level || 1;
//        this.gs.lane = this.json.lane || 1;
//
//        this.gs.bag = this.json.bag;
//        this.gs.products = this.json.products || [];
//
//        this.gs.gems = this.json.gems || [];
//        this.gs.players = this.json.players || []; //not much idea
//        this.gs.enemies = this.json.enemies || []; //not sure
//        this.gs.music = this.json.music || 50;
//        this.gs.soundEffects = this.json.soundEffects || 50;
//        this.gs.inBag = this.json.inBag || [];
//        this.gs.soundType = {
//            MAIN : 0, EFFECTS : 1
//        };
//    }
//
//
//
//}