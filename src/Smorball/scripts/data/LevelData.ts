interface Level {
	name: string;
	lanes: number[];
	waves: LevelWave[];
}

interface LevelWave
{
	actions: WaveAction[];
}

interface WaveAction {
	type: string;
	enemy?: string;
	commentry?: string;
	time?: number;
}

var levelsData: Level[] = [
	{
		name: "PRE SEASON SCRIMMAGE",
		lanes: [1],
		waves: [
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "Jujubes come from the right. Keep the Jujubes from getting to the grass. Type the word and press enter to stop the Jujube." }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "Careful, because punctuation maters!" }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "Capitalization matters too!" }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "Every letter in this word is capital!" }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "Use a space to separate multiple words." }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "Type Æ as AE..." }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "... and use / for fractions." }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "You don’t need to type accents." }
				]
			},
			{
				actions: [
					{ type: "spawn", enemy: "weak" },
					{ type: "commentate", commentry: "If you can’t type it, click ‘Pass’." },
					{ type: "spawn", enemy: "weak" }
				]
			},
			{
				actions: [
					{ type: "commentate", commentry: "Look out! Here they come!" },
					{ type: "spawn", enemy: "fast" },
					{ type: "delay", time: 6 },
					{ type: "spawn", enemy: "weak" }
				]
			}
		]
	}
];


//var LevelData = [
//    {
//        "level": 0,
//		"lanes": 3,
//		"pass": 2,
//		"levelName": "NATIONAL FINALS",
//        "waves": {
//            "activeWaves": 1,
//            "time": 1000,
//            "maxOnGround": 4,
//            "enemySize": 31,
//            "cleatsSize": 5,
//            "helmetSize": 0,
//            "bullhornSize": 0,
//            "data": [
//                {
//                    "types": ["fast", "cleats", "tallstops", "walkingBacks", "wideCenters", "coach", "helmet", "bullhorn"], "time": -1, "size": 6,
//                    "stageDatas": []
//                }

