/// <reference path="../../scripts/managers/smorballmanager.ts" />
/// <reference path="../../scripts/managers/splashscreensmanager.ts" />
/// <reference path="../../scripts/managers/resourcesmanager.ts" />
/// <reference path="../tsd.d.ts" />
/// <reference path="../../scripts/main.ts" />
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

interface SurvivalEnemyData {
	startTime: number;
	spawnCost: number;
}

interface SurvivalPowerupData {
	startTime: number;
	spawnCost: number;
}

interface SurvivalData {
	minimumEnemySpawnTime: number;
	minimumPowerupSpawnTime: number;
	enemies: _.Dictionary<SurvivalEnemyData>;
	powerups: _.Dictionary<SurvivalPowerupData>;
}

interface OCRPage {
	_id?: string;
	url?: string;
	id?: string;
	__v?: number;
	differences: OCRChunk[];
	isLocal: boolean;
	spritesheet?: createjs.SpriteSheet;
}

interface StadiumPart {
	x: number;
	y: number;
	type: string;
	flipped?: boolean;
}

interface StadiumData {
	parts: StadiumPart[];
}

interface AudienceMemberType {
	id: string;
	scale: number;
	offsetX: number;
	offsetY: number;
}

interface OCRChunk {
	_id?: string;
	id: string;
	__v?: number;
	tags?: PageAPIDifferenceTag[];
	texts: string[];
	coords?: { x: number; y: number }[];
	page?: OCRPage;
	frame: number;
}

interface PowerupTypes extends _.Dictionary<PowerupType> {
	cleats: PowerupType;
	helmet: PowerupType;
	bullhorn: PowerupType;
}

interface PowerupType {
	name: string;
	speedMultiplier?: number;
	damageMultiplier?: number;
	spawnChance: number;
}

interface PageAPIDifferenceTag {
	text: string;
	weight: number
}


interface Difficulty {
	name: string;
	multiplier: number;
	requiredTime: number;
}

interface Level {
	index: number;
	name: string;
	lanes: number[];
	team: Team;
	waves: LevelWave[];
	powerups: string[];
	timeTrial?: boolean;
	passes?: number;
}

interface Team {
	name: string;
	id: string;
	outfit: number;
}

interface LevelWave {
	actions: WaveAction[];
}

interface WaveAction {
	type: string;
	enemy?: string;
	commentry?: string;
	time?: number;
	sameLane?: boolean;
	powerup?: string;
	quantity?: number;
	noSkip?: boolean;
	lane?: number;
}

interface SmorballConfig {
	enemySpawnPositions: { x: number; y: number }[];
	friendlySpawnPositions: { x: number; y: number }[];
	captchaPositions: { x: number; y: number }[];
	width: number;
	height: number;
	penaltyTime: number;
	enemyTouchdowns: number;
	passes: number;
	debug: boolean;
	goalLine: number;
	difficulties: Difficulty[];
	knockbackMin: number;
	knockbackMax: number;
	knockbackWordLengthMultiplier: number;
	PageAPIUrl: string;
	PageAPIAccessToken: string;
	PageAPITimeout: number;
	maxCaptchaSize: number;
	DifferenceAPIUrl: string;
	entriesBeforeServerSubmission: number;
	fbAppId: string;
	timeTrialUnlockLevel: number;
	captchaScaleLimitConstantN: number;
}

interface Upgrade {
	name: string;
	id: string;
	price: number;
	type: string;
	icon: string;
	description: string;
	unlocksAt: number;
	multiplier?: number;
}

interface EnemyType {
	id: string;
	speed: number;
	life: number;
	changeLane: boolean;
	spritesPathTemplate: string;
	offsetX?: number;
	offsetY?: number;
	scale: number;
	audio: EnemyTypeAudioSettings;
	speedBuff?: number;
}

interface EnemyTypeAudioSettings {
	id: string;
	hit: EnemyTypeAudioSetting;
	die: EnemyTypeAudioSetting;
}

interface EnemyTypeAudioSetting {
	variations: number;
}

interface EnemyTypes extends _.Dictionary<EnemyType> {
	//boss: EnemyType;
	//fast: EnemyType;
	//regular: EnemyType;
	//weak: EnemyType;
	//lanechange: EnemyType;
	//heavy: EnemyType;
}


interface AthleteType {
	id: string;
	sound: { tackle: string; };
	offsetX?: number;
	offsetY?: number;
	speed: number;
	scale: number;
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
    closestOcr: OCRChunk;
	text: string;
    constructor(intput: any, differences: OCRChunk[]);
}

interface JQuery {
    selectmenu(options: any);
    leanSlider(options: any);
	mCustomScrollbar(options?: any);
	slider(options?: any): JQuery;
	slider(property:string, value:any): JQuery;
}