/**
 * Created by nidhincg on 13/12/14.
 */
LevelData = [];

LevelData[1] = {
    "level": 1, "lanes": 1, "pass": 1, "levelName": "LOCAL QUALIFIERS",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 13,
        "message": "Opponents come from the right.@@Keep them from scoring in your endzone. ", "data": [
            {"types": ["walkingBacks"], "time": -1, "size": 10, "stageDatas": []},
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
    "level": 2, "lanes": 3, "pass": 2, "levelName": "LOCAL QUARTERFINALS",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 18,
        "message": "Jujubes come in 3 different rows now.", "data": [
            {
                "types": ["walkingBacks"],
                "time": -1,
                "size": 2,
                "stageDatas": [["walkingBacks", 1, 10000, " Type the word in the same row as the Jujube to hit that Jujube."], ["walkingBacks", 2, 0, ""]]
            },
            {"types": ["walkingBacks"], "time": -1, "size": 1, "stageDatas": []},
            {"types": ["walkingBacks"], "time": -1, "size": 1, "stageDatas": []},
            {
                "types": ["walkingBacks"],
                "time": -1,
                "size": 3,
                "stageDatas": [["walkingBacks", 2, 4000, ""], ["walkingBacks", 2, 15000, ""], ["walkingBacks", 1, 0, ""]]
            },
            {
                "types": ["walkingBacks"],
                "time": -1,
                "size": 2,
                "stageDatas": [["walkingBacks", 3, 5000], ["walkingBacks", 3]]
            },
            {
                "types": ["walkingBacks"],
                "time": -1,
                "size": 4,
                "stageDatas": [["walkingBacks", 3, 4000, ""], ["walkingBacks", 3, 10000, ""], ["walkingBacks", 1, 2000, ""], ["walkingBacks", 1, 0, ""]]
            },
            {"types": ["tallstops"], "time": -1, "size": 1, "stageDatas": []},
            {"types": ["tallstops"], "time": -1, "size": 1, "stageDatas": []},
            {
                "types": ["tallstops", "walkingBacks"],
                "time": -1,
                "size": 2,
                "stageDatas": [["tallstops", 2, 5000, ""], ["walkingBacks", 2, 0, ""]]
            }
        ]
    },
    "extras":{"message":"Shop has been unlocked"}
};
LevelData[3] = {
    "level": 3, "lanes": 3, "pass": 2, "levelName": "LOCAL SEMIFINALS",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 22,
        "data": [
            {
                "types": ["tallstops", "fast"],
                "time": -1,
                "size": 2,
                "stageDatas": [["tallstops", 1, 3000, ""], ["fast", 2, 0, ""]]
            },
            {
                "types": ["tallstops", "walkingBacks"],
                "time": -1,
                "size": 2,
                "stageDatas": [["tallstops", 1, 4000, ""], ["walkingBacks", 3, 0, ""]]
            },
            {
                "types": ["walkingBacks", "tallstops"],
                "time": -1,
                "size": 3,
                "stageDatas": [["walkingBacks", 1, 5000, ""], ["tallstops", 3, 5000, ""], ["tallstops", 2, 0, ""]]
            },
            {
                "types": ["walkingBacks", "tallstops"],
                "time": -1,
                "size": 3,
                "stageDatas": [["tallstops", 1, 15000, ""], ["tallstops", 3, 15000, ""], ["walkingBacks", 2, 0, ""]]
            },
            {
                "types": ["fast,", "walkingBacks", "tallstops"],
                "time": -1,
                "size": 5,
                "stageDatas": [["fast", 3, 3000, ""], ["walkingBacks", 1, 3000, ""], ["tallstops", 2, 8000, ""], ["tallstops", 1, 8000, ""], ["tallstops", 3, 0, ""]]
            },
            {
                "types": ["fast,", "tallstops"],
                "time": -1,
                "size": 5,
                "stageDatas": [["fast", 2, 4000, ""], ["tallstops", 3, 10000, ""], ["fast", 2, 4000, ""], ["tallstops", 1, 4000, ""], ["fast", 3, 0, ""]]
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
    "level": 4, "lanes": 3, "pass": 2, "levelName": "LOCAL FINALS",
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
                "types": ["boss", "tallstops", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["tallstops", 3, 4000], ["tallstops", 2, 4000], ["tallstops", 3, 4000], ["tallstops", 1, 4000], ["cleats", 2, 5000, "", "powerup"], ["boss", 3]]
            },
            {
                "types": ["boss", "tallstops", "cleats"],
                "time": -1,
                "size": 4,
                "stageDatas": [["boss", 3, 0], ["cleats", 2, 0, "", "powerup"], ["tallstops", 1, 4000], ["tallstops", 2]]
            },
            {
                "types": ["boss", "tallstops", "cleats"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 3, 0], ["cleats", 2, 0, "", "powerup"], ["tallstops", 1, 4000], ["cleats", 3, 0, "", "powerup"], ["tallstops", 2]]
            }

        ]
    },
    "extras":{"message":"Cleats has been unlocked"}
};
LevelData[5] = {
    "level": 5, "lanes": 3, "pass": 2, "levelName": "STATE QUALIFIERS",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 28,
        "data": [
            {
                "types": ["walkingBacks", "tallstops", "cleats"],
                "time": -1,
                "size": 8,
                "stageDatas": [["walkingBacks", 2, 0], ["walkingBacks", 1, 0], ["walkingBacks", 3, 5000], ["cleats", 1, 0, "", "powerup"], ["cleats", 2, 14000, "", "powerup"], ["tallstops", 3, 8000], ["tallstops", 1, 8000], ["tallstops", 2]]
            },
            {
                "types": ["fast", "tallstops", "cleats"],
                "time": -1,
                "size": 8,
                "stageDatas": [["fast", 3, 4000], ["fast", 2, 6000], ["fast", 3, 6000], ["cleats", 2, 0, "", "powerup"], ["tallstops", 1, 6000], ["fast", 1, 4000], ["fast", 2], ["cleats", 2, 0, "", "powerup"]]
            },
            {"types": ["boss"], "time": -1, "size": 1, "stageDatas": []},
            {
                "types": ["walkingBacks", "fast", "tallstops"],
                "time": -1,
                "size": 5,
                "stageDatas": [["walkingBacks", 3, 5000], ["fast", 1, 8000], ["tallstops", 2, 6000], ["tallstops", 1], ["tallstops", 3]]
            },
            {
                "types": ["walkingBacks", "fast", "tallstops", "cleats"],
                "time": -1,
                "size": 9,
                "stageDatas": [["tallstops", 2, 0], ["tallstops", 1, 8000], ["fast", 2, 5000], ["fast", 3, 8000], ["cleats", 3, 0, "", "powerup"], ["cleats", 2, 0, "", "powerup"], ["tallstops", 1, 6000], ["walkingBacks", 2, 7000], ["fast", 3, 4000]]
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
    "level": 6, "lanes": 3, "pass": 2, "levelName": "STATE QUARTERFINALS",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 52,
        "message": "Pick up the powerup.@@Use tab to select it", "data": [
            {
                "types": ["walkingBacks", "helmet"],
                "time": -1,
                "size": 5,
                "stageDatas": [["helmet", 1, 0, "This one hit every jujube in the row@@ Try it now !", "powerup"], ["walkingBacks", 1, 2000, ""], ["walkingBacks", 1, 2000, ""], ["walkingBacks", 1, 0, ""], ["helmet", 2, 0, "", "powerup"]]
            },
            {
                "types": ["tallstops", "helmet", "cleats"],
                "time": -1,
                "size": 5,
                "stageDatas": [["tallstops", 1, ""], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 3000], ["cleats", 3, 0, "", "powerup"]]
            },
            {
                "types": ["helmet", "tallstops", "walkingBacks", "fast", "walkingBacks"],
                "time": -1,
                "size": 7,
                "stageDatas": [["helmet", 1, 5000, "", "powerup"], ["tallstops", 1, 0], ["walkingBacks", 1, 2000], ["tallstops", 1, 4000], ["walkingBacks", 1, 2000], ["fast", 3, 7000], ["walkingBacks", 2, 0]]
            },
            {
                "types": ["walkingBacks", "fast", "tallstops", "helmet"],
                "time": -1,
                "size": 10,
                "stageDatas": [["tallstops", 1, 4000], ["fast", 1, 2000], ["fast", 1, 0], ["walkingBacks", 2], ["cleats", 3, 5000, "", "powerup"], ["walkingBacks", 3, 2000], ["walkingBacks", 3, 2000], ["walkingBacks", 3, 2000], ["walkingBacks", 2, 3000], ["walkingBacks", 2]]
            },
            {
                "types": ["walkingBacks", "helmet"],
                "time": -1,
                "size": 9,
                "stageDatas": [["helmet", 2, 0, "", "powerup"], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 3000], ["walkingBacks", 3, 7000], ["walkingBacks", 1, 2000], ["walkingBacks", 1, 2000], ["walkingBacks", 1, 2000], ["helmet", 3, 0, "", "powerup"]]
            },
            {
                "types": ["walkingBacks", "helmet", "cleats", "boss", "tallstops", "fast"],
                "time": -1,
                "size": 17,
                "stageDatas": [["cleats", 1, 0, "", "powerup"], ["boss", 2, 6000], ["walkingBacks", 2, 6000], ["walkingBacks", 2, 6000], ["cleats", 1, 0, "", "powerup"], ["walkingBacks", 2, 6000], ["walkingBacks", 2, 5000], ["helmet", 3, 2000, "", "powerup"], ["tallstops", 3, 2000], ["walkingBacks", 1, 4000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 2000], ["fast", 2, 4000], ["cleats", 1, 0, "", "powerup"], ["boss", 2]]
            },
            {
                "types": ["walkingBacks", "fast", "helmet"],
                "time": -1,
                "size": 4,
                "stageDatas": [["helmet", 2, 2000, "", "powerup"], ["walkingBacks", 1, 5000], ["walkingBacks", 1, 5000], ["fast", 3]]
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
    "level": 7, "lanes": 3, "pass": 2, "levelName": "STATE SEMIFINALS",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 31,
        "data": [
            {
                "types": ["fast", "cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["tallstops", 1, 7000], ["walkingBacks", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["walkingBacks", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["walkingBacks", 1, 7000], ["walkingBacks", 3, 10000], ["tallstops", 2, 5000], ["walkingBacks", 1]]
            },
            {
                "types": ["walkingBacks", "fast", "tallstops", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["tallstops", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["walkingBacks", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["walkingBacks", "cleats", "boss", "tallstops", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 3, 7000], ["tallstops", 1, 7000], ["boss", 2, 6000], ["walkingBacks", 1, 4000], ["fast", 2]]
            }

        ]
    }
};
LevelData[8] = {
    "level": 8, "lanes": 3, "pass": 2, "levelName": "STATE FINALS",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 7,
        "data": [
            {
                "types": [ "cleats", "tallstops"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 3, 2000], ["tallstops", 2, 2000], ["cleats", 2, 3000, "", "powerup"], ["tallstops", 2, 3000], ["cleats", 1]]
            },
            {
                "types": ["boss", "fast", "cleats"],
                "time": -1,
                "size": 5,
                "stageDatas": [["fast", 2, 3000], ["fast", 1, 2000], ["boss", 3, 3000], ["cleats", 1, 1000,"","powerup"], ["fast", 2]]
            }
        ]
    }
};
LevelData[9] = {
    "level": 9, "lanes": 3, "pass": 2, "levelName": "STATE FINALS",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 5,
        "data": [
            {
                "types": ["tallstops", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["tallstops", 1, 3000], ["walkingBacks", 2, 2000], ["walkingBacks", 2, 2000], ["walkingBacks", 2, 2000], ["walkingBacks",2]]
            }
        ]
    }
};
LevelData[10] = {
    "level": 10, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 11,
        "data": [
            {
                "types": ["fast", "helmet"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 2, 2000], ["fast", 2, 2000],["fast", 2, 2000], ["helmet", 3, 2000, "", "powerup"],["fast", 2, 2000], ["helmet", 3, 0, "", "powerup"]]
            },
            {
                "types": ["cleats", "winger", "walkingBacks","helmet"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 3, 10000,"Winger can switch lanes.@@  Time your orders well, @@or else your athletes will miss him!","powerup"], ["winger", 1, 12000], ["helmet", 3, 0,"","powerup"], ["walkingBacks", 3]]
            },
            {
                "types": ["cleats", "winger", "walkingBacks","helmet"],
                "time": -1,
                "size": 5,
                "stageDatas": [["helmet", 1, 10000,"","powerup"], ["winger", 3, 12000], ["walkingBacks", 2, 2000], ["walkingBacks", 2, 2000],["walkingBacks", 2, 2000],["cleats",2,15000,"","powerup"],["winger",1]]
            }
        ]
    }
};
LevelData[11] = {
    "level": 11, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 6,
        "data": [
            {
                "types": ["helmet", "cleats", "boss", "walkingBacks"],
                "time": -1,
                "size": 6,
                "stageDatas": [["walkingBacks", 3, 2000], ["walkingBacks", 3, 2000], ["helmet", 2, 2000, "", "powerup"], ["walkingBacks", 3, 2000], ["helmet", 2, 2000, "", "powerup"], ["walkingBacks", 3, 2000],["boss",2]]
            }


        ]
    }
};
LevelData[12] = {
    "level": 12, "lanes": 3, "pass": 2, "levelName": "State finals",
    "waves": {
        "activeWaves": 1, "time": 1000, "maxOnGround": 4, "enemySize": 7,
        "data": [
            {
                "types": ["bullhorn", "walkingBacks"],
                "time": -1,
                "size": 6,
                "stageDatas": [["bullhorn", 2, 30000, "And there’s a Bullhorn on the field!@@Use the Bullhorn to send all of your athletes down the field at once!", "powerup"] , ["walkingBacks", 1], ["walkingBacks", 2], ["walkingBacks", 3]]
            },
            {
                "types": ["bullhorn", "tallstops"],
                "time": -1,
                "size": 6,
                "stageDatas": [["tallstops", 1, 2000] ,["bullhorn",2,"","powerup"],["bullhorn",2,"","powerup"],["tallstops", 3, 2000],["tallstops", 3, 2000]]
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
                "types": ["fast", "cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["tallstops", 1, 7000], ["walkingBacks", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["walkingBacks", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["walkingBacks", 1, 7000], ["walkingBacks", 3, 10000], ["tallstops", 2, 5000], ["walkingBacks", 1]]
            },
            {
                "types": ["walkingBacks", "fast", "tallstops", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["tallstops", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["walkingBacks", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["walkingBacks", "cleats", "boss", "tallstops", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 3, 7000], ["tallstops", 1, 7000], ["boss", 2, 6000], ["walkingBacks", 1, 4000], ["fast", 2]]
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
                "types": ["fast", "cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["tallstops", 1, 7000], ["walkingBacks", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["walkingBacks", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["walkingBacks", 1, 7000], ["walkingBacks", 3, 10000], ["tallstops", 2, 5000], ["walkingBacks", 1]]
            },
            {
                "types": ["walkingBacks", "fast", "tallstops", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["tallstops", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["walkingBacks", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["walkingBacks", "cleats", "boss", "tallstops", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 3, 7000], ["tallstops", 1, 7000], ["boss", 2, 6000], ["walkingBacks", 1, 4000], ["fast", 2]]
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
                "types": ["fast", "cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["tallstops", 1, 7000], ["walkingBacks", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["walkingBacks", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["walkingBacks", 1, 7000], ["walkingBacks", 3, 10000], ["tallstops", 2, 5000], ["walkingBacks", 1]]
            },
            {
                "types": ["walkingBacks", "fast", "tallstops", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["tallstops", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["walkingBacks", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["walkingBacks", "cleats", "boss", "tallstops", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 3, 7000], ["tallstops", 1, 7000], ["boss", 2, 6000], ["walkingBacks", 1, 4000], ["fast", 2]]
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
                "types": ["fast", "cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 6,
                "stageDatas": [["fast", 3, 3000], ["fast", 2, 4000], ["cleats", 2, 5000, "", "powerup"], ["tallstops", 1, 7000], ["walkingBacks", 3, 4000], ["fast", 2]]
            },
            {
                "types": ["boss", "fast", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["boss", 2, 4000], ["fast", 1, 4000], ["fast", 3, 7000], ["walkingBacks", 1, 7000], ["fast", 3]]
            },
            {
                "types": ["cleats", "tallstops", "walkingBacks"],
                "time": -1,
                "size": 5,
                "stageDatas": [["cleats", 2, 4000, "", "powerup"], ["walkingBacks", 1, 7000], ["walkingBacks", 3, 10000], ["tallstops", 2, 5000], ["walkingBacks", 1]]
            },
            {
                "types": ["walkingBacks", "fast", "tallstops", "cleats"],
                "time": -1,
                "size": 6,
                "stageDatas": [["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 1, 4000], ["fast", 1, 4000], ["boss", 3, 10000], ["tallstops", 2, 4000], ["fast", 1]]
            },
            {
                "types": ["walkingBacks", "cleats", "fast", "boss"],
                "time": -1,
                "size": 6,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 3000, "", "powerup"], ["fast", 3, 15000], ["boss", 2, 4000], ["fast", 3, 4000], ["fast", 1, 5000]]
            },
            {
                "types": ["walkingBacks", "cleats", "boss", "tallstops", "fast"],
                "time": -1,
                "size": 7,
                "stageDatas": [["walkingBacks", 1, 0], ["cleats", 2, 5000, "", "powerup"], ["walkingBacks", 3, 7000], ["tallstops", 1, 7000], ["boss", 2, 6000], ["walkingBacks", 1, 4000], ["fast", 2]]
            }

        ]
    }
};

LevelData[0] = {
    "level": 0, "lanes": 3, "pass": 2,"levelName":"Survival",
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
                "types": ["fast", "cleats", "tallstops", "walkingBacks"], "time": -1, "size": 6,
                "stageDatas": []
            }

        ]
    }
};