//            ]
//        }
//    },
//    {
//        "level": 1,
//		"lanes": 1,
//		"pass": 1,
//		"levelName": "PRE SEASON SCRIMMAGE",
//        "waves":
//		{
//            "activeWaves": 1,
//			"time": 1000,
//			"maxOnGround": 4,
//			"enemySize": 13,
//            "message": "Opponents come from the right.@@Keep them from scoring in your endzone. ",
//			"data": [
//                {
//					"types": ["walkingBacks"],
//					"time": -1,
//					"size": 10,
//					"stageDatas": []
//				},
//                {
//                    "types": ["fast"],
//                    "time": -1,
//                    "size": 2,
//                    "stageDatas": [["fast", 1, 6000, "Look out, this one's fast!"], ["fast", 1]]
//                }
//            ]
//        }
//    },
//    {
//        "level": 2, "lanes": 3, "pass": 2, "levelName": "LOCAL QUALIFIERS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 18,
//            "message": "Jujubes come in 3 different rows now.", "data": [
//                {
//                    "types": ["walkingBacks"],
//                    "time": -1,
//                    "size": 2,
//                    "stageDatas": [["walkingBacks", 1, 10000, " Type the word in the same row as the Jujube to hit that Jujube."], ["walkingBacks", 2]]
//                },
//                { "types": ["walkingBacks"], "time": -1, "size": 1, "stageDatas": [] },
//                { "types": ["walkingBacks"], "time": -1, "size": 1, "stageDatas": [] },
//                {
//                    "types": ["walkingBacks"],
//                    "time": -1,
//                    "size": 3,
//                    "stageDatas": [["walkingBacks", 2, 4000, ""], ["walkingBacks", 2, 15000, ""], ["walkingBacks", 1, 0, ""]]
//                },
//                {
//                    "types": ["walkingBacks"],
//                    "time": -1,
//                    "size": 2,
//                    "stageDatas": [["walkingBacks", 3, 5000], ["walkingBacks", 3]]
//                },
//                {
//                    "types": ["walkingBacks"],
//                    "time": -1,
//                    "size": 4,
//                    "stageDatas": [["walkingBacks", 3, 4000, ""], ["walkingBacks", 3, 10000, ""], ["walkingBacks", 1, 2000, ""], ["walkingBacks", 1, 0, ""]]
//                },
//                { "types": ["tallstops"], "time": -1, "size": 1, "stageDatas": [] },
//                { "types": ["tallstops"], "time": -1, "size": 1, "stageDatas": [] },
//                {
//                    "types": ["tallstops", "walkingBacks"],
//                    "time": -1,
//                    "size": 2,
//                    "stageDatas": [["tallstops", 2, 5000, ""], ["walkingBacks", 2, 0, ""]]
//                }
//            ]
//        },
//        "extras": { "message": "Shop has been unlocked" }
//    },
//    {
//        "level": 3, "lanes": 3, "pass": 2, "levelName": "LOCAL QUARTERFINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 22,
//            "data": [
//                {
//                    "types": ["tallstops", "fast"],
//                    "time": -1,
//                    "size": 2,
//                    "stageDatas": [["tallstops", 1, 3000, ""], ["fast", 2, 0, ""]]
//                },
//                {
//                    "types": ["tallstops", "walkingBacks"],
//                    "time": -1,
//                    "size": 2,
//                    "stageDatas": [["tallstops", 1, 4000, ""], ["walkingBacks", 3, 0, ""]]
//                },
//                {
//                    "types": ["walkingBacks", "tallstops"],
//                    "time": -1,
//                    "size": 3,
//                    "stageDatas": [["walkingBacks", 1, 5000, ""], ["tallstops", 3, 5000, ""], ["tallstops", 2, 0, ""]]
//                },
//                {
//                    "types": ["walkingBacks", "tallstops"],
//                    "time": -1,
//                    "size": 3,
//                    "stageDatas": [["tallstops", 1, 15000, ""], ["tallstops", 3, 15000, ""], ["walkingBacks", 2, 0, ""]]
//                },
//                {
//                    "types": ["fast,", "walkingBacks", "tallstops"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["fast", 3, 3000, ""], ["walkingBacks", 1, 3000, ""], ["tallstops", 2, 8000, ""], ["tallstops", 1, 8000, ""], ["tallstops", 3, 0, ""]]
//                },
//                {
//                    "types": ["fast,", "tallstops"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["fast", 2, 4000, ""], ["tallstops", 3, 10000, ""], ["fast", 2, 4000, ""], ["tallstops", 1, 4000, ""], ["fast", 3, 0, ""]]
//                },
//                {
//                    "types": ["wideCenters"],
//                    "time": -1,
//                    "size": 1,
//                    "stageDatas": [["wideCenters", 2, 0, "Watchout for wideCenters! He's very strong!"]]
//                }
//            ]
//        }
//    },
//    {
//        "level": 4, "lanes": 3, "pass": 2, "levelName": "LOCAL SEMIFINALS",
//        "waves": {
//            "activeWaves": 1,
//            "time": 1000,
//            "maxOnGround": 4,
//            "enemySize": 15,
//            "message": "Powerups make your next word super powerful!@@Type the word to pick up the powerup.@@ Use tab to select your powerup",
//            "data": [
//                {
//                    "types": ["wideCenters", "cleats"],
//                    "time": -1,
//                    "size": 4,
//                    "stageDatas": [["cleats", 2, 2000, "This one deals extra damage!@@ Try it now! ", "powerup"], ["wideCenters", 2, 20000], ["cleats", 1, 0, "", "powerup"], ["cleats", 3, 0, "", "powerup"]]
//                },
//                {
//                    "types": ["wideCenters", "cleats"],
//                    "time": -1,
//                    "size": 3,
//                    "stageDatas": [["wideCenters", 1, 5000], ["cleats", 3, 5000, "", "powerup"], ["wideCenters", 2]]
//                },
//                {
//                    "types": ["cleats"],
//                    "time": -1,
//                    "size": 3,
//                    "stageDatas": [["cleats", 1, 0, "", "powerup"], ["cleats", 2, 0, "", "powerup"], ["cleats", 3, 0, "", "powerup"]]
//                },
//                {
//                    "types": ["wideCenters", "tallstops", "cleats"],
//                    "time": -1,
//                    "size": 6,
//                    "stageDatas": [["tallstops", 3, 4000], ["tallstops", 2, 4000], ["tallstops", 3, 4000], ["tallstops", 1, 4000], ["cleats", 2, 5000, "", "powerup"], ["wideCenters", 3]]
//                },
//                {
//                    "types": ["wideCenters", "tallstops", "cleats"],
//                    "time": -1,
//                    "size": 4,
//                    "stageDatas": [["wideCenters", 3, 0], ["cleats", 2, 0, "", "powerup"], ["tallstops", 1, 4000], ["tallstops", 2]]
//                },
//                {
//                    "types": ["wideCenters", "tallstops", "cleats"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["wideCenters", 3, 0], ["cleats", 2, 0, "", "powerup"], ["tallstops", 1, 4000], ["cleats", 3, 0, "", "powerup"], ["tallstops", 2]]
//                }

