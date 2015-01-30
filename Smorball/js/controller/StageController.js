function StageController(config) {
    this.config = config || {};
    this.events = {};
    StageController.prototype.init = function () {
        setCanvasAttributes(this);
        this.config.stage = new createjs.Stage("myCanvas");
        createjs.Ticker.setFPS(20);
        var me = this;
        sc = this;
        this.events.tick = function(){tick(me);}
        createjs.Ticker.addEventListener("tick", this.events.tick);
        createjs.Ticker.setPaused(true);

        loadEvents(this);
        this.currentIndex=0;
        this.default_player = "player_normal";

    }


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

        var pe = function(object){pushEnemy(me, object.target)}
        EventBus.addEventListener("pushEnemy", pe);

        var pp = function(object){pushPowerup(me, object.target)}
        EventBus.addEventListener("pushPowerup", pp);

        var pg = function(){showTimeoutScreen(me)};
        EventBus.addEventListener("showTimeoutScreen", pg);

        var sm = function(text){showGameMessage(me,text)};
        EventBus.addEventListener("showMessage",sm);


        var cc = function(){compareCaptcha(me)};
        EventBus.addEventListener("compareCaptcha", cc);

        var st = function(){setTickerStatus()};
        EventBus.addEventListener("setTickerStatus",st);

        var ab = function(ob){addToMyPowerups(me, ob)}
        EventBus.addEventListener("addToMyPowerups", ab);

        var rb = function(ob){activatePowerup(me, ob.target)}
        EventBus.addEventListener("activatePowerup", rb);

        var cl = function(ob){changeLane(me, ob.target)}
        EventBus.addEventListener("changeLane", cl);

    }

    var newGame = function (me) {
        $("#inputText").val("");
        //$('#myDiv').remove();
        resetGame(me);

        me.config.gameState.gs.currentState = me.config.gameState.gs.States.RUN;
        me.levelConfig = LevelData[me.config.gameState.gs.currentLevel];
        me.time = 0;
        me.captchaProcessor = new CaptchaProcessor({"loader": me.config.loader, "canvasWidth": me.width, "canvasHeight": me.height, "gameState" : me.config.gameState});
        $("#loaderCanvas").show();
        loadImages(me);
    }
    var loadImages = function(me){
        var _onImagesLoad= function(me){ onImagesLoad(me)};
        var manifest;
        if(me.config.gameState.gs.currentLevel == 1)
            var manifest = Manifest.level1;
         else
            manifest = [];
         
        if(me.config.gameState.gs.currentLevel !== 7)
        {
            var splash = LoaderData[me.config.gameState.gs.currentLevel+1];
            manifest.push({"src": splash.image, "id" : splash.id});
        }
        me.config.loader.loadQueue(manifest, _onImagesLoad, me, me.config.gameState.gs.currentLevel);

    }
    var onImagesLoad = function(me){
        if(me.config.gameState.gs.currentLevel == 1){
            me.config.gameState.gs.points = 0;
        }
        drawBackGround(me);
        drawStadium(me);
        EventBus.dispatch("showCommentary", me.levelConfig.waves.message);
        drawLane(me);
        initShowMessage(me);

        generateWaves(me);
        EventBus.dispatch("setTickerStatus");

    }

    var initShowMessage = function(me){
        me.message = new createjs.Text();
        me.message.x = me.config.stage.canvas.width/2- me.message.getMeasuredWidth();
        me.message.y = me.config.stage.canvas.height/2+ me.config.lanes[0].getTransformedBounds().height ;
        me.message.alpha = 0;
        me.config.stage.addChild(me.message);
    }
    var showGameMessage = function(me,msg){
        var text =msg.target
        console.log(text);
        showMessage(me,text);
    }

    var showMessage = function(me,text){
        me.message.text = text;
        me.message.font = "bold 50px Arial";
        me.message.color = "#000";
        createjs.Tween.get(me.message).to({alpha:0.4},1000).wait(1000).to({alpha:0},1000);
        console.log("show");
    }
    
    var showInformation = function(me, text){
        if(text.target) {
          // me.infoAry.push(text.target);
        }            
    };
        
    var initShowInformation = function(me, speech) {
        me.info = new createjs.Text();
        me.info.text = "Jujubees, is coming!";
        me.info.font = "bold 10px Arial";
        me.info.color = "black";
        me.info.alpha = 1;
        me.info.x = speech.getTransformedBounds().x + 10;
        me.info.y = speech.getTransformedBounds().y + 10;
        me.info.lineWidth = speech.getTransformedBounds().width - 15;
        me.scoreContainer.addChild(me.info);
        createjs.Tween.get(me.info).wait(5000);
        me.infoAry = [];
    };
    
    var startInformationTimer = function(me) {
        setInterval(function() {
           var txt = me.infoAry.pop();
           console.log(txt);
           if (txt){
              me.info.text = txt; 
              createjs.Tween.get(me.info).wait(5000);
           }
        }, 5000); 
    };
    
    var showGameOverMessage = function(me,text){
        me.message.text = text;
        createjs.Tween.get(me.message).to({alpha:0.4},1000).wait(1000).to({alpha:0},1000).wait(100)
            .call(function(){
                EventBus.dispatch("setTickerStatus");
                EventBus.dispatch("showMenu");
            });
    }

    var setCanvasAttributes = function(me){

        me.freeBottomAreaY = 35;
        me.freeLeftAreaX = 0;
        var canvas = document.getElementById("myCanvas");
        me.width  = canvas.width =  window.innerWidth;
        me.height = canvas.height =  window.innerHeight;
        me.freeTopAreaY = me.height/2;
        //setDivPosition(me);

    }


    var drawStadium=function(me){
        var width = 800;
        me.stadium = new createjs.Container();
        me.seatContainer = new Blocks({"loader":me.config.loader,"width":width});
        var lc = me.seatContainer.drawLeftChairBlock();
        var rc= me.seatContainer.drawRightChairBlock();
        me.cbBox = new CommentaryBox({"loader":me.config.loader,"width":width});
        me.adBoard = new AdBoard({"loader":me.config.loader});
        me.adBoard.y = me.cbBox.getTransformedBounds().height-me.adBoard.getTransformedBounds().height/2-me.adBoard.getTransformedBounds().height/6;

        me.stadium.addChild(lc,rc,me.cbBox,me.adBoard);
        me.stadium.scaleX = me.width/800;
        me.stadium.scaleY = me.height/600;
        me.config.stage.addChild(me.stadium);

    }
    var drawBackGround = function(me){
        me.bgContainer = new createjs.Container();
        me.config.stage.addChild(me.bgContainer);
        var shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(me.config.loader.getResult("background"))
            .drawRect(0,0,me.width,me.height);
        //me.bgContainer.scaleX = me.width/800;
        shape.scaleY = 0.5;
        me.bgContainer.scaleY = me.height/600;
        me.bgContainer.addChild(shape);
        //container.scaleY =0.555;
    }

    var showScore = function(me){
        me.scoreText = new createjs.Text("Total Score :"+me.config.gameState.gs.points, "20px Arial", "#000000");
        me.scoreText.setTransform(me.width-500,10,1,1);
        me.config.stage.addChild(me.scoreText);
    }
    var updateScore = function(me){
        me.scoreText.text = "Total Score :"+me.config.gameState.gs.points;
    }


    var getTime = function(me){
        var width = me.width - me.freeLeftAreaX- 300; //left lane area
        me.timeDelay = ((width/createjs.Ticker.getFPS()*1)- me.levelConfig.time) *1000;
        return me.timeDelay;
    }

    var generateWaves = function(me){
        me.waves = new Waves({"waves": me.levelConfig.waves,"lanes": me.levelConfig.lanes, "loader" : me.config.loader, "gameState" :me.config.gameState});
        me.waves.init();
    }


    var getScaleFactor = function(lane,ob){
        var laneHeight = lane.getHeight()+ lane.getHeight()/2;
        var obHeight = ob.getHeight();
        var scaleFactor = 1;
        if(laneHeight/obHeight < 1){
            scaleFactor = laneHeight/obHeight;
        }
        return scaleFactor;
    }



    var showLife = function(me){
        var x = me.width-10;
        var y = 10;
        var padding = 5;
        for(var i= 0; i< me.config.gameState.gs.life; i++){
            var life = new Life(me.config.loader);
            x = x- life.getWidth()- padding;
            life.setPosition(x, y);
            me.config.stage.addChild(life);
            me.config.lifes.push(life);
        }
    }

    var killLife = function(me){
        var life = me.config.lifes.pop();
        me.config.stage.removeChild(life);
        if(--me.config.gameState.gs.life == 0){
            me.config.gameState.gs.currentState = me.config.gameState.gs.States.GAME_OVER;
            me.config.gameState.gs.currentLevel = 1;
            showGameOverMessage(me,"Game Over")
        }
    }


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



    }


    var resumeGame = function (me) {
        me.captchaProcessor.showCaptchas();
        EventBus.dispatch("exitMenu");
        EventBus.dispatch("setTickerStatus");
        createjs.Ticker.addEventListener("tick", me.events.tick);
    }

    var pauseGame = function (me) {
        if(!createjs.Ticker.getPaused()){
            //me.captchaProcessor.hideCaptchas();
            EventBus.dispatch("setTickerStatus");
            EventBus.dispatch("showMenu");
        }
    }


    var showTimeoutScreen = function (me) {
        if(!createjs.Ticker.getPaused()){
            me.captchaProcessor.hideCaptchas();
            me.config.stage.update();
            EventBus.dispatch("setTickerStatus");
            EventBus.dispatch("showTimeout");
//            $(".ui-dialog").css({
//            '-webkit-transform': 'scale('+1+',' + me.height/600 + ')',
//            '-moz-transform'    : 'scale('+1+',' + me.height/600 + ')',
//            '-ms-transform'     : 'scale('+1+',' + me.height/600 + ')',
//            '-o-transform'      : 'scale('+1+',' + me.height/600 + ')',
//            'transform'         : 'scale('+1+',' + me.height/600 + ')'
//        });
        }
    }  

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
    }

    var resetPlayers = function(me){
        for(var i = 0; i< me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            if(lane.player == undefined){
               setTimeout(addPlayer,1000,lane,me);
            }else{
                lane.player.setSpriteSheet(me.default_player);
                var sf = getScaleFactor(lane,lane.player);
                lane.player.setScale(sf,sf);
            }

        }
    }

    var addPlayer = function(lane,me){
        if(!(me.config.gameState.gs.currentLevel == 1 && (lane.getLaneId() == 1 || lane.getLaneId() == 3))){
            var config = {"id": me.default_player, "loader" : me.config.loader, "laneId" : lane.getLaneId(),"gameState" : me.config.gameState };
            var player = new sprites.SpriteMan(config);
            var sf = getScaleFactor(lane,player);
            player.setScale(sf,sf);
            if(lane.player == undefined){
                lane.setPlayer(player);
                me.config.stage.addChild(player);
            }

        }



    }

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


    }

    StageController.prototype.addEnemy = function(x,y, life){
        var config = {"id": "boss", "life": life, "loader" : this.config.loader}
        var enemy = new sprites.Enemy(config);
        this.config.enemies.push(enemy);
        enemy.setPosition(x,y);
        this.config.stage.addChild(enemy);
        enemy.run();
        return enemy;
    }

    var resetGame = function (me) {

        removeAllEvents(me);
        removeAllChildren(me);

        me.config.players = [];
        me.config.enemies = [];
        me.config.gems = [];
        me.config.powerups = [];
        me.config.lanes = [];
        me.config.waves = [];
        me.config.myPowerups = [];
        me.config.activePowerup = undefined;
        me.passCount = 0;

        if(me.config.gameState.gs.currentLevel == 1){
            me.config.lifes = [];
            me.config.gameState.gs.life = 6;
        }

    }

    var removeAllChildren = function(me){
        me.config.stage.removeAllChildren();
        me.config.stage.update();
    }

    var removeAllEvents = function(me){

    }

    var tick = function (me) {
        if(!createjs.Ticker.getPaused()){
            me.config.stage.update();
            hitTest(me);
        }
    }

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
                    addToMyPowerups(me, powerup);
                    player.hitPowerup = false;
                    updateLevelStatus(me,powerup);
                }
            }
        }

    }

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
    }
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
    }
    var isCollisionPowerup = function(player, object){
        return (object.x <= player.x + player.getWidth() &&
            player.x <= object.x + object.getWidth());
    }


    var isCollision = function(player, object){
        return (object.x <= player.x + player.getWidth() &&
            player.x <= object.x + object.getWidth() &&
            object.y <= player.y + player.getHeight()  &&
            player.y <= object.y +object.getHeight())
    }

    var compareCaptcha = function(me){

        var output = me.captchaProcessor.compare();
        showMessage(me, output.message);
        if(output.pass){
            if(me.config.activePowerup != null && me.config.activePowerup.getId() == "amber"){
                  startPlayersFromAllLanes(me);
            }else{
                var lane = getLaneById(output.laneId, me);
                activatePlayer(lane.player, me);
                lane.player = undefined;
            }
            resetPlayers(me);
        }

    }
    var startPlayersFromAllLanes = function(me){
        for(var i=0; i<me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            activatePlayer(lane.player, me);
            lane.player = undefined;
        }
    }
    var setTickerStatus = function(){
        createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    }

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
    }
    var waitForForcePush = function(me,waveId){
        setTimeout(function(){
            if(me.config.enemies.length == 0){
                EventBus.dispatch("forcePush",waveId);
            }
        },2000);
    }

    var updateLevel = function(me){
        me.config.gameState.gs.currentLevel++;
        if(me.config.gameState.gs.currentLevel>me.config.gameState.gs.maxLevel){
            me.config.gameState.gs.maxLevel = me.config.gameState.gs.currentLevel;
        }
        me.config.gameState.gs.currentState = me.config.gameState.gs.States.GAME_OVER;
        showMessage(me,"Level Completed !!");
        me.config.gameState.gs.points += me.config.gameState.gs.life;
        me.config.gameState.gs.gameLevelPoints.push(me.config.gameState.gs.life);
        setTimeout(function(){EventBus.dispatch("setTickerStatus");EventBus.dispatch("showMap");},3000); //TODO : change
    }

    var pushEnemy = function(me,enemy){
        EventBus.dispatch("showPendingEnemies", me.waves.getPendingEnemies());
        setEnemyProperties(me,enemy);
        me.config.stage.addChild(enemy);
        me.config.enemies.push(enemy);
    }

    var setEnemyProperties  = function(me,enemy){
        var lane = getLaneById(enemy.getLaneId(), me); //enemy.getLaneId();
        var sf = getScaleFactor(lane,enemy);
        enemy.setScale(sf,sf);
        var start = lane.getEndPoint();
        var end = lane.getEnemyEndPoint();
        enemy.setPosition(start.x, start.y);
        enemy.setEndPoint(end.x);
        enemy.run();

    }
    var getLaneById = function(id, me){
        for(var i = 0 ; i< me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            if(lane.getLaneId() == id){
                return lane;
            }
        }
        return null;
    }
    var pushPowerup = function(me,powerup){
        setPowerupProperties(me,powerup);
        me.config.stage.addChild(powerup);
        me.config.powerups.push(powerup);
    }

    var setPowerupProperties  = function(me,powerup){
        var lane = getLaneById(powerup.getLaneId(), me);; //enemy.getLaneId();
        var sf = getScaleFactor(lane,powerup);
        powerup.setScale(sf,sf);
        var powerupPos = lane.getPowerupPosition();
        powerup.setPosition(powerupPos.x,powerupPos.y);
        powerup.run();

    }

    var addToMyPowerups = function(me,powerup){
        var index = me.config.powerups.indexOf(powerup);
        me.config.powerups.splice(index,1);
        me.config.myPowerups.push(powerup);
        powerup.addActivation();
        powerup.stand();
        updateMyPowerups(me);
    }
    var activatePowerup = function(me,powerup){
        if(me.config.activePowerup != undefined){
            me.config.myPowerups.push(me.config.activePowerup);
            me.config.stage.addChild(me.config.activePowerup);
        }
        me.config.activePowerup = powerup;
        var index = me.config.myPowerups.indexOf(powerup);
        me.config.myPowerups.splice(index,1);
        me.config.stage.removeChild(powerup);
        updateMyPowerups(me);
        updatePlayerOnPowerup(me, powerup.getPowerupPlayer());
    }
    var updateMyPowerups = function(me){
        var x = 0;
        var y = 20;
        var padding = 5;
        for(var i=0; i<me.config.myPowerups.length; i++){
            var powerup = me.config.myPowerups[i];
            x = x + powerup.getWidth() + padding;
            powerup.setPosition(x,y);
            console.log(powerup);
        }
    }

    var updatePlayerOnPowerup = function(me, playerId){

        for(var i = 0 ; i<me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            var player = lane.player;
            if(player != undefined){
                player.setSpriteSheet(playerId);
                var sf = getScaleFactor(lane, player);
                player.setScale(sf,sf);

            }
        }
    }

    var changeLane = function(me,enemy){
        var laneId = newLaneId(enemy.getLaneId(), me);
        var lane = getLaneById(laneId,me);
        var endPoint = lane.getEnemyEndPoint();
        enemy.setLaneId(laneId);
        createjs.Tween.get(enemy).to({y:endPoint.y},2000);

    }

    var newLaneId = function(currentLaneId, me){
        var laneId;
        do{
            laneId = Math.floor(Math.random()*3)+1
        }while(laneId == currentLaneId);
        return laneId;
    }





}