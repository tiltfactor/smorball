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
