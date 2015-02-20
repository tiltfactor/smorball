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
        "id" : "boss",
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
EnemyData.badGuy = {
    "data":{
        "images":["badGuy_walk","badGuy_die"],
        "frames": {"regX": 0, "height": 152, "count": 40, "regY": 0, "width": 120},
        "animations": {"run": [0, 15, "run", 0.2], "die": [16, 70], "stand": [15]}
    },
    "extras":{
        "id" : "badGuy",
        "speed": 1,
        "life":3,
        "sound": {"hit": "enemy3hit", "die" : "enemy3die"}
    }
};
EnemyData.weak = {
    "data":{
        "images":["weak_walk", "weak_die"],
        "frames": {"regX": 0, "height": 152, "count": 70, "regY": 0, "width": 120},
        "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
    },
    "extras":{
        "id" : "weak",
        "speed": 2,
        "life": 1,
        "sound": {"hit": "enemy4hit", "die" : "enemy4die"}
    
    }
};
EnemyData.regular = {
    "data":{
        "images":["moving_walk", "moving_die"],
        "frames": {"regX": 0, "height": 254, "count": 70, "regY": 0, "width": 240},
        "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
    },
    "extras":{
        "id" : "regular",
        "speed": 3,
        "life": 1,
        "sound": {"hit": "enemy5hit", "die" : "enemy5die"}
    
    }
};
EnemyData.enemy_regular = {
    "data":{
        "images":["enemy_regular"],
        "frames": {"regX": 0, "height": 513, "count": 1, "regY": 0, "width": 493},
        "animations": {"run": [0, 0, "run", 0.2],  "die" : [0,0,0.2],"stand":[0,0]}
    },
    "extras":{
        "id" : "enemy_regular",
        "speed": 4,
        "life": 1,
        "sound": {"hit": "enemy6hit", "die" : "enemy6die"},
        "sX" : 0.5,
        "sY" : 0.5
    
    }
};