/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />

interface GamestateGS {
	maxLevel?: number;
	gameLevelPoints?: any;
	music?: number;
	soundEffects?: number;
	dollorSpend?: number;
	sponserShips?: any;
	knockBack?: number;
	extraDamage?: number;
	penalty?: number;
	difficulty?: number;
	highScore?: any;
}

class GameState
{
	config: SmorballConfig;
	totalLevels: number;
	maxLife: number;
	audioList: any[];
	captchaDatasArray: any[];
	states: any;
	currentState: number;
	soundType: any;
	map: boolean;
	level: boolean;
	cleatsUnlockLevel: number;
	helmetUnlockLevel: number;
	bullhornUnlockLevel: number;
	survivalLevel: number;
	inputTextArr: any[];
	currentLevel: number;

	gs: GamestateGS;

	constructor(config: SmorballConfig) {
		this.gs = {};
		this.config = config;
	}

	init() {
        this.totalLevels = 16;
        this.maxLife = 6;
        this.audioList = [];
        this.captchaDatasArray = [localData];
        this.currentState;
        this.states = {
            MAIN_MENU: 0, RUN: 1, SHOP: 2, GAME_OVER: 3
        }
        this.currentState = this.states.MAIN_MENU; // todo: have to remove
        this.soundType = {
            MAIN: 0, EFFECTS: 1
        };
        this.map = false;
        this.level = false;
        this.cleatsUnlockLevel = 4;
        this.helmetUnlockLevel = 6;
        this.bullhornUnlockLevel = 12;
        this.survivalLevel = 0;
        this.inputTextArr = [];
        this.currentLevel = 1;
        this.getFromStore();
        this.setFromStore();

    }

    reset() {
        this.currentLevel = 1;
        this.getFromStore();
        var music = this.config.store.music;
        var se = this.config.store.soundEffects;
        var difficulty = this.config.store.difficulty;
        this.config.store = {};
        this.config.store.music = music;
        this.config.store.soundEffects = se;
        this.config.store.difficulty = difficulty;
        this.setFromStore();
    }

	private setFromStore() {
		this.gs.maxLevel = this.config.store.maxLevel || 1;
		this.gs.gameLevelPoints = this.config.store.gameLevelPoints || [];
		this.gs.music = this.config.store.music == undefined ? 50 : this.config.store.music;
		this.gs.soundEffects = this.config.store.soundEffects == undefined ? 50 : this.config.store.soundEffects;
		this.gs.dollorSpend = this.config.store.dollorSpend || 0;
		this.gs.sponserShips = this.config.store.sponserShips || [];
		this.gs.knockBack = this.config.store.knockBack || 0.1;
		this.gs.extraDamage = this.config.store.extraDamage || 1;
		this.gs.penalty = this.config.store.penalty || 2000;
		this.gs.difficulty = this.config.store.difficulty || 1.67;
		this.gs.highScore = this.config.store.highScore || { "min": 0, "sec": 0 };
	}

	private getFromStore() {
		var myStorage = new LocalStorage();
		var data = myStorage.getFromStore();
		this.config.store = data.gameState || {};
	}

	persist() {
		return this.gs;
	}

}
