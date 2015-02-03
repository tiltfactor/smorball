PowerupsData = {};

PowerupsData.cleats = {
	"data":{
		"images":["cleats"],
	    "frames": {"regX": 0, "height": 75, "count": 1, "regY": 0, "width": 40},
	    "animations": {"run": [0, 0, "run", 0.5], "stand":[0,0]}
	},
	"extras":{
		"life": 3,
        "singleHit" : false,
        "message" : "ice is activated",
        "player" : "man1"
	}
};
PowerupsData.helmet = {
	"data":{
		"images":["helmet"],
	    "frames": {"regX": 0, "height": 75, "count": 1, "regY": 0, "width": 40},
	    "animations": {"run": [0, 0, "run", 0.5], "stand":[0,0]}
	},
	"extras":{
		"life": 1,
        "singleHit" : true,
        "message" : "Ruby is activated",
        "player" : "man1"
	}
};
PowerupsData.bullhorn = {
	"data":{
		"images":["bullhorn"],
	    "frames": {"regX": 0, "height": 75, "count": 70, "regY": 0, "width": 40},
	    "animations": {"run": [0, 31, "run", 0.5], "stand":[0,0]}
	},
	"extras":{
		"life": 1,
        "singleHit" : false,
        "message" : "Amber is activated",
        "player" : "man1"
	}
};
