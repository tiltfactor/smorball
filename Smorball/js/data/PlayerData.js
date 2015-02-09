/**
 * Created by user on 8/12/14.
 */
PlayerData = {};
PlayerData.man = {
	"data":{
		"images":["man"],
	    "frames": {"regX": 0, "height": 292, "count": 64, "regY": 0, "width": 165},
	    "animations": {"run": [0, 25, "run", 6], "jump": [26, 63], "stand": [60], "fall" :[48,54,4]}
	},
	"extras":{
		"sound": {"fall": "hit", "run": "run"}
	}
    
};
PlayerData.man1 = {
	"data":{
	    "images":["man1"],
	    "frames": {"regX": 0, "height": 148, "count": 30, "regY": 0, "width": 120},
	    "animations": {"run": [0, 29, "run", 1.5], "jump": [12, 17], "stand": [3], "fall" :[18,24,4]}
	},
	"extras":{
		"sound": {"fall": "hit", "run": "run"}
	}    
};
PlayerData.player_normal = {
	"data":{
	    "images":["player_normal"],
	    "frames": {"regX": 0, "height": 369, "count": 10, "regY": 0, "width": 234},
	    "animations": {"run": [0, 9, "run", 0.4], "jump": [0, 0], "stand": [0], "fall" :[0,0,4]}
	},
	"extras":{
		"sound": {"fall": "hit", "run": "run"}
	}  
};
//"frames": [
//
//	[461, 2, 435, 627],
//	[1272, 1260, 410, 627],
//	[899, 631, 425, 627],
//	[452, 631, 445, 627],
//	[2, 2, 457, 627],
//	[856, 1260, 414, 627],
//	[2, 1260, 425, 627],
//	[429, 1260, 425, 627],
//	[898, 2, 430, 627],
//	[2, 631, 448, 627]
//],
//	"animations": {"run": [0, 9, "run", 0.4], "jump": [0, 0], "stand": [0], "fall" :[0,0,4]}
