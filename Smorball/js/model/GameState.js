/**
 * Created by user on 5/12/14.
 */
function GameState(config){
    this.config = config || {};

    GameState.prototype.init = function(json){
        this.json = json || {}
        this.gs = {};

        this.totalLevels = 20;

        this.gs.currentLevel = this.json.currentLevel || 1;
        this.gs.life = this.json.life || 3;
        this.gs.points = this.json.points || 0;
        this.gs.level = this.json.level || 1;
        this.gs.lane = this.json.lane || 1;

        this.gs.bag = this.json.bag;
        this.gs.products = this.json.products || [];

        this.gs.gems = this.json.gems || [];
        this.gs.players = this.json.players || []; //not much idea
        this.gs.enemies = this.json.enemies || []; //not sure
    }



}