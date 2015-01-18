/**
 * Created by nidhincg on 13/12/14.
 */
Levels = [];

Levels[1] = { "level" : 1, "lanes" : 3 , "pass" : 1,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4, "data": [
        {"types" : ["enemy_regular"], "time": 5000, "size" : 2, stageDatas: [] },
        {"types" : ["fast"], "time": -1, "size" : 1, stageDatas: [["fast",1,6000],["fast",1]] }
    ]  }
}

Levels[2] = { "level" : 2, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4, "data": [
        {"types" : ["weak"], "time": -1, "size" : 2, stageDatas: [["weak",1,10000,""],["weak",2,0,""]] },
        {"types" : ["weak"], "time": -1, "size" : 1, stageDatas: [] },
        {"types" : ["weak"], "time": -1, "size" : 1, stageDatas: [] },
        {"types" : ["weak"], "time": -1, "size" : 3, stageDatas: [["weak",2,4000,""],["weak",2,15000,""],["weak",1,0,""]] },
        {"types" : ["weak"], "time": -1, "size" : 2, stageDatas: [["weak",3,5000],["weak",3]] },
        {"types":["weak"],"time":-1,"size":4, stageDatas:[["weak",3,4000,""],["weak",3,10000,""],["weak",1,2000,""],["weak",1,0,""]]},
        {"types":["badGuy"],"time":-1,"size":1, stageDatas:[]},
        {"types":["badGuy"],"time":-1,"size":1, stageDatas:[]},
        {"types":["badGuy","weak"],"time":-1,"size":2, stageDatas:[["badGuy",2,5000,""],["weak",2,0,""]]}
    ]  }
}
Levels[3] = { "level" : 3, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4, "data": [
        //{"types" : ["badGuy","fast"], "time": -1, "size" : 2, stageDatas: [["badGuy",1,3000,""],["fast",2,0,""]] },
        //{"types" : ["badGuy","weak"], "time": -1, "size" : 2, stageDatas: [["badGuy",1,4000,""],["weak",3,0,""]] },
        //{"types" : ["weak","badGuy"], "time": -1, "size" : 3, stageDatas: [["weak",1,5000,""],["badGuy",3,5000,""],["badGuy",2,0,""]] },
        //{"types" : ["weak","badGuy"], "time": -1, "size" : 3, stageDatas: [["badGuy",1,15000,""],["badGuy",3,15000,""],["weak",2,0,""]] },
        //{"types" : ["fast,","weak","badGuy"], "time": -1, "size" : 5, stageDatas: [["fast",3,3000,""],["weak",1,3000,""],["badGuy",2,8000,""],["badGuy",1,8000,""],["badGuy",3,0,""]] },
        {"types" : ["fast,","badGuy"], "time": -1, "size" : 5, stageDatas: [["fast",2,4000,""],["badGuy",3,10000,""],["fast",2,4000,""],["badGuy",1,4000,""],["fast",3,0,""]] },
        {"types" : ["boss"], "time": -1, "size" : 1, stageDatas: [["boss",2,0,"Watchout for Boss he is very strong"]]}
    ]  }
}
Levels[4] = { "level" : 4, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4, "data": [
        {"types" : ["boss"], "time": -1, "size" : 1, stageDatas: [["boss",2,20000]] },
        {"types" : ["boss"], "time": -1, "size" : 2, stageDatas: [["boss",1,10000],["boss",2]] },
        //{"types" : [], "time": -1, "size" : 2, stageDatas: [] },
        {"types" : ["boss","badGuy"], "time": -1, "size" : 5, stageDatas: [["badGuy",3,4000],["badGuy",2,4000],["badGuy",3,4000],["badGuy",1,4000],["boss",3]] },
        {"types" : ["boss","badGuy"], "time": -1, "size" : 3, stageDatas: [["boss",3,7000],["badGuy",1,4000],["badGuy",2]] },
        {"types" : ["boss","badGuy"], "time": -1, "size" : 3, stageDatas: [["boss",3,7000],["badGuy",1,4000],["badGuy",2]] }

    ]  }
}
Levels[3] = { "level" : 5, "lanes" : 3 , "pass" : 2,
    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4, "data": [
        {"types" : ["regular","badGuy"], "time": -1, "size" : 6, stageDatas: [["regular",2],["regular",1],["regular",3,140000],["badGuy",1,8000],["badGuy",3,8000],["badGuy",2]] },
        {"types" : ["fast","badGuy"], "time": -1, "size" : 6, stageDatas: [["fast",3,4000],["fast",2,6000],["fast",3,6000],["badGuy",1,6000],["fast",1,4000],["fast",2]] },
        //{"types" : [], "time": -1, "size" : 2, stageDatas: [] },
        {"types" : ["boss"], "time": -1, "size" : 5, stageDatas: [] },
        {"types" : ["regular","fast","badGuy"], "time": -1, "size" : 5, stageDatas: [["regular",3,5000],["fast",1,8000],["badGuy",2,6000],["badGuy",1],["badGuy",3]] },
        {"types" : ["regular","fast","badGuy"], "time": -1, "size" : 7, stageDatas: [["badGuy",2,0],["badGuy",1,8000],["fast",2,5000],["fast",3,8000]/*powerup*/,["badGuy",1,6000],["regular",2,7000],["fast",3,4000]] },
        {"types" : ["boss"], "time": -1, "size" : 2, stageDatas: [/*3powerup*/] }

    ]  }
}



//Levels[2] = {"level": 2, "waves": [{
//    "types":["boss","fast"],
//    "enemyPerWave":3,
//    "time":5
//},{
//    "types":["badGuy","fast"],
//    "enemyPerWave":3,
//    "time":10
//}], "lanes" : 3, "life" : 1, "time":20,
//    "types" : ["boss"], "maxOnGround" : 4, "pass" : 1};


//Levels[1] = { "level" : 1, "lanes" : 3 , "pass" : 1,
//    "waves" : { "activeWaves" : 1, "time" : 1000, "maxOnGround" : 4, "data": [
//        {"types" : ["badGuy"], "time": -1, "size" : 4, stageDatas: [["weak",0],["weak",1,3000],["weak",2,2000],["weak",0]] },
//        {"types" : ["badGuy"], "time": -1, "size" : 4, stageDatas: [["badGuy",0],["weak",1,3000],["weak",2],["badGuy",0]] }
//    ]  }
//
//}

// stageDatas: [{"type": "badGuy","lane": 0, "time":5000},{"type": "weak","lane": 1},{"type": "badGuy","lane": 0}] },

//Levels[1] = {"level": 1, "waves": 10, "enemyPerWave" : 1, "lanes" : 1, "life" : 1, "time":0,
//    "types" : ["boss"], "maxOnGround" : 1, "pass" : 1};
//Levels[2] = {"level": 2, "waves": 5, "enemyPerWave" : 2, "lanes" : 2, "life" : 1,"time": 5 ,
//    "types" : ["boss"],  "maxOnGround" : 2, "pass" : 1};
//Levels[3] = {"level": 3, "waves": 3, "enemyPerWave" : 2, "lanes" : 2, "life" : 1,"time": 10 ,
//    "types" : ["boss"], "maxOnGround" : 3, "pass" : 1};
//Levels[4] = {"level": 4, "waves": 3, "enemyPerWave" : 2, "lanes" : 2, "life" : 2,"time": 15,
//    "types" : ["boss"], "maxOnGround" : 4, "pass" : 1};
//Levels[5] = {"level": 5, "waves": 3, "enemyPerWave" : 4, "lanes" : 3, "life" : 3,"time": 20,
//  "types" : ["boss"], "maxOnGround" : 5, "pass" : 1};
