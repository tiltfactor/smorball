/**
 * Created by user on 8/12/14.
 */
EnemyData = {};

EnemyData.boss = {
    "images":["boss_walk", "boss_die"],
    "frames": {"regX": 0, "height": 114, "count": 70, "regY": 0, "width": 104},
    "animations": {"run": [0, 15, "run", 0.2],  "die" : [15,70,0.2],"stand":[12,12]}
};
EnemyData.fast = {
    "images":["fast_walk","fast_die"],
    "frames": {"regX": 0, "height": 254, "count": 64, "regY": 0, "width": 240},
    "animations": {"run": [0, 15, "run", 1.5], "die": [16, 40], "stand": [15]}
};
EnemyData.badGuy = {
    "images":["badGuy_walk","badGuy_die"],
    "frames": {"regX": 0, "height": 152, "count": 40, "regY": 0, "width": 120},
    "animations": {"run": [0, 15, "run", 0.2], "die": [16, 70], "stand": [15]}
};