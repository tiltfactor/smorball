/**
 * Created by Abhilash on 8/12/14.
 */
EnemyData = {};

EnemyData.coach = {
    "data":{
        "images":["boss_walk", "boss_die"],
        "frames": {"regX": 0, "height": 114, "count": 70, "regY": 0, "width": 104},
        "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
    },
    "extras":{
        "id" : "coach",
        "speed": 2,
        "life": 6,
        "sound": {"hit": "enemy1hit", "die" : "enemy1die"}
    
    }
};
EnemyData.fast = {
    "data":{
        "images":["fast_walk","fast_die"],
        "frames": {"regX": 0, "height": 254, "count": 64, "regY": 0, "width": 240},
        "animations": {"run": [0, 15, "run", 1.5], "die": [16, 40], "stand": [15]}
    },
    "extras":{
        "id" : "fast",
        "speed": 5,
        "life": 1,
        "sound": {"hit": "enemy2hit", "die" : "enemy2die"}
    
    }
};
EnemyData.tallstops = {
    "data":{
        "images":["badGuy_walk","badGuy_die"],
        "frames": {"regX": 0, "height": 152, "count": 40, "regY": 0, "width": 120},
        "animations": {"run": [0, 15, "run", 0.2], "die": [16, 70], "stand": [15]}
    },
    "extras":{
        "id" : "tallstops",
        "speed": 1,
        "life":3,
        "sound": {"hit": "enemy3hit", "die" : "enemy3die"}
    }
};
EnemyData.walkingBacks = {
    "data":{
        "images":["weak_walk", "weak_die"],
        "frames": {"regX": 0, "height": 152, "count": 70, "regY": 0, "width": 120},
        "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
    },
    "extras":{
        "id" : "walkingBacks",
        "speed": 2,
        "life": 1,
        "sound": {"hit": "enemy4hit", "die" : "enemy4die"}
    
    }
};
EnemyData.winger = {
    "data":{
        "images":["moving_walk", "moving_die"],
        "frames": {"regX": 0, "height": 254, "count": 70, "regY": 0, "width": 240},
        "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
    },
    "extras":{
        "changeLane":true,
        "id" : "winger",
        "speed": 3,
        "life": 1,
        "sound": {"hit": "enemy5hit", "die" : "enemy5die"}
    
    }
};
EnemyData.wideCenters = {
    "data":{
        "images":["enemy_regular"],
        "frames": {"regX": 0, "height": 513, "count": 1, "regY": 0, "width": 493},
        "animations": {"run": [0, 0, "run", 0.2],  "die" : [0,0,0.2],"stand":[0,0]}
    },
    "extras":{
        "id" : "wideCenters",
        "speed": 2,
        "life": 6,
        "sound": {"hit": "enemy1hit", "die" : "enemy1die"},
        "sX" : 0.5,
        "sY" : 0.5
    
    }
};