//            ]
//        },
//        "extras": { "message": "Cleats has been unlocked" }
//    },
//    {
//        "level": 5, "lanes": 3, "pass": 2, "levelName": "LOCAL FINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 28,
//            "data": [
//                {
//                    "types": ["walkingBacks", "tallstops", "cleats"],
//                    "time": -1,
//                    "size": 8,
//                    "stageDatas": [["walkingBacks", 2, 0], ["walkingBacks", 1, 0], ["walkingBacks", 3, 5000], ["cleats", 1, 0, "", "powerup"], ["cleats", 2, 14000, "", "powerup"], ["tallstops", 3, 8000], ["tallstops", 1, 8000], ["tallstops", 2]]
//                },
//                {
//                    "types": ["fast", "tallstops", "cleats"],
//                    "time": -1,
//                    "size": 8,
//                    "stageDatas": [["fast", 3, 4000], ["fast", 2, 6000], ["fast", 3, 6000], ["cleats", 2, 0, "", "powerup"], ["tallstops", 1, 6000], ["fast", 1, 4000], ["fast", 2], ["cleats", 2, 0, "", "powerup"]]
//                },
//                { "types": ["wideCenters"], "time": -1, "size": 1, "stageDatas": [] },
//                {
//                    "types": ["walkingBacks", "fast", "tallstops"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["walkingBacks", 3, 5000], ["fast", 1, 8000], ["tallstops", 2, 6000], ["tallstops", 1], ["tallstops", 3]]
//                },
//                {
//                    "types": ["walkingBacks", "fast", "tallstops", "cleats"],
//                    "time": -1,
//                    "size": 9,
//                    "stageDatas": [["tallstops", 2, 0], ["tallstops", 1, 8000], ["fast", 2, 5000], ["fast", 3, 8000], ["cleats", 3, 0, "", "powerup"], ["cleats", 2, 0, "", "powerup"], ["tallstops", 1, 6000], ["walkingBacks", 2, 7000], ["fast", 3, 4000]]
//                },
//                {
//                    "types": ["wideCenters", "cleats"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["cleats", 1, 0, "", "powerup"], ["cleats", 2, 0, "", "powerup"], ["cleats", 3, 500, "", "powerup"], ["wideCenters", 2, 0], ["wideCenters", 3, 0]]
//                }

