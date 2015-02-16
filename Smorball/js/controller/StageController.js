function StageController(config) {
    this.config = config || {};
    this.events = {};
    StageController.prototype.init = function () {
        var me = this;
        this.config.stage = new createjs.Stage("myCanvas");
        this.config.stage.enableMouseOver(10);
        setCanvasAttributes(this);
        createjs.Ticker.setFPS(20);

        sc = this;
        this.events.tick = function(){tick(me);};
        createjs.Ticker.addEventListener("tick", this.events.tick);
        createjs.Ticker.setPaused(true);

        loadEvents(this);
        this.currentIndex=0;
        this.default_player = "player_normal";

    };


    var loadEvents = function (me) {

        var ng = function(){newGame(me)};
        EventBus.addEventListener("newGame", ng);

        var rg = function(){resumeGame(me)};
        EventBus.addEventListener("resumeGame", rg);

        var pg = function(){pauseGame(me)};
        EventBus.addEventListener("pauseGame", pg);

        var km = function(ob){killMe(me,ob)};
        EventBus.addEventListener("killme", km);

        var kl = function(){killLife(me)};
        EventBus.addEventListener("killLife", kl);

        var pe = function(object){pushEnemy(me, object.target)};
        EventBus.addEventListener("pushEnemy", pe);

        var pp = function(object){pushPowerup(me, object.target)};
        EventBus.addEventListener("pushPowerup", pp);

        var so = function(){showTimeoutScreen(me)};
        EventBus.addEventListener("showTimeoutScreen", so);

        var sm = function(text){showGameMessage(me,text)};
        EventBus.addEventListener("showMessage",sm);


        var cc = function(){compareCaptcha(me)};
        EventBus.addEventListener("compareCaptcha", cc);

        var st = function(){setTickerStatus()};
        EventBus.addEventListener("setTickerStatus",st);

        var us = function(){unselectAllInBag(me)};
        EventBus.addEventListener("unselectAllInBag",us);

        var su = function(powerup){selectPowerUp(me,powerup.target)};
        EventBus.addEventListener("selectPowerUp",su);

        var cl = function(ob){changeLane(me, ob.target)}
        EventBus.addEventListener("changeLane", cl);

    }

    var newGame = function (me) {
        window.onresize = function(){onResize(me)};

        $("#inputText").val("");
        resetGame(me);

        me.config.gameState.currentState = me.config.gameState.states.RUN;
        me.levelConfig = LevelData[me.config.gameState.currentLevel];
        me.time = 0;
        me.captchaProcessor = new CaptchaProcessor({"loader": me.config.loader, "canvasWidth": me.canvasWidth, "canvasHeight": me.canvasHeight, "gameState" : me.config.gameState});
        $("#loaderCanvas").show();
        onResize(me);
        loadImages(me);

        EventBus.dispatch("setMute");

        var config = {"gameState" : me.config.gameState};
        me.score = new Score(config);
    };
    var loadImages = function(me){
        var _onImagesLoad= function(me){ onImagesLoad(me)};
        var manifest = [];

        if(me.config.gameState.currentLevel !== 7)
        {
            var splash = LoaderData[me.config.gameState.currentLevel+1];
            manifest.push({"src": splash.image, "id" : splash.id});
        }
        if(!me.config.gameState.level){
            me.config.gameState.level = true;
            var manifest = Manifest.level;
            me.config.loader.loadQueue(manifest, _onImagesLoad, me, me.config.gameState.currentLevel);
        }else{
            me.config.loader.loadQueue(manifest, _onImagesLoad, me, me.config.gameState.currentLevel);
        }


    };
    var onImagesLoad = function(me){
        /*if(me.config.gameState.currentLevel == 1){
            me.config.gameState.gs.points = 6;
        }*/
        drawBackGround(me);
        drawLane(me);
        drawStadium(me);
        EventBus.dispatch("showCommentary", me.levelConfig.waves.message);
        EventBus.dispatch("setScore", me.config.life);

        initShowMessage(me);
        generateWaves(me);
        showPowerup(me);
        EventBus.dispatch("setTickerStatus");

    };

    var initShowMessage = function(me){
        me.message = new createjs.Bitmap();
        me.message.x = 800;
        me.message.y = 1000;
        me.message.alpha = 0;
        me.config.stage.addChild(me.message);
    };
    var showGameMessage = function(me,msg){
        var text =msg.target
        console.log(text);
        showMessage(me,text);
    };

    var showMessage = function(me,text){
        me.message.image = me.config.loader.getResult(text);
        me.message.x = 800 - me.message.getBounds().width/2;
        createjs.Tween.get(me.message).to({alpha:1},100).wait(500).to({alpha:0},1000);
        //console.log("show");
    };

    var setCanvasAttributes = function(me){

        me.freeBottomAreaY = 70;
        me.freeLeftAreaX = 0;
        onResize(me);
        me.width =  1600;
        me.height = 1200;
        me.freeTopAreaY = me.height/2;
        //setDivPosition(me);

    };

    var onResize = function(me){
        var canvas = me.config.stage.canvas;
        me.canvasWidth = canvas.width = window.innerHeight *4/3>window.innerWidth ? window.innerWidth : window.innerHeight*4/3;
        me.canvasHeight = canvas.height = me.canvasWidth *3/4>window.innerHeight?window.innerHeight:me.canvasWidth *3/4;

        me.config.stage.scaleX = me.canvasWidth/1600;
        me.config.stage.scaleY = me.canvasHeight/1200;
        me.config.stage.update();
        var paddingTop = (window.innerHeight - me.canvasHeight)/2 > 0 ? (window.innerHeight - me.canvasHeight)/2 : 0 ;
        $("#myCanvas").css({top: paddingTop });
        $("#canvasHolder").css({top:me.canvasHeight+ paddingTop - $("#canvasHolder").height(), position:'absolute'});
    };


    var drawStadium=function(me){
        var width = 1600;
        me.stadium = new createjs.Container();
        me.seatContainer = new Blocks({"loader":me.config.loader,"width":width});
        var lc = me.seatContainer.drawLeftChairBlock();
        var rc= me.seatContainer.drawRightChairBlock();
        me.cbBox = new CommentaryBox({"loader":me.config.loader,"width":width});
        me.adBoard = new AdBoard({"loader":me.config.loader});
        me.adBoard.y = me.cbBox.getTransformedBounds().height-me.adBoard.getTransformedBounds().height/2-me.adBoard.getTransformedBounds().height/6;

        me.stadium.addChild(lc,rc,me.cbBox,me.adBoard);
        me.config.stage.addChild(me.stadium);
        drawTimeOut(me);

    };
    var drawBackGround = function(me){
        me.bgContainer = new createjs.Container();
        me.config.stage.addChild(me.bgContainer);
        var shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(me.config.loader.getResult("background"))
            .drawRect(0,0,me.width,me.height);
        //me.bgContainer.scaleX = me.width/800;
        //shape.scaleY = 0.5;
       // me.bgContainer.scaleY = me.height/600;
        me.bgContainer.addChild(shape);
        //container.scaleY =0.555;
    };
    var drawTimeOut = function(me){
        var mbtn = new createjs.Bitmap(me.config.loader.getResult("menu_btn_idle"));
        mbtn.x = mbtn.getTransformedBounds().width/4;
        mbtn.y = mbtn.getTransformedBounds().height/4;
        mbtn.addEventListener("mousedown",function(evt){
            evt.target.image = me.config.loader.getResult("menu_btn_click");
            evt.target.cursor = "pointer";
            EventBus.dispatch("showTimeoutScreen");
        });
        mbtn.addEventListener("mouseover",function(evt){
            evt.target.image = me.config.loader.getResult("menu_btn_over");
            evt.target.cursor = "pointer";
            me.config.stage.update();

        });
        mbtn.addEventListener("pressup",function(evt){
            evt.target.image = me.config.loader.getResult("menu_btn_idle");
            evt.target.cursor = "pointer";

        });
        mbtn.addEventListener("mouseout",function(evt){
            evt.target.image = me.config.loader.getResult("menu_btn_idle");
            evt.target.cursor = "pointer";

        });
        me.stadium.addChild(mbtn);

    };

    var showScore = function(me){
        me.scoreText = new createjs.Text("Total Score :"+me.score.getTotalScore(), "20px Arial", "#000000");
        me.scoreText.setTransform(me.width-300,10,1,1);
        me.config.stage.addChild(me.scoreText);
    };
    var updateScore = function(me){
        me.scoreText.text = "Total Score :"+ score.getTotalScore();
    };


    var getTime = function(me){
        var width = me.width - me.freeLeftAreaX- 300; //left lane area
        me.timeDelay = ((width/createjs.Ticker.getFPS()*1)- me.levelConfig.time) *1000;
        return me.timeDelay;
    };

    var generateWaves = function(me){
        me.waves = new Waves({"waves": me.levelConfig.waves,"lanesObj" : me.config.lanes, "lanes": me.levelConfig.lanes, "loader" : me.config.loader, "gameState" :me.config.gameState});
        me.waves.init();
        EventBus.dispatch("showPendingEnemies", me.waves.getPendingEnemies());
    };

    var killLife = function(me){
        me.config.life--;
        EventBus.dispatch("setScore",me.config.life);
       // var life = me.config.lifes.pop();
     //   me.config.stage.removeChild(life);
        if(me.config.life == 0){
           gameOver(me);
        }
    };


    var drawLane = function(me){
        var width = (me.width- me.freeLeftAreaX);
        var height = (me.height - me.freeTopAreaY-me.freeBottomAreaY);
        var totalLanes =  3 ;//me.levelConfig.lanes;
        var laneHeight = height/totalLanes;

        for(var i = 0; i< totalLanes ; i++){
            var laneId = i+1;
            var config = {"x":me.freeLeftAreaX, "y" : (laneHeight*i)+me.freeTopAreaY, "width": width, "height": laneHeight, "id" : laneId,
                "loader" : me.config.loader};
            var lane = new Lane(config);
            me.config.stage.addChild(lane);
            me.config.lanes.push(lane);

            if(!(me.levelConfig.lanes == 1 && (laneId == 1 || laneId == 3))){
                var captchaHolder = me.captchaProcessor.getCaptchaPlaceHolder(lane.getMaxCaptchaWidth(),lane.getHeight(), laneId);
                captchaHolder.x = lane.getCaptchaX();
                lane.addChild(captchaHolder);

            }
        }
        resetPlayers(me);

        var config = {"x":me.freeLeftAreaX, "y" : me.height-me.freeBottomAreaY, "width": width, "height": me.freeBottomAreaY, "id" : 4,
            "loader" : me.config.loader};
        var lane = new Lane(config);
        me.config.stage.addChild(lane);



    };


    var resumeGame = function (me) {
        me.captchaProcessor.showCaptchas();
        EventBus.dispatch("exitMenu");
        EventBus.dispatch("setTickerStatus");
        createjs.Ticker.addEventListener("tick", me.events.tick);
    };

    var pauseGame = function (me) {
        if(!createjs.Ticker.getPaused()){
            //me.captchaProcessor.hideCaptchas();
            EventBus.dispatch("setTickerStatus");
            EventBus.dispatch("showMenu");
        }
    };


    var showTimeoutScreen = function (me) {
        if(!createjs.Ticker.getPaused()){
            me.captchaProcessor.hideCaptchas();
            me.config.stage.update();
            EventBus.dispatch("setTickerStatus");
            EventBus.dispatch("showTimeout");
            EventBus.dispatch("setMute");

//            $(".ui-dialog").css({
//            '-webkit-transform': 'scale('+1+',' + me.height/600 + ')',
//            '-moz-transform'    : 'scale('+1+',' + me.height/600 + ')',
//            '-ms-transform'     : 'scale('+1+',' + me.height/600 + ')',
//            '-o-transform'      : 'scale('+1+',' + me.height/600 + ')',
//            'transform'         : 'scale('+1+',' + me.height/600 + ')'
//        });
        }
    } ;

    var killMe = function (me,actor) {
        var object = actor.target;
        me.config.stage.removeChild(object);
        if(object instanceof  sprites.Enemy){
            var index = me.config.enemies.indexOf(object);
            me.config.enemies.splice(index,1);
            updateLevelStatus(me,object);
        }else if(object instanceof sprites.SpriteMan){
            var index = me.config.players.indexOf(object);
            me.config.players.splice(index,1);
        }else if(object instanceof Gem){
            var index = me.config.gems.indexOf(object);
            me.config.gems.splice(index,1);
        }
    };

    var resetPlayers = function(me){
        for(var i = 0; i< me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            if(lane.player == undefined){
               setTimeout(addPlayer,1000,lane,me);
            }else{
                lane.player.setSpriteSheet(me.default_player);
//                var sf = getScaleFactor(lane,lane.player);
//                lane.player.setScale(sf,sf);
            }

        }
    };

    var addPlayer = function(lane,me){
        if(!(me.config.gameState.currentLevel == 1 && (lane.getLaneId() == 1 || lane.getLaneId() == 3))){
            var config = {"id": me.default_player, "loader" : me.config.loader, "laneId" : lane.getLaneId(),"gameState" : me.config.gameState };
            var player = new sprites.SpriteMan(config);
//            var sf = getScaleFactor(lane,player);
//            player.setScale(sf,sf);
            if(lane.player == undefined){
                lane.setPlayer(player);
                me.config.stage.addChild(player);
            }

        }



    };

    var activatePlayer = function(player, me){
        var powerup = me.config.activePowerup;
        if(powerup && player != undefined){
            player.addPowerups(me.config.activePowerup.getPower());
            me.config.activePowerup = undefined;
        }
        if(player != undefined){
            me.config.players.push(player);
            player.run();
        }


    };

    var resetGame = function (me) {

        removeAllEvents(me);
        removeAllChildren(me);

        me.config.players = [];
        me.config.enemies = [];
        me.config.gems = [];
        me.config.powerups = [];
        me.config.lanes = [];
        me.config.waves = [];
//        me.config.myPowerups = me.config.gameState.gs.inBag;
        me.config.activePowerup = undefined;
        me.passCount = 0;
        me.config.life = me.config.gameState.maxLife;
    
//        if(me.config.gameState.currentLevel == 1){
//            me.config.lifes = [];
//        }

    };
    
    var removeAllChildren = function(me){
        me.config.stage.removeAllChildren();
        me.config.stage.update();
    };

    var removeAllEvents = function(me){

    };

    var tick = function (me) {
        if(!createjs.Ticker.getPaused()){
            me.config.stage.update();
            hitTest(me);
        }
    };

    var hitTest = function(me){
        if(me.config.players != undefined && me.config.players.length != 0){
            for(var i= 0 ; i< me.config.players.length ; i++){
                var player = me.config.players[i];
                if(player.hit == true) continue;
                var enemy = hitTestEnemies(player,me);
                var powerup = hitTestPowerups(player,me);
                if(enemy != null && player.hit == false && enemy.hit == false){

                    if(player.singleHit){
                        var hitList = player.hitEnemies;
                        if(hitList.indexOf(enemy.id) == -1){
                            player.hitEnemies.push(enemy.id);
                            enemy.kill();
                        }

                        
                    }else{
                        player.kill();
                        enemy.kill();
                    }
                }

                if(powerup != null && player.hitPowerup == false && powerup.hit == false){
                    addToMyBag(me, powerup);
                    player.hitPowerup = false;
                    updateLevelStatus(me,powerup);
                }
            }
        }

    };

    var hitTestEnemies = function(player,me){
        if(me.config.enemies.length != 0){
            for(var i = 0; i< me.config.enemies.length ; i++){
                var enemy = me.config.enemies[i];
                if(enemy.hit == true || player.getLaneId() != enemy.getLaneId()) continue;
                //if(enemy.hit == true) continue;
                var hit = isCollision(player,enemy);
                if(hit){
                    return enemy;
                }
            }
        }
    };
    var hitTestPowerups = function(player,me){
        if(me.config.powerups.length != 0){
            for(var i = 0; i< me.config.powerups.length ; i++){
                var powerup = me.config.powerups[i];
                if(powerup.getLaneId() != player.getLaneId()) continue;
                var hit = isCollisionPowerup(player,powerup);
                if(hit){
                    return powerup;
                }
            }
        }
    };
    var isCollisionPowerup = function(player, object){
        return (object.x <= player.x + player.getWidth() &&
            player.x <= object.x + object.getWidth());
    };


    var isCollision = function(player, object){
        return (object.x <= player.x + player.getWidth() &&
            player.x <= object.x + object.getWidth() &&
            object.y <= player.y + player.getHeight()  &&
            player.y <= object.y +object.getHeight())
    };

    var compareCaptcha = function(me) {

        var output = me.captchaProcessor.compare();

        if(output.cheated){
            EventBus.dispatch("showCommentary", output.message);
            showMap(me);
        }else{
            showMessage(me, output.message);
            if (output.pass) {
                if (me.config.activePowerup != undefined) {
                    me.config.myBag.removeFromBag(me.config.activePowerup);
                }
                if (me.config.activePowerup != null && me.config.activePowerup.getId() == "bullhorn") {
                    startPlayersFromAllLanes(me);
                } else {
                    var lane = getLaneById(output.laneId, me);
                    activatePlayer(lane.player, me);
                    if(output.extraDamage){
                        lane.player.life = me.config.gameState.gs.extraDamage;
                    }
                    lane.player = undefined;
                }
                resetPlayers(me);
            } else{
                for(var i=0; i<me.config.lanes.length; i++){
                    var lane = me.config.lanes[i];
                    if(lane.player){
                        lane.player.jump();
                    }


                }
            }
        }


    };
    var startPlayersFromAllLanes = function(me){
        for(var i=0; i<me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            activatePlayer(lane.player, me);
            lane.player = undefined;
        }
    };
    var setTickerStatus = function(){
        createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    };

    var updateLevelStatus = function(me, object){
        var type = "";
        if(object instanceof sprites.Enemy) type = "enemy";
        me.waves.update(object.getWaveId(), object.onKillPush(), type);
        var enemyCount =  me.config.enemies.length;
        var powerupCount = me.config.powerups.length;
        if(enemyCount == 0 && powerupCount == 0){
            waitForForcePush(me,object.getWaveId());
        }
        if(me.waves.getStatus() && enemyCount == 0){
            updateLevel(me);
        }
    };
    var waitForForcePush = function(me,waveId){
        setTimeout(function(){
            if(me.config.enemies.length == 0){
                EventBus.dispatch("forcePush",waveId);
            }
        },2000);
    };
    var updateLevel = function(me){

        me.score.addGameLevelPoints(me.config.life);

        me.config.gameState.currentLevel++;
        if(me.config.gameState.currentLevel>me.config.gameState.gs.maxLevel){
            me.config.gameState.gs.maxLevel = me.config.gameState.currentLevel;
        }
        me.config.gameState.currentState = me.config.gameState.states.GAME_OVER;
        showMap(me);
    };

    var showMap = function(me){
        me.waves.clearAll();
        me.waves = null;
        setTimeout(function(){EventBus.dispatch("setTickerStatus");EventBus.dispatch("showMap");EventBus.dispatch("setMute");},2000);
    };
    var gameOver = function(me){
        me.config.gameState.currentState = me.config.gameState.states.GAME_OVER;
        var store = new LocalStorage();
        store.reset();
        me.config.gameState.reset();
        EventBus.dispatch("showCommentary", "Game Over");
        showMap(me);
    };
    
    var pushEnemy = function(me,enemy){
        EventBus.dispatch("showPendingEnemies", me.waves.getPendingEnemies());
        setEnemyProperties(me,enemy);
        me.config.stage.addChild(enemy);
        me.config.enemies.push(enemy);
    };

    var setEnemyProperties  = function(me,enemy){
        var lane = getLaneById(enemy.getLaneId(), me); //enemy.getLaneId();
//        var sf = getScaleFactor(lane,enemy);
//        enemy.setScale(sf,sf);
        var start = lane.getEndPoint();
        var end = lane.getEnemyEndPoint();
        enemy.setPosition(start.x, start.y);
        enemy.setEndPoint(end.x);
        enemy.run();

    };
    var getLaneById = function(id, me){
        for(var i = 0 ; i< me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            if(lane.getLaneId() == id){
                return lane;
            }
        }
        return null;
    };
    var pushPowerup = function(me,powerup){
        setPowerupProperties(me,powerup);
        me.config.stage.addChild(powerup);
        me.config.powerups.push(powerup);
    };

    var setPowerupProperties  = function(me,powerup){
        var lane = getLaneById(powerup.getLaneId(), me); //enemy.getLaneId();
//        var sf = getScaleFactor(lane,powerup);
//        powerup.setScale(sf,sf);
        var powerupPos = lane.getPowerupPosition();
        powerup.setPosition(powerupPos.x,powerupPos.y);
        powerup.run();

    };

    var showPowerup = function(me){
        var powerupContainer = new createjs.Container();
        var x = 10 ;
        var y = 10;
        var padding = 5;
        for(var i=0;i<me.config.myBag.myBag.length;i++){
            var powerup = me.config.myBag.myBag[i];
            powerupContainer.addChild(powerup);
            powerup.reset();
            x = x + powerup.getWidth() + padding;
            powerup.setPosition(x,y);
        }
        powerupContainer.x = me.cbBox.x + powerupContainer.getTransformedBounds().width/2;
        me.stadium.addChild(powerupContainer);

    };
    var addToMyBag = function(me, powerup){
        var index = me.config.powerups.indexOf(powerup);
        me.config.powerups.splice(index,1);
        me.config.myBag.addToBagFromField(powerup);
        me.config.stage.removeChild(powerup);
    };

    var unselectAllInBag = function(me){
       me.config.myBag.unselectAll();
        me.config.activePowerup=undefined;
        updatePlayerOnPowerup(me,"player_normal")
    };
    var selectPowerUp = function(me,mypowerup){
        me.config.activePowerup = mypowerup;
        updatePlayerOnPowerup(me,"man1")
    };

    var updatePlayerOnPowerup = function(me, playerId){

        for(var i = 0 ; i<me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            var player = lane.player;
            if(player != undefined){
                player.setSpriteSheet(playerId);
//                var sf = getScaleFactor(lane, player);
//                player.setScale(sf,sf);

            }
        }
    };

    var changeLane = function(me,enemy){
        var laneId = newLaneId(enemy.getLaneId(), me);
        var lane = getLaneById(laneId,me);
        var endPoint = lane.getEnemyEndPoint();
        enemy.setLaneId(laneId);
        createjs.Tween.get(enemy).to({y:endPoint.y},2000);

    };

    var newLaneId = function(currentLaneId, me){
        var laneId;
        do{
            laneId = Math.floor(Math.random()*3)+1
        }while(laneId == currentLaneId);
        return laneId;
    };
    var persist = function(me){

    }


}