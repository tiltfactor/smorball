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

        var pe = function(){popEnemy(me)}
        EventBus.addEventListener("popEnemy", pe);

        var rt = function() {resetTimer(me)};
        EventBus.addEventListener("resetTimer", rt);

        var ct = function() {clearTimer(me)};
        EventBus.addEventListener("clearTimer", ct);

        var cc = function(){compareCaptcha(me)};
        EventBus.addEventListener("compareCaptcha", cc);

        var pt = function(e){passText(me)};
        EventBus.addEventListener("passText", pt);

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
        me.freeBottomAreaY = 100;
        me.freeLeftAreaX = 100;
        me.freeTopAreaY = 150;
        var canvas = document.getElementById("myCanvas");
        me.width  = canvas.width =  window.innerWidth-20;
        me.height = canvas.height =  window.innerHeight-20-me.freeBottomAreaY;
        setDivPosition(me);

    }
    var setDivPosition = function(me){
        $("#canvasHolder").parent().css({position: 'relative'});
        $("#canvasHolder").css({top: me.height, left: me.width/2 - me.freeLeftAreaX, position:'absolute'});
    }

    var newGame = function (me) {
        me.config.gameState.gs.currentState = me.config.gameState.gs.States.RUN;
        me.levelConfig = Levels[me.config.gameState.gs.currentLevel];
        me.time = 0;
        document.getElementById('canvasHolder').style.display = "block";
        document.getElementById('passButton').value = 'Pass('+ me.levelConfig.pass + ')';

        EventBus.dispatch("setTickerStatus");
        resetGame(me);
        generateWaves(me);

        drawLane(me);
        drawWall(me);
       // textHolder(me);
        //createPlayer(me);
        showLife(me);
        startTimer(me);
        initShowMessage(me);
        setTimeout(function(){showMessage(me,"Jujubees coming!!!");},2000); //TODO : change


    }

    var startTimer = function(me){
       EventBus.dispatch("popEnemy");
       me.timer = setInterval(function(){EventBus.dispatch("popEnemy")},getTime(me) )
    }
    var resetTimer = function(me){
        if(me.config.enemies.length < me.levelConfig.maxOnGround){
            clearInterval(me.timer);
            startTimer(me);
        }

    }

    var clearTimer = function(me){
        clearInterval(me.timer);
    }


    var getTime = function(me){
       var width = me.width - me.freeLeftAreaX- 300; //left lane area
       me.timeDelay = ((width/createjs.Ticker.getFPS()*1)- me.levelConfig.time) *1000;
       return me.timeDelay;
    }

    var generateWaves = function(me){
        for(var i = 0 ; i< me.levelConfig.waves; i++ ){
           var config = {"enemyPerWave" : me.levelConfig.enemyPerWave, "life" : me.levelConfig.life,
               types : me.levelConfig.types, "lanes": me.levelConfig.lanes,  "loader" : me.config.loader };
           var wave = new Wave(config);
           me.config.waves.push(wave);
        }


    }

    var popEnemy = function(me){
        console.log("enemyy")
        if(me.config.waves.length == 0){
            if( me.config.enemies.length == 0){
                //todo : udate to next level
                //me.config.gameState.gs.currentLevel++;
                me.config.gameState.gs.currentState = me.config.gameState.gs.States.GAME_OVER;
                clearTimer(me);
                showGameOverMessage(me,"Level Completed !!");
            }

        }else{
            if(me.config.enemies.length == 0){
                popEnemyFromWave(me);
            }else if(me.config.enemies.length < me.levelConfig.maxOnGround){
                var timeDiff = Date.now()- me.time;
                if(timeDiff > me.timeDelay/3){
                    popEnemyFromWave(me);
                }
            }


        }


    }
    var popEnemyFromWave = function(me){
        me.time = Date.now();
        var wave = me.config.waves[me.config.waves.length -1];
        var enemy = wave.enemies.pop();
        me.config.enemies.push(enemy);
        me.config.stage.addChild(enemy);
        var lane = me.config.lanes[wave.getLaneNumber()];

        var sf = getScaleFactor(lane,enemy);
        enemy.setScale(sf,sf);
        var start = lane.getEndPoint();
        var end = lane.getEnemyEndPoint();

        enemy.setPosition(start.x, start.y);
        enemy.setEndPoint(end.x);
        enemy.run();

        if(wave.enemies.length == 0){
            me.config.waves.pop();
        }
    }

    var getScaleFactor = function(lane,ob){
        var laneHeight = lane.getHeight()-20;
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
        var height = (me.height - me.freeTopAreaY);
        var totalLanes = me.levelConfig.lanes;
        var laneHeight = height/totalLanes;

        for(var i = 0; i< totalLanes ; i++){
            var config = {"x":me.freeLeftAreaX, "y" : (laneHeight*i)+me.freeTopAreaY, "width": width, "height": laneHeight, "id" : i+1,
                "loader" : me.config.loader};
            var lane = new Lane(config);
            me.config.stage.addChild(lane);
            me.config.lanes.push(lane);
            loadCaptcha(me,lane);
        }

    }


    var drawWall = function(me){
        var shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(me.config.loader.getResult("wall"))
            .drawRect(me.freeLeftAreaX,0,me.width,100);
        shape.y = me.freeTopAreaY - 100;
        me.config.stage.addChild(shape);
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
        }else if(object instanceof sprites.SpriteMan || object instanceof  sprites.SpriteMan1){
            var index = me.config.players.indexOf(object);
            me.config.players.splice(index,1);
        }else if(object instanceof Gem){
            var index = me.config.gems.indexOf(object);
            me.config.gems.splice(index,1);
        }
    }

    StageController.prototype.addPlayer = function(x,y){
        var config = {"id": "man1", "loader" : this.config.loader}
        var player = new sprites.SpriteMan1(config);
        this.config.players.push(player);
        player.setPosition(x, y);
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
        me.config.lanes = [];
        me.config.waves = [];
        me.passCount = 0;

        if(me.config.gameState.gs.currentLevel == 1){
            me.config.lifes = [];
            me.config.gameState.gs.life = 3;
        }

    }

    var removeAllChildren = function(me){
        me.config.stage.removeAllChildren();
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
                var gem = hitTestGems(player,me);
                if(enemy != null && player.hit == false && enemy.hit == false){
                    player.kill();
                    player.hit = true;
                    enemy.kill();
                }
                if(gem != null){
                    gem.kill();
                }
            }
        }

    }

    var hitTestEnemies = function(player,me){
        if(me.config.enemies.length != 0){
            for(var i = 0; i< me.config.enemies.length ; i++){
                var enemy = me.config.enemies[i];
                if(enemy.hit == true) continue;
                var hit = isCollision(player,enemy);
                if(hit){
                   return enemy;
                }
            }
        }
    }

    var hitTestGems = function(player,me){
        if(me.config.gems.length != 0){
            for(var i = 0; i< me.config.gems.length ; i++){
                var gem = me.config.gems[i];
                var hit = isCollision(player,gem);
                if(hit){
                    return gem;
                }
            }
        }
    }

    var isCollision = function(player, object){
        return (object.x <= player.x + player.getWidth() &&
            player.x <= object.x + object.getWidth() &&
            object.y <= player.y + player.getHeight()  &&
            player.y <= object.y +object.getHeight())
    }

    var compareCaptcha = function(me){
        var flag = false;
        var inputText = document.getElementById("inputText").value;
        for(var i = 0 ; i < me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            if(inputText == lane.captcha.text){
                flag = true;
                showMessage(me, "Correct");
                var start = lane.getStartPoint();
                var end = lane.getEndPoint();
                var player = me.addPlayer(start.x, start.y);
                player.setEndPoint(end.x);
                var sf = getScaleFactor(lane,player);
                player.setScale(sf,sf);
                loadCaptcha(me,lane);
            }
        }
        if(!flag){
            showMessage(me, "InCorrect");
        }
        clearText();
    }

    var passText = function(me){
        clearText();

        if(++me.passCount >= me.levelConfig.pass){
            disablePassButton();
        }
        for(var i = 0 ; i< me.config.lanes.length; i++){
            var lane = me.config.lanes[i];
            loadCaptcha(me, lane);
        }
    }

    var clearText = function(){
        document.getElementById("inputText").value = "";
    }
    var disablePassButton = function(){
        document.getElementById('passButton').disabled = true;
    }

    var loadCaptcha = function(me, lane){
       var index = me.currentIndex++;
       if(index == 6) me.currentIndex = 0; //todo: change when images load fully
       var captcha = captchaJson[index];
       lane.setCaptcha(captcha);
    }
    var setTickerStatus = function(){
       createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    }



}