//            ]
//        }
//    },
//    {
//        "level": 6, "lanes": 3, "pass": 2, "levelName": "STATE QUALIFIERS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 52,
//            "message": "Pick up the powerup.@@Use tab to select it", "data": [
//                {
//                    "types": ["walkingBacks", "helmet"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["helmet", 1, 0, "This one hit every jujube in the row@@ Try it now !", "powerup"], ["walkingBacks", 1, 2000, ""], ["walkingBacks", 1, 2000, ""], ["walkingBacks", 1, 0, ""], ["helmet", 2, 0, "", "powerup"]]
//                },
//                {
//                    "types": ["tallstops", "helmet", "cleats"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["tallstops", 1, ""], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 3000], ["cleats", 3, 0, "", "powerup"]]
//                },
//                {
//                    "types": ["helmet", "tallstops", "walkingBacks", "fast", "walkingBacks"],
//                    "time": -1,
//                    "size": 7,
//                    "stageDatas": [["helmet", 1, 5000, "", "powerup"], ["tallstops", 1, 0], ["walkingBacks", 1, 2000], ["tallstops", 1, 4000], ["walkingBacks", 1, 2000], ["fast", 3, 7000], ["walkingBacks", 2, 0]]
//                },
//                {
//                    "types": ["walkingBacks", "fast", "tallstops", "helmet"],
//                    "time": -1,
//                    "size": 10,
//                    "stageDatas": [["tallstops", 1, 4000], ["fast", 1, 2000], ["fast", 1, 0], ["walkingBacks", 2], ["cleats", 3, 5000, "", "powerup"], ["walkingBacks", 3, 2000], ["walkingBacks", 3, 2000], ["walkingBacks", 3, 2000], ["walkingBacks", 2, 3000], ["walkingBacks", 2]]
//                },
//                {
//                    "types": ["walkingBacks", "helmet"],
//                    "time": -1,
//                    "size": 9,
//                    "stageDatas": [["helmet", 2, 0, "", "powerup"], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 7000], ["walkingBacks", 1, 2000], ["walkingBacks", 1, 2000], ["walkingBacks", 1, 2000], ["helmet", 3, 0, "", "powerup"]]
//                },
//                {
//                    "types": ["walkingBacks", "helmet", "cleats", "wideCenters", "tallstops", "fast"],
//                    "time": -1,
//                    "size": 17,
//                    "stageDatas": [["cleats", 1, 0, "", "powerup"], ["wideCenters", 2, 6000], ["walkingBacks", 2, 6000], ["walkingBacks", 2, 6000], ["cleats", 1, 0, "", "powerup"], ["walkingBacks", 2, 6000], ["walkingBacks", 2, 5000], ["helmet", 3, 2000, "", "powerup"], ["tallstops", 3, 2000], ["walkingBacks", 1, 4000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 4000], ["cleats", 1, 0, "", "powerup"], ["wideCenters", 2]]
//                },
//                {
//                    "types": ["walkingBacks", "fast", "helmet"],
//                    "time": -1,
//                    "size": 4,
//                    "stageDatas": [["helmet", 2, 2000, "", "powerup"], ["walkingBacks", 1, 5000], ["walkingBacks", 1, 5000], ["fast", 3]]
//                },
//                {
//                    "types": ["fast"],
//                    "time": -1,
//                    "size": 6,
//                    "stageDatas": [["fast", 1], ["fast", 1], ["fast", 1], ["fast", 2], ["fast", 2], ["fast", 2]]
//                }
//            ]
//        },
//        "extras": { "message": "Helmet has been unlocked" }
//    },
//    {
//        "level": 7, "lanes": 3, "pass": 2, "levelName": "STATE QUARTERFINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
//            "data": [
//                {
//                    "types": ["fast", "cleats", "tallstops", "walkingBacks"],
//                    "time": -1,
//                    "size": 6,
//                    "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["tallstops", 1, 7000], ["walkingBacks", 3, 4000], ["fast", 2]]
//                },
//                {
//                    "types": ["wideCenters", "fast", "walkingBacks"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["wideCenters", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["walkingBacks", 1, 7000], ["fast", 3]]
//                },
//                {
//                    "types": ["cleats", "tallstops", "walkingBacks"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["walkingBacks", 1, 7000], ["walkingBacks", 3, 10000], ["tallstops", 2, 5000], ["walkingBacks", 1]]
//                },
//                {
//                    "types": ["walkingBacks", "fast", "tallstops", "cleats"],
//                    "time": -1,
//                    "size": 6,
//                    "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 1, 4000], ["fast", 1, 4000], ["wideCenters", 3, 10000], ["tallstops", 2, 4000], ["fast", 1]]
//                },
//                {
//                    "types": ["walkingBacks", "cleats", "fast", "wideCenters"],
//                    "time": -1,
//                    "size": 6,
//                    "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["wideCenters", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
//                },
//                {
//                    "types": ["walkingBacks", "cleats", "wideCenters", "tallstops", "fast"],
//                    "time": -1,
//                    "size": 7,
//                    "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 3, 7000], ["tallstops", 1, 7000], ["wideCenters", 2, 6000], ["walkingBacks", 1, 4000], ["fast", 2]]
//                }

