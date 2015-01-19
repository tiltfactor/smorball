function StageController(config) {
    this.config = config || {};
    this.events = {};
    StageController.prototype.init = function () {
        setCanvasAttributes(this);
        this.config.stage = new createjs.Stage("myCanvas");
        createjs.Ticker.setFPS(20);
        var me = this;
        this.events.tick = function(){tick(me);}
        createjs.Ticker.addEventListener("tick", this.events.tick);
        createjs.Ticker.setPaused(true);

        loadEvents(this);
        this.currentIndex=0;

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

//        var rt = function() {resetTimer(me)};
//        EventBus.addEventListener("resetTimer", rt);
//
//        var ct = function() {clearTimer(me)};
//        EventBus.addEventListener("clearTimer", ct);
        var sm = function(text){showGameMessage(me,text)};
        EventBus.addEventListener("showMessage",sm);

        var cc = function(){compareCaptcha(me)};
        EventBus.addEventListener("compareCaptcha", cc);

        var st = function(){setTickerStatus()};
        EventBus.addEventListener("setTickerStatus",st);

    }

    var initShowMessage = function(me){
        me.message = new createjs.Text();
        me.message.x = me.config.stage.canvas.width/2- me.message.getMeasuredWidth()/2;
        me.message.y = me.config.stage.canvas.height/2 - 50;
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


    var newGame = function (me) {
        $("#inputText").val("");
        resetGame(me);

        me.config.gameState.gs.currentState = me.config.gameState.gs.States.RUN;
        me.levelConfig = Levels[me.config.gameState.gs.currentLevel];
        me.time = 0;
        me.captchaProcessor = new CaptchaProcessor({"loader": me.config.loader, "canvasWidth": me.width, "canvasHeight": me.height, "gameState" : me.config.gameState});
        loadImages(me);



    }
    var loadImages = function(me){
        var _onImagesLoad= function(me){ onImagesLoad(me)};
        var manifest;
        if(me.config.gameState.gs.currentLevel == 1)
            var manifest = Manifest.level1;
        else
            manifest = [];

        me.config.loader.loadQueue(manifest, _onImagesLoad, me);
    }
    var onImagesLoad = function(me){
        if(me.config.gameState.gs.currentLevel == 1){
            me.config.gameState.gs.points = 0;
        }
        drawBackGround(me);
        drawScoreBoard(me);
        drawChairs(me);
        drawLane(me);

        drawAdBoards(me);
        //drawWall(me);

        // showLife(me);
        // showScore(me);
        initShowMessage(me);
        generateWaves(me);
        //startTimer(me);
//        initShowMessage(me);
        EventBus.dispatch("setTickerStatus");

        //setTimeout(function(){showMessage(me,"Jujubees coming!!!");},2000); //TODO : change
    }
    var drawBackGround = function(me){
        me.bgContainer = new createjs.Container();
        me.config.stage.addChild(me.bgContainer);
        var shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(me.config.loader.getResult("background"))
            .drawRect(0,0,me.width,me.height);
        //me.bgContainer.scaleX = me.width/800;
        me.bgContainer.scaleY = 0.5;
        me.bgContainer.addChild(shape);
        //container.scaleY =0.555;
    }
    var drawScoreBoard = function(me){
        me.scoreContainer = new createjs.Container();
        me.config.stage.addChild(me.scoreContainer);
        var score = new createjs.Bitmap(me.config.loader.getResult("score"));
        score.regX = score.getTransformedBounds().width/2;
        score.y = 5;
        score.scaleX = 0.5;
        score.scaleY = 0.5;
        me.scoreContainer.addChild(score);
        var cmtBox = new createjs.Bitmap(me.config.loader.getResult("cmt"));
        cmtBox.regX = cmtBox.getTransformedBounds().width/2;
        cmtBox.scaleX = 0.5;
        cmtBox.scaleY = 0.5;
        cmtBox.y = score.getTransformedBounds().height;

        drawSpeakers(me,cmtBox,score);

        var speech = new createjs.Bitmap(me.config.loader.getResult("speech"));
        speech.regX = speech.getTransformedBounds().width/2;
        speech.y = cmtBox.getTransformedBounds().height/2+speech.getTransformedBounds().height/4;
        speech.scaleX = 0.5;
        speech.scaleY = 0.5;

        me.scoreContainer.addChild(cmtBox,speech );
        me.scoreContainer.x =me.width/2;

        me.scoreContainer.scaleX = me.width/800;
        me.scoreContainer.scaleY = me.height/600;
    }
    var drawSpeakers = function(me,cmtBox,score){

        for(var i=0;i<2;i++){
            var speakerContainer = new createjs.Container();
            var speaker = new createjs.Bitmap(me.config.loader.getResult("speaker"));
            var pole = new createjs.Bitmap(me.config.loader.getResult("pole"));
            pole.scaleX = 0.5;
            pole.scaleY = 0.5;
            speaker.regX = speaker.getTransformedBounds().width/2;
            speaker.scaleX = 0.5*(Math.pow(-1,i));
            speaker.scaleY = 0.5;
            speaker.x = me.scoreContainer.x+(Math.pow(-1,i))*((cmtBox.getTransformedBounds().width/2)+(speaker.getTransformedBounds().width/2));
            speaker.y = score.getTransformedBounds().height+(score.getTransformedBounds().height/2);
            pole.x = speaker.x-speaker.getTransformedBounds().width/2+20;
            pole.y = speaker.y+speaker.getTransformedBounds().height/2;
            speakerContainer.addChild(pole,speaker);
            speakerContainer.y=-5;
            me.scoreContainer.addChild(speakerContainer);
        }

    }
    var drawChairs= function(me){
        me.seatContainer1 = new createjs.Container();
        me.seatContainer2 = new createjs.Container();
        me.config.stage.addChild(me.seatContainer1,me.seatContainer2);

        var x,y=80,w=0;
        for(var i=0;i<5;i++){
            var ty = y+(i*30);
            if(i%2==0){
                x=-25;
            }else{
                x=0;
            }
            var seat = createSeats(x,ty,me);
            me.seatContainer1.addChild(seat);
            w = seat.getTransformedBounds().width+x;
            for(var j=0;j<4;j++){
                seat = createSeats(w,ty,me);
                me.seatContainer1.addChild(seat);
                w = w+ seat.getTransformedBounds().width;
            }

        }

        me.seatContainer2.x= me.scoreContainer.x+(me.scoreContainer.getTransformedBounds().width/2)-seat.getTransformedBounds().width/2;

        for(var i=0;i<5;i++){
            var ty = y+(i*30);
            if(i%2==0){
                x=25;
            }else{
                x=0;
            }
            seat = createSeats(x,ty,me);
            me.seatContainer2.addChild(seat);
            w = seat.getTransformedBounds().width+x;
            for(var j=0;j<4;j++){
                var seat = createSeats(w,ty,me);
                me.seatContainer2.addChild(seat);
                w = w+ seat.getTransformedBounds().width;
            }

        }

        me.seatContainer1.scaleX = me.width/800;
        me.seatContainer2.scaleX = me.width/800;
        me.seatContainer1.scaleY = me.height/600;
        me.seatContainer2.scaleY = me.height/600;
    }
    var createSeats=function (x,y,me){
        var seat = new createjs.Bitmap(me.config.loader.getResult("seat"));
        seat.setTransform(x,y,0.5,0.5);
        seat.point={"x":seat.x,"y":seat.y};
        return seat;

    }
    var drawAdBoards = function(me){
        me.adBoardContainer = new createjs.Container();
        me.config.stage.addChild(me.adBoardContainer);
        var ad = new createjs.Bitmap(me.config.loader.getResult("ad"));
        ad.scaleX=0.5;
        ad.scaleY=0.5;
        me.adBoardContainer.addChild(ad);
        var ad = new createjs.Bitmap(me.config.loader.getResult("ad"));
        ad.scaleX=0.5;
        ad.scaleY=0.5;

        var w = me.adBoardContainer.x+ad.getTransformedBounds().width;
        ad.x = w;
        me.adBoardContainer.addChild(ad);
        var ad = new createjs.Bitmap(me.config.loader.getResult("ad"));
        ad.scaleX=0.5;
        ad.scaleY=0.5;
        var w = w + ad.getTransformedBounds().width;
        ad.x = w;
        me.adBoardContainer.addChild(ad);

        me.adBoardContainer.y = me.seatContainer1.getTransformedBounds().y + me.seatContainer1.getTransformedBounds().height -45;


        me.adBoardContainer.scaleX = me.width/800;

        me.adBoardContainer.scaleY = me.height/600;
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
        me.waves = new Waves({"waves": me.levelConfig.waves,"lanes": me.levelConfig.lanes, "loader" : me.config.loader});
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

            var captchaHolder = me.captchaProcessor.getCaptchaPlaceHolder(lane.getMaxCaptchaWidth(),lane.getHeight(), laneId);
            lane.addChild(captchaHolder);


            //loadCaptcha(me,lane);
        }

        var config = {"x":me.freeLeftAreaX, "y" : me.height-me.freeBottomAreaY, "width": width, "height": me.freeBottomAreaY, "id" : 4,
            "loader" : me.config.loader};
        var lane = new Lane(config);
        me.config.stage.addChild(lane);



    }


    var resumeGame = function (me) {
        EventBus.dispatch("exitMenu");
        EventBus.dispatch("setTickerStatus");
        createjs.Ticker.addEventListener("tick", me.events.tick);
    }

    var pauseGame = function (me) {
        if(!createjs.Ticker.getPaused()){
            EventBus.dispatch("setTickerStatus");
            EventBus.dispatch("showMenu");
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

    StageController.prototype.addPlayer = function(lane){
        var config = {"id": "player_normal", "loader" : this.config.loader, "laneId" : lane.getLaneId() }
        var player = new sprites.SpriteMan(config);
        this.config.players.push(player);
        var sf = getScaleFactor(lane,player);
        player.setScale(sf,sf);
        var start = lane.getStartPoint();
        var end = lane.getEndPoint();
        player.setPosition(start.x, start.y);
        player.setEndPoint(end.x);
        this.config.stage.addChild(player);
        player.run();
        return player;
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

    var createPlayer = function (me) {

        for(var i = 0; i < me.config.lanes.length; i++){
            var start = me.config.lanes[i].getStartPoint();
            var end = me.config.lanes[i].getEndPoint();
            var player = me.addPlayer(start.x,start.y);
            player.setSpeed(i+1);
            player.setEndPoint(end.x);

            if(i == 1) continue;
            var start = me.config.lanes[i].getEndPoint();
            var end = me.config.lanes[i].getEnemyEndPoint();

            var enemy = me.addEnemy(start.x,start.y,2);
            enemy.setSpeed(i+1);
            enemy.setEndPoint(end.x);

            //break;
        }

        var gem = new Gem(me.config.loader);
        gem.setPosition(600, 150);
        me.config.gems.push(gem);


        me.config.stage.addChild( gem);


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
                    player.kill();
                    player.hit = true;
                    enemy.kill();

                }
                /*if(gem != null){
                 gem.kill();
                 }*/
                if(powerup != null && player.hitPowerup == false && powerup.hit == false){
                    player.hitPowerup = true;
                    var index = me.config.powerups.indexOf(powerup);
                    me.config.powerups.splice(index,1);
                    me.config.myPowerups.push(powerup);
                    showMyPowerups(me);
                    updateLevelStatus(me,powerup);
                }
            }
        }

    }
    var showMyPowerups = function(me){
        var x = me.width-1000;
        var y = 20;
        var padding = 5;
        for(var i=0; i<me.config.myPowerups.length; i++){
            var powerup = me.config.myPowerups[i];
            x = x + powerup.getWidth() + padding;
            powerup.x = x;
            powerup.y = y;
            powerup.stand();
        }
    }

    var hitTestEnemies = function(player,me){
        if(me.config.enemies.length != 0){
            for(var i = 0; i< me.config.enemies.length ; i++){
                var enemy = me.config.enemies[i];
                if(enemy.hit == true || player.getLaneId() != enemy.getLaneId()) continue;
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

    /*var hitTestGems = function(player,me){
     if(me.config.gems.length != 0){
     for(var i = 0; i< me.config.gems.length ; i++){
     var gem = me.config.gems[i];
     var hit = isCollision(player,gem);
     if(hit){
     return gem;
     }
     }
     }
     }*/

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
            var lane = getLaneById(output.laneId, me);
            me.addPlayer(lane);
        }
    }

    var setTickerStatus = function(){
        createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    }

    var updateLevelStatus = function(me, object){
        var type = "";
        if(object instanceof sprites.Enemy) type = "enemy";
        me.waves.update(object.getWaveId(), object.onKillPush(), type)
        if(me.waves.getStatus() && me.config.enemies.length == 0){
            updateLevel(me);
        }
    }

    var updateLevel = function(me){
        me.config.gameState.gs.currentLevel++;
        me.config.gameState.gs.currentState = me.config.gameState.gs.States.GAME_OVER;
        showMessage(me,"Level Completed !!");
        me.config.gameState.gs.points += me.config.gameState.gs.life;
        me.config.gameState.gs.gameLevelPoints.push(me.config.gameState.gs.life);
        setTimeout(function(){EventBus.dispatch("setTickerStatus");EventBus.dispatch("showLevel");},3000); //TODO : change
    }

    var pushEnemy = function(me,enemy){
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


}