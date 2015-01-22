/**
 * Created by nidhincg on 13/12/14.
 */
Levels = [];

Levels[1] = { "level" : 1, "lanes" : 1 , "pass" : 1,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4, "enemySize":12,"messages":"Jujubes come from the right.@@ Keep the Jujubes from getting to the grass. @@Type the word and press enter to stop the Jujube.","data": [
        {"types" : ["enemy_regular"], "time": -1, "size" : 10, stageDatas: [] },
        {"types" : ["fast"], "time": -1, "size" : 2, stageDatas: [["fast",1,6000,"Look out! Here they come!"],["fast",1]] }
    ]  }
};

Levels[2] = { "level" : 2, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4,"enemySize":17, "data": [
        {"types" : ["enemy_regular"], "time": -1, "size" : 2, stageDatas: [["enemy_regular",1,10000,"Jujubes come in 3 different rows now. Type the word in the same row as the Jujube to hit that Jujube."],["enemy_regular",2,0,""]] },
        {"types" : ["enemy_regular"], "time": -1, "size" : 1, stageDatas: [] },
        {"types" : ["enemy_regular"], "time": -1, "size" : 1, stageDatas: [] },
        {"types" : ["enemy_regular"], "time": -1, "size" : 3, stageDatas: [["enemy_regular",2,4000,""],["enemy_regular",2,15000,""],["enemy_regular",1,0,""]] },
        {"types" : ["enemy_regular"], "time": -1, "size" : 2, stageDatas: [["enemy_regular",3,5000],["enemy_regular",3]] },
        {"types":["enemy_regular"],"time":-1,"size":4, stageDatas:[["enemy_regular",3,4000,""],["enemy_regular",3,10000,""],["enemy_regular",1,2000,""],["enemy_regular",1,0,""]]},
        {"types":["badGuy"],"time":-1,"size":1, stageDatas:[]},
        {"types":["badGuy"],"time":-1,"size":1, stageDatas:[]},
        {"types":["badGuy","enemy_regular"],"time":-1,"size":2, stageDatas:[["badGuy",2,5000,""],["enemy_regular",2,0,""]]}
    ]  }
};
Levels[3] = { "level" : 3, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4,"enemySize":21, "data": [
        {"types" : ["badGuy","fast"], "time": -1, "size" : 2, stageDatas: [["badGuy",1,3000,""],["fast",2,0,""]] },
        {"types" : ["badGuy","enemy_regular"], "time": -1, "size" : 2, stageDatas: [["badGuy",1,4000,""],["enemy_regular",3,0,""]] },
        {"types" : ["enemy_regular","badGuy"], "time": -1, "size" : 3, stageDatas: [["enemy_regular",1,5000,""],["badGuy",3,5000,""],["badGuy",2,0,""]] },
        {"types" : ["enemy_regular","badGuy"], "time": -1, "size" : 3, stageDatas: [["badGuy",1,15000,""],["badGuy",3,15000,""],["enemy_regular",2,0,""]] },
        {"types" : ["fast,","enemy_regular","badGuy"], "time": -1, "size" : 5, stageDatas: [["fast",3,3000,""],["enemy_regular",1,3000,""],["badGuy",2,8000,""],["badGuy",1,8000,""],["badGuy",3,0,""]] },
        {"types" : ["fast,","badGuy"], "time": -1, "size" : 5, stageDatas: [["fast",2,4000,""],["badGuy",3,10000,""],["fast",2,4000,""],["badGuy",1,4000,""],["fast",3,0,""]] },
        {"types" : ["boss"], "time": -1, "size" : 1, stageDatas: [["boss",2,0,"Watchout for Boss! He's very strong!"]]}
    ]  }
};
Levels[4] = { "level" : 4, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4,"enemySize":14,"messages":"Powerups make your next word super powerful!@@Type the word to pick up the powerup.@@ Use tab to select your powerup", "data": [
        {"types" : ["boss","ice"], "time": -1, "size" : 4, stageDatas: [["ice",2,2000,"This one deals extra damage!@@ Try it now! ","powerup"],["boss",2,20000],["ice",1,0,"","powerup"],["ice",3,0,"","powerup"]] },
        {"types" : ["boss","ice"], "time": -1, "size" : 3, stageDatas: [["boss",1,5000],["ice",3,5000,"","powerup"],["boss",2]] },
        {"types" : ["ice"], "time": -1, "size" : 3, stageDatas: [["ice",1,0,"","powerup"],["ice",2,0,"","powerup"],["ice",3,0,"","powerup"]] },
        {"types" : ["boss","badGuy","ice"], "time": -1, "size" : 6, stageDatas: [["badGuy",3,4000],["badGuy",2,4000],["badGuy",3,4000],["badGuy",1,4000],["ice",2,5000,"","powerup"],["boss",3]] },
        {"types" : ["boss","badGuy","ice"], "time": -1, "size" : 4, stageDatas: [["boss",3,0],["ice",2,0,"","powerup"],["badGuy",1,4000],["badGuy",2]] },
        {"types" : ["boss","badGuy","ice"], "time": -1, "size" : 5, stageDatas: [["boss",3,0],["ice",2,0,"","powerup"],["badGuy",1,4000],["ice",3,0,"","powerup"],["badGuy",2]] }

    ]  }
};
Levels[5] = { "level" : 5, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4,"enemySize":27, "data": [
        {"types" : ["regular","badGuy","ice"], "time": -1, "size" : 8, stageDatas: [["regular",2,0],["regular",1,0],["regular",3,5000],["ice",1,0,"","powerup"],["ice",2,14000,"","powerup"],["badGuy",3,8000],["badGuy",1,8000],["badGuy",2]] },
        {"types" : ["fast","badGuy","ice"], "time": -1, "size" : 8, stageDatas: [["fast",3,4000],["fast",2,6000],["fast",3,6000],["ice",2,0,"","powerup"],["badGuy",1,6000],["fast",1,4000],["fast",2],["ice",2,0,"","powerup"]] },
        {"types" : ["boss"], "time": -1, "size" : 1, stageDatas: [] },
        {"types" : ["regular","fast","badGuy"], "time": -1, "size" : 5, stageDatas: [["regular",3,5000],["fast",1,8000],["badGuy",2,6000],["badGuy",1],["badGuy",3]] },
        {"types" : ["regular","fast","badGuy","ice"], "time": -1, "size" : 9, stageDatas: [["badGuy",2,0],["badGuy",1,8000],["fast",2,5000],["fast",3,8000],["ice",3,0,"","powerup"],["ice",2,0,"","powerup"],["badGuy",1,6000],["regular",2,7000],["fast",3,4000]] },
        {"types" : ["boss","ice"], "time": -1, "size" : 5, stageDatas: [["ice",1,0,"","powerup"],["ice",2,0,"","powerup"],["ice",3,500,"","powerup"],["boss",2,0],["boss",3,0]] }

    ]  }
};
Levels[6] = { "level" : 6, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4,"enemySize":50,"messages":"Pick up the powerup.@@Use tab to select it", "data": [
        {"types" : ["enemy_regular","ruby"], "time": -1, "size" : 5, stageDatas: [["ruby",1,0,"This one hit every jujube in the row@@ Try it now !","powerup"],["enemy_regular",1,2000,""],["enemy_regular",1,2000,""],["enemy_regular",1,0,""],["ruby",2,0,"","powerup"]] },
        {"types" : ["badGuy","ruby","ice"], "time": -1, "size" : 5, stageDatas: [["badGuy",1,""],["enemy_regular",3,3000],["enemy_regular",3,3000],["enemy_regular",3,3000],["ice",3,0,"","powerup"]] },
        {"types" : ["ruby","badGuy","enemy_regular","fast","regular"], "time": -1, "size" : 7, stageDatas: [["ruby",1,5000,"","powerup"],["badGuy",1,0],["enemy_regular",1,2000],["badGuy",1,4000],["enemy_regular",1,2000],["fast",3,7000],["regular",2,0]] },
        {"types" : ["regular","fast","badGuy","ruby"], "time": -1, "size" : 10, stageDatas: [["badGuy",1,4000],["fast",1,2000],["fast",1,0],["regular",2],["ice",3,5000,"","powerup"],["enemy_regular",3,2000],["enemy_regular",3,2000],["enemy_regular",3,2000],["regular",2,3000],["regular",2]] },
        {"types" : ["regular","ruby"], "time": -1, "size" : 9, stageDatas: [["ruby",2,0,"","powerup"],["regular",3,3000],["regular",3,3000],["regular",3,3000],["regular",3,7000],["regular",1,2000],["regular",1,2000],["regular",1,2000],["ruby",3,0,"","powerup"]] },
        {"types" : ["regular","ruby","ice","boss","badGuy","fast"], "time": -1, "size" : 17, stageDatas: [["ice",1,0,"","powerup"],["boss",2,6000],["regular",2,6000],["regular",2,6000],["ice",1,0,"","powerup"],["regular",2,6000],["regular",2,5000],["ruby",3,2000,"","powerup"],["badGuy",3,2000],["enemy_regular",1,4000],["fast",2,2000],["fast",2,2000],["fast",2,2000],["fast",2,2000],["fast",2,4000],["ice",1,0,"","powerup"],["boss",2]]},
        {"types":["enemy_regular","fast","ruby"], "time": -1, "size" :4,stageDatas:[["ruby",2,2000,"","powerup"],["enemy_regular",1,5000],["enemy_regular",1,5000],["fast",3]]},
        {"types":["fast"],"time":-1, "size" :6,stageDatas:[["fast",1],["fast",1],["fast",1],["fast",2],["fast",2],["fast",2]]}
        ] }
};
Levels[7] = { "level" : 7, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4,"enemySize":30, "data": [
        {"types" : ["fast","ice","badGuy","regular"], "time": -1, "size" : 6, stageDatas: [["fast",3,3000],["fast",2,4000],["ice",2,5000,"","powerup"],["badGuy",1,7000],["regular",3,4000],["fast",2]] },
        {"types" : ["boss","fast","regular"], "time": -1, "size" : 5, stageDatas: [["boss",2,4000],["fast",1,4000],["fast",3,7000],["regular",1,7000],["fast",3]] },
        {"types" : ["ice","badGuy","regular"], "time": -1, "size" : 5, stageDatas: [["ice",2,4000,"","powerup"],["regular",1,7000],["regular",3,10000],["badGuy",2,5000],["regular",1]] },
        {"types" : ["regular","fast","badGuy","ice"], "time": -1, "size" : 6, stageDatas: [["ice",2,5000,"","powerup"],["regular",1,4000],["fast",1,4000],["boss",3,10000],["badGuy",2,4000],["fast",1]] },
        {"types" : ["regular","ice","fast","boss"], "time": -1, "size" : 6, stageDatas: [["regular",1,0],["ice",2,3000,"","powerup"],["fast",3,15000],["boss",2,4000],["fast",3,4000],["fast",1,5000]] },
        {"types" : ["regular","ice","boss","badGuy","fast"], "time": -1, "size" : 7, stageDatas: [["regular",1,0],["ice",2,5000,"","powerup"],["regular",3,7000],["badGuy",1,7000],["boss",2,6000],["regular",1,4000],["fast",2]]}

        ] }
};