//            ]
//        }
//    },
//    {
//        "level": 8, "lanes": 3, "pass": 2, "levelName": "STATE SEMIFINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 7,
//            "data": [
//                {
//                    "types": ["cleats", "tallstops"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["cleats", 3, 2000, "", "powerup"], ["tallstops", 2, 2000], ["cleats", 2, 3000, "", "powerup"], ["tallstops", 2, 3000], ["cleats", 1, 0, "", "powerup"]]
//                },
//                {
//                    "types": ["wideCenters", "fast", "cleats"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["fast", 2, 3000], ["fast", 1, 2000], ["wideCenters", 3, 3000], ["cleats", 1, 1000, "", "powerup"], ["fast", 2]]
//                }
//            ]
//        }
//    },
//    {
//        "level": 9, "lanes": 3, "pass": 2, "levelName": "STATE FINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 6,
//            "data": [
//                {
//                    "types": ["tallstops", "walkingBacks"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["tallstops", 1, 3000], ["walkingBacks", 2, 2000], ["walkingBacks", 2, 2000], ["walkingBacks", 2, 2000], ["walkingBacks", 2]]
//                }
//            ]
//        }
//    },
//    {
//        "level": 10, "lanes": 3, "pass": 2, "levelName": "REGIONAL QUALIFIERS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 12,
//            "data": [
//                {
//                    "types": ["fast", "helmet"],
//                    "time": -1,
//                    "size": 6,
//                    "stageDatas": [["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 2000], ["helmet", 3, 2000, "", "powerup"], ["fast", 2, 2000], ["helmet", 3, 0, "", "powerup"]]
//                },
//                {
//                    "types": ["cleats", "winger", "walkingBacks", "helmet"],
//                    "time": -1,
//                    "size": 4,
//                    "stageDatas": [["cleats", 3, 10000, "Winger can switch lanes.@@  Time your orders well, @@or else your athletes will miss him!", "powerup"], ["winger", 1, 12000], ["helmet", 3, 0, "", "powerup"], ["walkingBacks", 3]]
//                },
//                {
//                    "types": ["cleats", "winger", "walkingBacks", "helmet"],
//                    "time": -1,
//                    "size": 7,
//                    "stageDatas": [["helmet", 1, 10000, "", "powerup"], ["winger", 3, 12000], ["walkingBacks", 2, 2000], ["walkingBacks", 2, 2000], ["walkingBacks", 2, 2000], ["cleats", 2, 15000, "", "powerup"], ["winger", 1]]
//                }
//            ]
//        }
//    },
//    {
//        "level": 11, "lanes": 3, "pass": 2, "levelName": "REGIONAL QUARTERFINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 6,
//            "data": [
//                {
//                    "types": ["helmet", "cleats", "wideCenters", "walkingBacks"],
//                    "time": -1,
//                    "size": 7,
//                    "stageDatas": [["walkingBacks", 3, 2000], ["walkingBacks", 3, 2000], ["helmet", 2, 2000, "", "powerup"], ["walkingBacks", 3, 2000], ["cleats", 3, 2000, "", "powerup"], ["walkingBacks", 3, 2000], ["wideCenters", 2]]
//                }


