declare var EventBus: any;

declare class LocalStorage { 
    constructor(config?:any);
    getFromStore(): any;
    saveToStore(obj: any);
}

declare class GameState {
    constructor(config?: any);
}

declare class SmbLoadQueue {
    constructor(config?: any);
}

declare class ShopController {
    constructor(config?: any);
}

declare class Spawning {
    constructor(config?: any);
	onEnemyKilled(a: any);
	onPowerupSpawned();
}

declare class AdBoard extends createjs.Container {
    constructor(config?: any);
}

declare class Blocks {
    constructor(config?: any);
	drawLeftChairBlock();
	drawRightChairBlock();
}

declare class CommentaryBox extends createjs.Container {
    constructor(config?: any);
	getTransformedBounds(): any;
}

declare class Gem {
    constructor(config?: any);
}

declare class Waves {
    constructor(config?: any);
	clearAll();
	getPendingEnemies(): any;
	getStatus(): any;
	init();
	update(a: any, b: any, c: any);
}

declare class Lane extends createjs.Container {
    constructor(config?: any);
	getMaxCaptchaWidth(): number;
	getHeight(): number;
	getCaptchaX(): number;

}

declare class MyBag {
    constructor(config?: any);
    persist();
}

declare class Level {
    constructor(config?: any);
}

declare class Score {
    constructor(config?: any);
	getMyMoney();
	getMoneyForLevel(s: any);
	getTotalScore();
	addGameLevelPoints(a: any);
}

declare class closestWord {
    match: any;
    closestOcr: any;
    constructor(a: any, b: any);
}

interface JQuery {
    selectmenu(options: any);
    leanSlider(options: any);
}

declare var sprites: any;