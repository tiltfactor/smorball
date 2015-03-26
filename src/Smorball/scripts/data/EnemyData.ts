
interface EnemyTypeData {
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

interface EnemyData extends _.Dictionary<EnemyTypeData> {
	coach: EnemyTypeData;
	fast: EnemyTypeData;
	tallstops: EnemyTypeData;
	weak: EnemyTypeData;
	winger: EnemyTypeData;
	wideCenters: EnemyTypeData;
}

var enemyData: EnemyData = {
	coach:
	{
		id: "coach",
		"changeLane": false,
		"speed": 20,
		"life": 6,
		"sound": { "hit": "enemy1hit", "die": "enemy1die" },
		spritesPathTemplate: "shapes/enemy characters/Coach Enemy C{0}"
	},
	fast:
	{
		"id": "fast",
		"changeLane": false,
		"speed": 50,
		"life": 1,
		"sound": { "hit": "enemy2hit", "die": "enemy2die" },
		"spritesPathTemplate": "shapes/enemy characters/Skater Enemy S{0}"
	},
	tallstops:
	{
		"id": "tallstops",
		"changeLane": false,
		"speed": 10,
		"life": 3,
		"sound": { "hit": "enemy3hit", "die": "enemy3die" },
		"spritesPathTemplate": "shapes/enemy characters/Tennis Enemy T{0}"
	},
	weak:
	{
		"id": "weak",
		"changeLane": false,
		"speed": 20,
		"life": 1,
		"offsetX": 265,
		"offsetY": 369,
		"sound": { "hit": "enemy4hit", "die": "enemy4die" },
		"spritesPathTemplate": "shapes/enemy characters/Grand Mother Enemy GB{0}"
	},
	winger:
	{
		"id": "winger",
		"changeLane": true,
		"speed": 30,
		"life": 1,
		"sound": { "hit": "enemy5hit", "die": "enemy5die" },
		"spritesPathTemplate": "shapes/enemy characters/Hooligan Enemy H{0}"
	},
	wideCenters:
	{
		"id": "wideCenters",
		"changeLane": false,
		"speed": 20,
		"life": 6,
		"sound": { "hit": "enemy1hit", "die": "enemy1die" },
		"sX": 0.5,
		"sY": 0.5,
		"spritesPathTemplate": "shapes/enemy characters/Weightlifter Enemy W{0}"
	}
};


//var EnemyData = {

//    coach: {
//        "data": {
//            "images": ["boss_walk", "boss_die"],
//            "frames": { "regX": 0, "height": 114, "count": 70, "regY": 0, "width": 104 },
//            "animations": { "run": [0, 15, "run", 0.2], "die": [15, 70, 0.2], "stand": [12, 12] },
//			"path": "shapes/enemy characters/Coach Enemy C{0}"
//        },
//        "extras": {
//            "id": "coach",
//            "speed": 2,
//            "life": 6,
//            "sound": { "hit": "enemy1hit", "die": "enemy1die" }

//        }
//    },

//    fast: {
//        "data": {
//            "images": ["fast_walk", "fast_die"],
//            "frames": { "regX": 0, "height": 254, "count": 64, "regY": 0, "width": 240 },
//            "animations": { "run": [0, 15, "run", 1.5], "die": [16, 40], "stand": [15] },
//			"path": "shapes/enemy characters/Skater Enemy S{0}"
//        },
//        "extras": {
//            "id": "fast",
//            "speed": 5,
//            "life": 1,
//            "sound": { "hit": "enemy2hit", "die": "enemy2die" }

//        }
//    },

//    tallstops: {
//        "data": {
//            "images": ["badGuy_walk", "badGuy_die"],
//            "frames": { "regX": 0, "height": 152, "count": 40, "regY": 0, "width": 120 },
//            "animations": { "run": [0, 15, "run", 0.2], "die": [16, 70], "stand": [15] },
//			"path": "shapes/enemy characters/Tennis Enemy T{0}"
//        },
//        "extras": {
//            "id": "tallstops",
//            "speed": 1,
//            "life": 3,
//            "sound": { "hit": "enemy3hit", "die": "enemy3die" }
//        }
//    },

//    walkingBacks: {
//        "data": {
//            "images": ["weak_walk", "weak_die"],
//            "frames": { "regX": 0, "height": 152, "count": 70, "regY": 0, "width": 120 },
//            "animations": { "run": [0, 15, "run", 0.2], "die": [15, 70, 0.2], "stand": [12, 12] },
//			"path": "shapes/enemy characters/Grand Mother Enemy GB{0}"
//        },
//        "extras": {
//            "id": "walkingBacks",
//            "speed": 2,
//            "life": 1,
//            "sound": { "hit": "enemy4hit", "die": "enemy4die" }

//        }
//    },

//    winger: {
//        "data": {
//            "images": ["moving_walk", "moving_die"],
//            "frames": { "regX": 0, "height": 254, "count": 70, "regY": 0, "width": 240 },
//            "animations": { "run": [0, 15, "run", 0.2], "die": [15, 70, 0.2], "stand": [12, 12] },
//			"path": "shapes/enemy characters/Hooligan Enemy H0{0}"
//        },
//        "extras": {
//            "changeLane": true,
//            "id": "winger",
//            "speed": 3,
//            "life": 1,
//            "sound": { "hit": "enemy5hit", "die": "enemy5die" }

//        }
//    },

//    wideCenters: {
//        "data": {
//            "images": ["enemy_regular"],
//            "frames": { "regX": 0, "height": 513, "count": 1, "regY": 0, "width": 493 },
//            "animations": { "run": [0, 0, "run", 0.2], "die": [0, 0, 0.2], "stand": [0, 0] },
//			"path": "shapes/enemy characters/Weightlifter Enemy W{0}"
//        },
//        "extras": {
//            "id": "wideCenters",
//            "speed": 2,
//            "life": 6,
//            "sound": { "hit": "enemy1hit", "die": "enemy1die" },
//            "sX": 0.5,
//            "sY": 0.5

//        }
//    }

//};