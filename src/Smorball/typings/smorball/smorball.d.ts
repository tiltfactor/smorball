/// <reference path="../../scripts/managers/smorballmanager.ts" />
/// <reference path="../../scripts/managers/splashscreensmanager.ts" />
/// <reference path="../../scripts/managers/resourcesmanager.ts" />
/// <reference path="../tsd.d.ts" />
/// <reference path="../../scripts/main.ts" />
/// <reference path="../../scripts/config.ts" />
/// <reference path="../../scripts/actors/backgroundstar.ts" />
/// <reference path="../../scripts/utils/utils.ts" />
/// <reference path="../../scripts/managers/gamemanager.ts" />
/// <reference path="../../scripts/managers/audiomanager.ts" />
/// <reference path="../../scripts/managers/persistancemanager.ts" />
/// <reference path="../../scripts/actors/maplevel.ts" />
/// <reference path="../../scripts/actors/mapdot.ts" />
/// <reference path="../../scripts/screens/initialloadingscreen.ts" />
/// <reference path="../../scripts/actors/stadium.ts" />
/// <reference path="../../scripts/managers/screensmanager.ts" />
/// <reference path="../../scripts/screens/mainmenu.ts" />
/// <reference path="../../scripts/managers/spawningmanager.ts" />
/// <reference path="../../scripts/actors/athlete.ts" />

interface CapatchaDifference {
	texts: string[];
	captcha: Captcha;
}

interface CaptchaEntry {
	image: string;
	ocr1: string;
	ocr2: string;
}

interface Upgrade {
	name: string;
	id: string;
	price: number;
	type: string;
	icon: string;
	description: string;
	unlocksAt: number;
}

interface EnemyType {
	id: string;
	speed: number;
	life: number;
	changeLane: boolean;
	sound: { hit: string; die: string };
	spritesPathTemplate: string;
	sX?: number;
	sY?: number;
	offsetX?: number;
	offsetY?: number;
}

interface EnemyTypes extends _.Dictionary<EnemyType> {
	coach: EnemyType;
	fast: EnemyType;
	tallstops: EnemyType;
	weak: EnemyType;
	winger: EnemyType;
	wideCenters: EnemyType;
}


interface AthleteType {
	id: string;
	sound: { fall?: string; run?: string };
	offsetX?: number;
	offsetY?: number;
	speed: number;
}

interface AthleteTypes extends _.Dictionary<AthleteType> {
	baseball: AthleteType;
	football: AthleteType;
	hockey: AthleteType;
}

interface Instruction {
	image: string;
	description: string;
}

declare class closestWord {
    match: any;
    closestOcr: CapatchaDifference;
    constructor(intput: any, differences: CapatchaDifference[]);
}

interface JQuery {
    selectmenu(options: any);
    leanSlider(options: any);
	mCustomScrollbar(options?: any);
	slider(options?: any): JQuery;
}