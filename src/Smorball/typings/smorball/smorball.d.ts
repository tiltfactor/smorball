/// <reference path="../../scripts/controller/gamecontroller.ts" />
/// <reference path="../../scripts/model/gamestate.ts" />
/// <reference path="../tsd.d.ts" />
/// <reference path="../../scripts/model/adboard.ts" />
/// <reference path="../../scripts/model/captchaprocessor.ts" />
/// <reference path="../../scripts/model/commentarybox.ts" />
/// <reference path="../../scripts/model/enemy.ts" />
/// <reference path="../../scripts/model/gamestate.ts" />
/// <reference path="../../scripts/model/loaderclass.ts" />
/// <reference path="../../scripts/model/mybag.ts" />
/// <reference path="../../scripts/model/mypowerup.ts" />
/// <reference path="../../scripts/model/preloader.ts" />
/// <reference path="../../scripts/model/smbloadqueue.ts" />
/// <reference path="../../scripts/model/sound.ts" />
/// <reference path="../../scripts/model/spritesheet.ts" />
/// <reference path="../../scripts/model/wave.ts" />
/// <reference path="../../scripts/model/waves.ts" />
/// <reference path="../../scripts/data/enemydata.ts" />
/// <reference path="../../scripts/data/instructionsdata.ts" />
/// <reference path="../../scripts/data/leveldata.ts" />
/// <reference path="../../scripts/data/loaderdata.ts" />
/// <reference path="../../scripts/controller/gamecontroller.ts" />
/// <reference path="../../scripts/controller/gamelevelcontroller.ts" />
/// <reference path="../../scripts/controller/menucontroller.ts" />
/// <reference path="../../scripts/controller/soundcontroller.ts" />
/// <reference path="../../scripts/controller/stagecontroller.ts" />
/// <reference path="../../scripts/model/playerathlete.ts" />
/// <reference path="../../scripts/controller/shopcontroller.ts" />
/// <reference path="../../scripts/data/manifest.ts" />
/// <reference path="../../scripts/data/mapdata.ts" />
/// <reference path="../../scripts/data/playerdata.ts" />
/// <reference path="../../scripts/data/powerupsdata.ts" />
/// <reference path="../../scripts/data/shopdata.ts" />
/// <reference path="../../scripts/data/captchajson.ts" />
/// <reference path="../../scripts/data/gameconfig.ts" />
/// <reference path="../../scripts/model/lane.ts" />

declare var EventBus: any;

declare var smorball: GameController;

declare class LocalStorage { 
    constructor(config?:any);
    getFromStore(): any;
    saveToStore(obj: any);
}

declare class Spawning {
    constructor(config?: any);
	onEnemyKilled(a: any);
	onPowerupSpawned();
}

declare class Blocks {
    constructor(config?: any);
	drawLeftChairBlock();
	drawRightChairBlock();
}

declare class Gem {
    constructor(config?: any);
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
	mCustomScrollbar(options: any);
}

declare var sprites: any;

interface SmorballConfig {
	stage?: createjs.Stage;
	gameState?: GameState;
	store?: any;

}