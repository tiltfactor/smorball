/// <reference path="wave.ts" />


//class Waves {

//	totalOpponents: number;
//	activeWaves: any[];
//	extraPowerups: any[];
//	currentIndex: number;
//	pushPositions: number;
//	complete: boolean;

//	constructor() {
//        this.activeWaves = [];
//        this.extraPowerups = [];
//        this.currentIndex = 0;
//        this.pushPositions = 0;
//        this.complete = false;
//        this.loadEvents();
//	}

//	init() {
//			this.totalOpponents = this.config.waves.enemySize;
//			this.start();
//		}
	
//	private loadEvents() {
//		EventBus.addEventListener("forcePush",(object) => this.forcePush(object.target));
//		EventBus.addEventListener("pushExtraPowerup",(type) => this.createExtraPowerup(type.target));
//		EventBus.addEventListener("pauseWaves",(ob) => this.pauseWaves(ob.target));
//		EventBus.addEventListener("clearAllWaves",() => this.clearAll());
//	}

//	getPendingEnemies() {
//		if (this.config.gameState.currentLevel == this.config.gameState.survivalLevel) {
//			return 0;
//		}
//		return --this.totalOpponents;
//	}

//	start() {
//		var data = JSON.parse(JSON.stringify(this.config.waves.data[this.currentIndex]));
//		var config = { "id": this.currentIndex, "lanesObj": this.config.lanesObj, data: data, "lanes": this.config.lanes, "loader": this.config.loader, "gameState": this.config.gameState };
//		var wave = new Wave(config);
//		this.currentIndex++;
//		this.activeWaves.push(wave);
//	}

//	private activateMultipleWaves() {
//		for (var i = 1; i < this.config.waves.activeWaves; i++) {
//			setTimeout(() => { this.start(); }, this.config.waves.time);
//		}
//	}

//	getStatus() {
//		return this.complete;
//	}

//	private getWaveFromId(waveId) {
//		for (var i = 0; i < this.activeWaves.length; i++) {
//			var wave = this.activeWaves[i];
//			if (wave.getId() == waveId) {
//				return wave
//			}
//		}
//		return null;
//	}

//	update(delta: number) {

//	}

//	updateWave(waveId, onKillPush, type) {
//		var wave = this.getWaveFromId(waveId);
//		if (type == "enemy") {
//			wave.killEnemy();
//		}
//		if (wave)
//			var status = wave.isComplete();

//		if (status) {
//			var index = this.activeWaves.indexOf(wave);
//			this.activeWaves.splice(index, 1);
//		} else {
//			if (onKillPush)
//				wave.push();
//		}

//		if (status) {
//			if (this.currentIndex < this.config.waves.data.length) {
//				this.start();
//			} else {
//				this.complete = true;
//			}
//		}

//	}

//	clearAll() {
//		for (var i = 0; i < this.activeWaves.length; i++) {
//			var wave = this.activeWaves.pop();
//			wave.clearAll();
//		}
//		this.currentIndex = 0;
//	}

//	private pauseWaves(flag) {
//		for (var i = 0; i < this.activeWaves.length; i++) {
//			var wave = this.activeWaves[i];
//			wave.paused(flag);
//		}
//	}

//	private forcePush(waveId) {
//		var wave = this.getWaveFromId(waveId);
//		if (wave != null && !wave.isComplete()) {
//			wave.forcePush();
//		}
//	}

//	private createExtraPowerup(type) {
//		var properties = {};
//		properties[0] = type;
//		properties[1] = Math.floor(Math.random() * this.config.lanes) + 1;
//		properties[2] = 0;
//		properties[3] = "";
//		if (this.activeWaves[0]) {
//			this.activeWaves[0].pushPowerUp(properties);
//		}


//	}

//}

