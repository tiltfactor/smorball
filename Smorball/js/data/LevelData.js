/**
 * Created by nidhincg on 13/12/14.
 */
LevelData = [];

LevelData[1] = {
    "level": 1, "lanes": 1, "pass": 1, "levelName": "Local Qualifiers",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 13,
        "message": "Opponents come from the right.@@Keep them from scoring in your endzone. ", "data": [
            {"types": ["enemy_regular"], "time": -1, "size": 10, "stageDatas": []},
            {
                "types": ["fast"],
                "time": -1,
                "size": 2,
                "stageDatas": [["fast", 1, 6000, "Look out, this one's fast!"], ["fast", 1]]
            }
        ]
    }
};

LevelData[2] = {
    "level": 2, "lanes": 3, "pass": 2, "levelName": "Local Quarterfinals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 18,
        "message": "Jujubes come in 3 different rows now.", "data": [
            {
                "types": ["enemy_regular"],
                "time": -1,
                "size": 2,
                "stageDatas": [["enemy_regular", 1, 10000, " Type the word in the same row as the Jujube to hit that Jujube."], ["enemy_regular", 2, 0, ""]]
            },
            {"types": ["enemy_regular"], "time": -1, "size": 1, "stageDatas": []},
            {"types": ["enemy_regular"], "time": -1, "size": 1, "stageDatas": []},
            {
                "types": ["enemy_regular"],
                "time": -1,
                "size": 3,
                "stageDatas": [["enemy_regular", 2, 4000, ""], ["enemy_regular", 2, 15000, ""], ["enemy_regular", 1, 0, ""]]
            },
            {
                "types": ["enemy_regular"],
                "time": -1,
                "size": 2,
                "stageDatas": [["enemy_regular", 3, 5000], ["enemy_regular", 3]]
            },
            {
                "types": ["enemy_regular"],
                "time": -1,
                "size": 4,
                "stageDatas": [["enemy_regular", 3, 4000, ""], ["enemy_regular", 3, 10000, ""], ["enemy_regular", 1, 2000, ""], ["enemy_regular", 1, 0, ""]]
            },
            {"types": ["badGuy"], "time": -1, "size": 1, "stageDatas": []},
            {"types": ["badGuy"], "time": -1, "size": 1, "stageDatas": []},
            {
                "types": ["badGuy", "enemy_regular"],
                "time": -1,
                "size": 2,
                "stageDatas": [["badGuy", 2, 5000, ""], ["enemy_regular", 2, 0, ""]]
            }
        ]
    },
    "extras":{"message":"Shop has been unlocked"}
};
LevelData[3] = {
    "level": 3, "lanes": 3, "pass": 2, "levelName": "Local Semifinals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 22,
        "data": [
            {
                "types": ["badGuy", "fast"],
                "time": -1,
                "size": 2,
                "stageDatas": [["badGuy", 1, 3000, ""], ["fast", 2, 0, ""]]
            },
            {
                "types": ["badGuy", "enemy_regular"],
                "time": -1,
                "size": 2,
                "stageDatas": [["badGuy", 1, 4000, ""], ["enemy_regular", 3, 0, ""]]
            },
            {
                "types": ["enemy_regular", "badGuy"],
                "time": -1,
                "size": 3,
                "stageDatas": [["enemy_regular", 1, 5000, ""], ["badGuy", 3, 5000, ""], ["badGuy", 2, 0, ""]]
            },
            {
                "types": ["enemy_regular", "badGuy"],
                "time": -1,
                "size": 3,
                "stageDatas": [["badGuy", 1, 15000, ""], ["badGuy", 3, 15000, ""], ["enemy_regular", 2, 0, ""]]
            },
            {
                "types": ["fast,", "enemy_regular", "badGuy"],
                "time": -1,
                "size": 5,
                "stageDatas": [["fast", 3, 3000, ""], ["enemy_regular", 1, 3000, ""], ["badGuy", 2, 8000, ""], ["badGuy", 1, 8000, ""], ["badGuy", 3, 0, ""]]
            },
            {
                "types": ["fast,", "badGuy"],
                "time": -1,
                "size": 5,
                "stageDatas": [["fast", 2, 4000, ""], ["badGuy", 3, 10000, ""], ["fast", 2, 4000, ""], ["badGuy", 1, 4000, ""], ["fast", 3, 0, ""]]
            },
            {
                "types": ["boss"],
                "time": -1,
                "size": 1,
                "stageDatas": [["boss", 2, 0, "Watchout for Boss! He's very strong!"]]
            }
        ]
    }
};
LevelData[4] = {
    "level": 4, "lanes": 3, "pass": 2, "levelName": "Local Finals",
    "waves": {
        "activeWaves": 1,
        "time": 1000,
        "maxOnGround": 4,
        "enemySize": 15,
        "message": "Powerups make your next word super powerful!@@Type the word to pick up the powerup.@@ Use tab to select your powerup",
        "data": [
            {
                "types": ["boss", "cleats"],
                "time": -1,
                "size": 4,
                "stageDatas": [["cleats", 2, 2000, "This one deals extra damage!@@ Try it now! ", "powerup"], ["boss", 2, 20000], ["cleats", 1, 0, "", "powerup"], ["cleats", 3, 0, "", "powerup"]]
            },
            {
                "types": ["boss", "cleats"],
                "time": -1,
                "size": 3,
                "stageDatas": [["boss", 1, 5000], ["cleats", 3, 5000, "", "powerup"], ["boss", 2]]
            },
            {
                "types": ["cleats"],
                "time": -1,
                "size": 3,
                "stageDatas": [["cleats", 1, 0, "", "powerup"], ["cleats", 2, 0, "", "powerup"], ["cleats", 3, 0, "", "powerup"]]
            },
            {
                "types": ["boss", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["badGuy", 3, 4000], ["badGuy", 2, 4000], ["badGuy", 3, 4000], ["badGuy", 1, 4000], ["cleats", 2, 5000, "", "powerup"], ["boss", 3]]
            },
            {
                "types": ["boss", "badGuy", "cleats"],
                "time": -1,
                "size": 4,
                "stageDatas": [["boss", 3, 0], ["cleats", 2, 0, "", "powerup"], ["badGuy", 1, 4000], ["badGuy", 2]]
            },
            {
                "types": ["boss", "badGuy", "cleats"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 3, 0], ["cleats", 2, 0, "", "powerup"], ["badGuy", 1, 4000], ["cleats", 3, 0, "", "powerup"], ["badGuy", 2]]
            }

        ]
    },
    "extras":{"message":"Cleats has been unlocked"}
};
LevelData[5] = {
    "level": 5, "lanes": 3, "pass": 2, "levelName": "State Qualifiers",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 28,
        "data": [
            {
                "types": ["regular", "badGuy", "cleats"],
                "time": -1,
                "size": 8,
                "stageDatas": [["regular", 2, 0], ["regular", 1, 0], ["regular", 3, 5000], ["cleats", 1, 0, "", "powerup"], ["cleats", 2, 14000, "", "powerup"], ["badGuy", 3, 8000], ["badGuy", 1, 8000], ["badGuy", 2]]
            },
            {
                "types": ["fast", "badGuy", "cleats"],
                "time": -1,
                "size": 8,
                "stageDatas": [["fast", 3, 4000], ["fast", 2, 6000], ["fast", 3, 6000], ["cleats", 2, 0, "", "powerup"], ["badGuy", 1, 6000], ["fast", 1, 4000], ["fast", 2], ["cleats", 2, 0, "", "powerup"]]
            },
            {"types": ["boss"], "time": -1, "size": 1, "stageDatas": []},
            {
                "types": ["regular", "fast", "badGuy"],
                "time": -1,
                "size": 5,
                "stageDatas": [["regular", 3, 5000], ["fast", 1, 8000], ["badGuy", 2, 6000], ["badGuy", 1], ["badGuy", 3]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 9,
                "stageDatas": [["badGuy", 2, 0], ["badGuy", 1, 8000], ["fast", 2, 5000], ["fast", 3, 8000], ["cleats", 3, 0, "", "powerup"], ["cleats", 2, 0, "", "powerup"], ["badGuy", 1, 6000], ["regular", 2, 7000], ["fast", 3, 4000]]
            },
            {
                "types": ["boss", "cleats"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 1, 0, "", "powerup"], ["cleats", 2, 0, "", "powerup"], ["cleats", 3, 500, "", "powerup"], ["boss", 2, 0], ["boss", 3, 0]]
            }

        ]
    }
};
LevelData[6] = {
    "level": 6, "lanes": 3, "pass": 2, "levelName": "State Quarterfinals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 52,
        "message": "Pick up the powerup.@@Use tab to select it", "data": [
            {
                "types": ["enemy_regular", "helmet"],
                "time": -1,
                "size": 5,
                "stageDatas": [["helmet", 1, 0, "This one hit every jujube in the row@@ Try it now !", "powerup"], ["enemy_regular", 1, 2000, ""], ["enemy_regular", 1, 2000, ""], ["enemy_regular", 1, 0, ""], ["helmet", 2, 0, "", "powerup"]]
            },
            {
                "types": ["badGuy", "helmet", "cleats"],
                "time": -1,
                "size": 5,
                "stageDatas": [["badGuy", 1, ""], ["enemy_regular", 3, 3000], ["enemy_regular", 3, 3000], ["enemy_regular", 3, 3000], ["cleats", 3, 0, "", "powerup"]]
            },
            {
                "types": ["helmet", "badGuy", "enemy_regular", "fast", "regular"],
                "time": -1,
                "size": 7,
                "stageDatas": [["helmet", 1, 5000, "", "powerup"], ["badGuy", 1, 0], ["enemy_regular", 1, 2000], ["badGuy", 1, 4000], ["enemy_regular", 1, 2000], ["fast", 3, 7000], ["regular", 2, 0]]
            },
            {
                "types": ["regular", "fast", "badGuy", "helmet"],
                "time": -1,
                "size": 10,
                "stageDatas": [["badGuy", 1, 4000], ["fast", 1, 2000], ["fast", 1, 0], ["regular", 2], ["cleats", 3, 5000, "", "powerup"], ["enemy_regular", 3, 2000], ["enemy_regular", 3, 2000], ["enemy_regular", 3, 2000], ["regular", 2, 3000], ["regular", 2]]
            },
            {
                "types": ["regular", "helmet"],
                "time": -1,
                "size": 9,
                "stageDatas": [["helmet", 2, 0, "", "powerup"], ["regular", 3, 3000], ["regular", 3, 3000], ["regular", 3, 3000], ["regular", 3, 7000], ["regular", 1, 2000], ["regular", 1, 2000], ["regular", 1, 2000], ["helmet", 3, 0, "", "powerup"]]
            },
            {
                "types": ["regular", "helmet", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 17,
                "stageDatas": [["cleats", 1, 0, "", "powerup"], ["boss", 2, 6000], ["regular", 2, 6000], ["regular", 2, 6000], ["cleats", 1, 0, "", "powerup"], ["regular", 2, 6000], ["regular", 2, 5000], ["helmet", 3, 2000, "", "powerup"], ["badGuy", 3, 2000], ["enemy_regular", 1, 4000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 4000], ["cleats", 1, 0, "", "powerup"], ["boss", 2]]
            },
            {
                "types": ["enemy_regular", "fast", "helmet"],
                "time": -1,
                "size": 4,
                "stageDatas": [["helmet", 2, 2000, "", "powerup"], ["enemy_regular", 1, 5000], ["enemy_regular", 1, 5000], ["fast", 3]]
            },
            {
                "types": ["fast"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 1], ["fast", 1], ["fast", 1], ["fast", 2], ["fast", 2], ["fast", 2]]
            }
        ]
    },
    "extras":{"message":"Helmet has been unlocked"}
};
LevelData[7] = {
    "level": 7, "lanes": 3, "pass": 2, "levelName": "State Semifinals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[8] = {
    "level": 8, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[9] = {
    "level": 9, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[10] = {
    "level": 10, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[11] = {
    "level": 11, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[12] = {
    "level": 12, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    },
    "extras":{"message":"Bullhorn has been unlocked"}
};
LevelData[13] = {
    "level": 13, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[14] = {
    "level": 14, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[15] = {
    "level": 15, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[16] = {
    "level": 16, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["badGuy", 1, 7000], ["regular", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["regular", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "badGuy", "regular"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["regular", 1, 7000], ["regular", 3, 10000], ["badGuy", 2, 5000], ["regular", 1]]
            },
            {
                "types": ["regular", "fast", "badGuy", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["regular", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["badGuy", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["regular", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["regular", "cleats", "boss", "badGuy", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["regular", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["regular", 3, 7000], ["badGuy", 1, 7000], ["boss", 2, 6000], ["regular", 1, 4000], ["fast", 2]]
            }

        ]
    }
};

LevelData[0] = {
    "level": 0, "lanes": 3, "pass": 2,
    "waves": {
        "activeWaves": 1,
        "time": 1000,
        "maxOnGround": 4,
        "enemySize": 31,
        "cleatsSize": 5,
        "helmetSize": 0,
        "bullhornSize": 0,
        "data": [
            {
                "types": ["fast", "cleats", "badGuy", "regular"], "time": -1, "size": 6,
                "stageDatas": []
            }

        ]
    }
};


