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
        "life": 6
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
        "life": 1
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
        "life":3
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
        "life": 1
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
        "life": 1
    }
};