//            ]
//        }
//    },
//    {
//        "level": 12, "lanes": 3, "pass": 2, "levelName": "REGIONAL SEMIFINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 7,
//            "data": [
//                {
//                    "types": ["bullhorn", "walkingBacks"],
//                    "time": -1,
//                    "size": 4,
//                    "stageDatas": [["bullhorn", 2, 30000, "And there’s a Bullhorn on the field!@@Use the Bullhorn to send all of your athletes down the field at once!", "powerup"], ["walkingBacks", 1, 0], ["walkingBacks", 2, 0], ["walkingBacks", 3]]
//                },
//                {
//                    "types": ["bullhorn", "tallstops"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["tallstops", 1, 2000], ["bullhorn", 2, 0, "", "powerup"], ["bullhorn", 2, 0, "", "powerup"], ["tallstops", 3, 2000], ["tallstops", 2]]
//                }

//            ]
//        },
//        "extras": { "message": "Bullhorn has been unlocked" }
//    },
//    {
//        "level": 13, "lanes": 3, "pass": 2, "levelName": "REGIONAL FINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 10,
//            "data": [
//                {
//                    "types": ["fast", "cleats", "bullhorn", "helmet", "wideCenters"],
//                    "time": -1,
//                    "size": 12,
//                    "stageDatas": [["bullhorn", 3, 30000, "", "powerup"], ["fast", 1, 0], ["fast", 2, 0], ["helmet", 3, 4000, "", "powerup"], ["fast", 1, 0], ["fast", 2, 0], ["fast", 3, 2000], ["cleats", 2, 0, "", "powerup"], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 2000], ["wideCenters", 3]]
//                }

//            ]
//        }
//    },
//    {
//        "level": 14, "lanes": 3, "pass": 2, "levelName": "NATIONAL QUALIFIERS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 6,
//            "data": [
//                {
//                    "types": ["winger", "bullhorn", "cleats", "walkingBacks"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["cleats", 3, 30000, "", "powerup"], ["winger", 2, 4000], ["walkingBacks", 1, 0], ["bullhorn", 2, 5000, "", "powerup"], ["bullhorn", 3, 0, "", "powerup"]]
//                },
//                {
//                    "types": ["bullhorn", "winger", "tallstops"],
//                    "time": -1,
//                    "size": 4,
//                    "stageDatas": [["bullhorn", 2, 30000, "", "powerup"], ["tallstops", 1, 0], ["tallstops", 3, 3000], ["winger", 1]]
//                }
//            ]
//        }
//    },
//    {
//        "level": 15, "lanes": 3, "pass": 2, "levelName": "NATIONAL QUARTERFINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 3,
//            "data": [
//                {
//                    "types": ["winger", "helmet"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["helmet", 2, 0, "", "powerup"], ["helmet", 1, 30000, "", "powerup"], ["winger", 1, 0], ["winger", 3, 4000], ["helmet", 2, 0, "", "powerup"]]
//                }
//            ]
//        }
//    },
//    {
//        "level": 16, "lanes": 3, "pass": 2, "levelName": "NATIONAL SEMIFINALS",
//        "waves": {
//            "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 9,
//            "data": [
//                {
//                    "types": ["coach", "fast", "walkingBacks"],
//                    "time": -1,
//                    "size": 3,
//                    "stageDatas": [["coach", 2, 0], ["walkingBacks", 1, 2000], ["walkingBacks", 1]]
//                },
//                {
//                    "types": ["coach", "fast", "walkingBacks"],
//                    "time": -1,
//                    "size": 5,
//                    "stageDatas": [["walkingBacks", 1, 0], ["walkingBacks", 3, 3000], ["coach", 2, 2000], ["fast", 2, 0], ["fast", 2]]
//                }
//            ]
//        }
//    }
//];



