/**
 * Created by user on 5/12/14.
 */
function GameState(config){
    this.config = config || {};

    GameState.prototype.init = function(json){
        this.json = json || {}
        this.gs = {};

        this.totalLevels = 20;
        this.captchaDatasArray = [localData];

        this.gs.States = {
            MAIN_MENU:0,RUN:1,SHOP:2,GAME_OVER :3
        }
        this.gs.currentState = this.gs.States.MAIN_MENU;

        this.gs.currentLevel = this.json.currentLevel || 1;
        this.gs.life = this.json.life || 6;
        this.gs.points = this.json.points || 0;
        this.gs.gameLevelPoints = this.json.gameLevelPoints || [];
        this.gs.level = this.json.level || 1;
        this.gs.lane = this.json.lane || 1;

        this.gs.bag = this.json.bag;
        this.gs.products = this.json.products || [];

        this.gs.gems = this.json.gems || [];
        this.gs.players = this.json.players || []; //not much idea
        this.gs.enemies = this.json.enemies || []; //not sure
    }



}