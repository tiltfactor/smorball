/**
 * Created by user on 8/12/14.
 */
EnemyData = {};

EnemyData.boss = {
    "data":{
        "images":["boss_walk", "boss_die"],
        "frames": {"regX": 0, "height": 114, "count": 70, "regY": 0, "width": 104},
        "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
    },
    "extras":{
        "speed": 2,
        "life": 6,
        "sound": {"hit": "bat1", "kill" : "bat1", "run": "run"}
    
    }
};
EnemyData.fast = {
    "data":{
        "images":["fast_walk","fast_die"],
        "frames": {"regX": 0, "height": 254, "count": 64, "regY": 0, "width": 240},
        "animations": {"run": [0, 15, "run", 1.5], "die": [16, 40], "stand": [15]}
    },
    "extras":{
        "speed": 5,
        "life": 1,
        "sound": {"hit": "bat2", "kill" : "bat2", "run": "run"}
    
    }
};
EnemyData.badGuy = {
    "data":{
        "images":["badGuy_walk","badGuy_die"],
        "frames": {"regX": 0, "height": 152, "count": 40, "regY": 0, "width": 120},
        "animations": {"run": [0, 15, "run", 0.2], "die": [16, 70], "stand": [15]}
    },
    "extras":{
        "speed": 1,
        "life":3,
        "sound": {"hit": "bat3", "kill" : "bat3", "run": "run"}
    }
};
EnemyData.weak = {
    "data":{
        "images":["weak_walk", "weak_die"],
        "frames": {"regX": 0, "height": 152, "count": 70, "regY": 0, "width": 120},
        "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
    },
    "extras":{
        "speed": 2,
        "life": 1,
        "sound": {"hit": "bat4", "kill" : "bat4", "run": "run"}
    
    }
};
EnemyData.regular = {
    "data":{
        "images":["moving_walk", "moving_die"],
        "frames": {"regX": 0, "height": 254, "count": 70, "regY": 0, "width": 240},
        "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
    },
    "extras":{
        "speed": 3,
        "life": 1,
        "sound": {"hit": "bat5", "kill" : "bat5", "run": "run"}
    
    }
};
EnemyData.enemy_regular = {
    "data":{
        "images":["enemy_regular"],
        "frames": {"regX": 0, "height": 513, "count": 1, "regY": 0, "width": 493},
        "animations": {"run": [0, 0, "run", 0.2],  "die" : [0,0,0.2],"stand":[0,0]}
    },
    "extras":{
        "speed": 2,
        "life": 1,
        "sound": {"hit": "bat6", "kill" : "bat6", "run": "run"}
    
    }
};