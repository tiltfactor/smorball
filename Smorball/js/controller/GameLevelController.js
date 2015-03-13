/**
 * Created by user on 9/12/14.
 */
function GameLevelController(config) {
    this.config = config;
    gl = this;

    GameLevelController.prototype.init = function () {
        var me = this;
        this.gameLevels = [];
        this.config.stage.enableMouseOver(10);
        this.config.stage.snapToPixelEnabled = true;
        loadEvents(this);
        setCanvasAttributes(this);
    }
    var setCanvasAttributes = function(me){
        me.width =  1600;
        me.height = 1200;
        onResize(me);

    }
    var onResize = function(me){
        var canvas = me.config.stage.canvas;
        me.canvasWidth = canvas.width = window.innerHeight *4/3>window.innerWidth ? window.innerWidth : window.innerHeight*4/3;
        me.canvasHeight = canvas.height = me.canvasWidth *3/4>window.innerHeight?window.innerHeight:me.canvasWidth *3/4;

        me.config.stage.scaleX = me.canvasWidth/1600;
        me.config.stage.scaleY = me.canvasHeight/1200;
        me.config.stage.update();
        var paddingTop = (window.innerHeight - me.canvasHeight)/2 > 0 ? (window.innerHeight - me.canvasHeight)/2 : 0 ;
        $("#utilityCanvas").css({top: paddingTop });
        $("#canvasHolder").css({top:me.canvasHeight+ paddingTop - $("#canvasHolder").height(), position:'absolute'});

    };
    var loadEvents = function (me) {
        var sl = function (cheat) {
            me.showMap(cheat.target)
        };
        EventBus.addEventListener("showMap", sl);

        var tl = function (level) {
            me.setLevel(level.target)
        };
        EventBus.addEventListener("setLevel", tl);

        var ci = function(levelInfo){
            changeLevelInfoBar(me,levelInfo.target);
        }
        EventBus.addEventListener("changeLevelInfoBar",ci);
    }

    var loadImages = function (me,isCheatd) {
        var _showMapScreen = function (me) {
            showMapScreen(me);
        }
        var manifest = [];

        if(!me.config.gameState.map){
            me.config.gameState.map = true;
            manifest = Manifest.levelMap;
            for (var i = 1; i <= me.config.gameState.gs.maxLevel; i++) {
                var splash = LoaderData[i];
                manifest.push({"src": splash.image, "id": splash.id});
            }
        }else{
            if(isCheatd){
                for (var i = 1; i <= me.config.gameState.gs.maxLevel; i++) {
                    var splash = LoaderData[i];
                    manifest.push({"src": splash.image, "id": splash.id});
                }
            }else{
                if(me.config.gameState.currentLevel != me.config.gameState.gs.totalLevels)
                {
                    var splash = LoaderData[me.config.gameState.currentLevel];
                    manifest.push({"src": splash.image, "id" : splash.id});
                }

            }


        }


        me.config.loader.loadQueue(manifest, _showMapScreen, me);

    }

    GameLevelController.prototype.showMap = function (isCheated) {
        EventBus.dispatch("stopSound","crowdCheering");
        var me = this;
        EventBus.dispatch("hideAll");
        $("#loaderDiv").show();
        EventBus.dispatch("saveToStore");
        onResize(me);
        loadImages(this,isCheated);
    }

    var showMapScreen = function (me) {
        window.onresize = function(){onResize(me)};
        me.config.stage.removeAllChildren();
        $("#dialog-utility").show();
        me.map = new createjs.Container();
        me.config.stage.addChild(me.map);
        var levelmap = new createjs.Bitmap(me.config.loader.getResult("map_background"));
        me.map.addChild(levelmap);
        drawPathDots(me);
        drawMenuButton(me);
        drawLevels(me);
        drawShop(me);
        drawCashBar(me);
        drawSurvival(me);
        drawLevelInfoBar(me);

        if(me.config.gameState.gs.maxLevel>1){
            drawFaceBookButton(me);
            drawTwitterButton(me);

        }
        drawStatusText(me);


        me.config.stage.update();
    }

    var drawLevels = function (me) {
        var totLevels = me.config.gameState.totalLevels;
        for (var i = 0; i < totLevels; i++) {
            var isLocked = me.config.gameState.gs.maxLevel <= i ? true : false;
            var config = {"stadiumInfo": MapData[i], "locked": isLocked, "loader": me.config.loader, "id": i + 1};
            var level = new Level(config);
            me.gameLevels.push(level);
            me.map.addChild(level);
        }


    }
    var drawShop = function (me) {
        var shop = new createjs.Bitmap(me.config.loader.getResult("shop_icon"));
        shop.id = me.config.gameState.gs.maxLevel;
        shop.x = 1000;
        shop.y = 780;
        if(me.config.gameState.gs.maxLevel>1){
        shop.addEventListener("click", showShop);
        }else{
            shop.image = me.config.loader.getResult("lock");
            shop.y = 830;
        }

        shop.addEventListener("mouseover",function(evt){
            evt.target.cursor = 'pointer';
        });
        me.map.addChild(shop);


    }
    var drawStatusText = function(me){
        var text = new createjs.Text("status","bold 45px Boogaloo", "#000");
        var level = _.pick(LevelData[me.config.gameState.gs.maxLevel],"extras");
        if(level.extras != undefined){
            text.text = level.extras.message;
            text.addEventListener("click",function(e){me.map.removeChild(text)});
            text.maxWidth = 400;
            text.x = 1110 ;
            text.y = 750;
        }else{
            text.text  = "";
        }
        me.map.addChild(text);
        createjs.Tween.get(text).to({alpha:0},5000);
    }
    var showShop = function () {
        EventBus.dispatch("showShop");
    }
    var drawCashBar = function (me) {
        var score = new Score({"gameState":me.config.gameState});
        var cashContainer = new createjs.Container();
        var cashText = new createjs.Text();
        var cashbar = new createjs.Bitmap(me.config.loader.getResult("cash_bar"));
        cashContainer.x = me.map.getBounds().width - cashbar.getTransformedBounds().width - 40;
        cashContainer.y = 20;

        cashText.text = score.getMyMoney();
        cashText.font = "bold 60px Boogaloo";
        cashText.color = "white";
        cashText.setTransform(cashbar.getTransformedBounds().width/2-cashText.getMeasuredWidth()/2,cashbar.getTransformedBounds().height/2-cashText.getMeasuredHeight());
        cashContainer.addChild(cashbar,cashText);
        me.map.addChild(cashContainer);

    };
    var drawSurvival = function (me) {
        var survival = new createjs.Bitmap(me.config.loader.getResult("lock"));
        survival.setTransform(200,770,1,1);
        if(me.config.gameState.gs.maxLevel >=me.config.gameState.totalLevels){
            survival.image =  me.config.loader.getResult("stopwatch_icon");
            survival.setTransform(200,700,1,1);
            survival.addEventListener("click",function(){me.setLevel(0)});
        }
        survival.addEventListener("mouseover",function(evt){evt.target.cursor = "pointer"});

        me.map.addChild(survival);
    }
    var drawLevelInfoBar = function(me){
        me.infoContainer = new createjs.Container();
        me.map.addChild(me.infoContainer);

        var inforbar = new createjs.Bitmap(me.config.loader.getResult("level_info_bar"));
        inforbar.y = inforbar.getTransformedBounds().height;

        me.logo =  new createjs.Bitmap(me.config.loader.getResult("splash1"));
        me.logo.setTransform(-40,0,0.5,0.5);
        me.logo.y = inforbar.y - me.logo.getTransformedBounds().height/3;

        me.infoText = new createjs.Text("Charlson Chargers","50px Boogaloo", "#ffffff");

        me.infoText.x = me.logo.getTransformedBounds().width - 40;
        me.infoText.y = inforbar.getBounds().height + me.infoText.getBounds().height/2-5;

        me.scoreText = new createjs.Text("0/6","bold 75px Boogaloo", "#ffffff");

        me.scoreText.x  = inforbar.x + inforbar.getTransformedBounds().width-me.scoreText.getMeasuredWidth()-10;

        me.scoreText.y = me.infoText.y-me.scoreText.getMeasuredHeight()/3+10;

        me.infoContainer.addChild(inforbar,me.logo,me.infoText,me.scoreText);
        me.infoContainer.x = 20;
        me.infoContainer.y = me.map.getBounds().height-me.infoContainer.getTransformedBounds().height-20;
        //me.infoText.lineWidth = inforbar.getTransformedBounds().width/2;
        me.infoText.maxWidth = inforbar.getTransformedBounds().width/2;
    }
    var drawPathDots = function(me){
        var pointdata = PointData;
        for(var  i = 0;i<pointdata.length;i++){
            var dot  = new createjs.Bitmap(me.config.loader.getResult("path_dot"));
            dot.setTransform(pointdata[i].x,pointdata[i].y,1,1);
            me.map.addChild(dot)
        }
    }
    var drawFaceBookButton=function(me){
        var fbbtn = new createjs.Bitmap(me.config.loader.getResult("fb_btn_up"));
        fbbtn.y =  me.map.getBounds().height -  fbbtn.getTransformedBounds().height -40;
        fbbtn.x = me.infoContainer.x + me.infoContainer.getTransformedBounds().width + 20;
        fbbtn.addEventListener("mouseover",function(evt){
            evt.target.image = me.config.loader.getResult("fb_btn_over");
            evt.target.cursor = "pointer";
            me.config.stage.update();
        });
        fbbtn.addEventListener("mousedown",function(evt){
            evt.target.image = me.config.loader.getResult("fb_btn_down");
            evt.target.cursor = "pointer";
            me.config.stage.update();
        });
        fbbtn.addEventListener("pressup",function(evt){
            evt.target.image = me.config.loader.getResult("fb_btn_up");
            evt.target.cursor = "default";
            me.config.stage.update();
        });
        fbbtn.addEventListener("mouseout",function(evt){
            evt.target.image = me.config.loader.getResult("fb_btn_up");
            evt.target.cursor = "default";
            me.config.stage.update();
        });
        me.map.addChild(fbbtn);

    };
    var drawTwitterButton = function(me){
        var tbtn = new createjs.Bitmap(me.config.loader.getResult("t_btn_up"));
        tbtn.y =  me.map.getBounds().height -  tbtn.getTransformedBounds().height-40;
        tbtn.x = me.infoContainer.x + me.infoContainer.getTransformedBounds().width + tbtn.getTransformedBounds().width + 40;
        tbtn.addEventListener("mouseover",function(evt){
            evt.target.image = me.config.loader.getResult("t_btn_over");
            evt.target.cursor = "pointer";
            me.config.stage.update();
        });
        tbtn.addEventListener("mousedown",function(evt){
            evt.target.image = me.config.loader.getResult("t_btn_down");
            evt.target.cursor = "pointer";
            me.config.stage.update();
        });
        tbtn.addEventListener("pressup",function(evt){
            evt.target.image = me.config.loader.getResult("t_btn_up");
            evt.target.cursor = "default";
            me.config.stage.update();
        });
        tbtn.addEventListener("mouseout",function(evt){
            evt.target.image = me.config.loader.getResult("t_btn_up");
            evt.target.cursor = "default";
            me.config.stage.update();
        });
        me.map.addChild(tbtn);
    };

    var drawMenuButton = function(me){
        var mbtn = new createjs.Bitmap(me.config.loader.getResult("menu_btn_idle"));
        mbtn.x = mbtn.getTransformedBounds().width/4;
        mbtn.y = mbtn.getTransformedBounds().height/4;
        mbtn.addEventListener("mousedown",function(evt){
            evt.target.image = me.config.loader.getResult("menu_btn_click");
            evt.target.cursor = "pointer";
            me.config.stage.update();
            me.config.stage.removeAllChildren();
            EventBus.dispatch("hideAll");
            EventBus.dispatch("showMenu");
        });
        mbtn.addEventListener("mouseover",function(evt){
            evt.target.image = me.config.loader.getResult("menu_btn_over");
            evt.target.cursor = "pointer";
            me.config.stage.update();
        });
        mbtn.addEventListener("pressup",function(evt){
            evt.target.image = me.config.loader.getResult("menu_btn_idle");
            evt.target.cursor = "pointer";
            me.config.stage.update();
        });
        mbtn.addEventListener("mouseout",function(evt){
            evt.target.image = me.config.loader.getResult("menu_btn_idle");
            evt.target.cursor = "pointer";
            me.config.stage.update();
        });
        me.map.addChild(mbtn);
    }
    var changeLevelInfoBar = function(me,levelInfo){
        var maxLevel = me.config.gameState.gs.maxLevel;
        me.infoText.text = levelInfo.team;
        var score = 0;
        if(me.config.gameState.gs.gameLevelPoints[levelInfo.id-1]){
            score = me.config.gameState.gs.gameLevelPoints[levelInfo.id-1];
        }
        me.scoreText.text = score + "/6";

        if(me.config.loader.getResult("logo"+levelInfo.id)&& levelInfo.id<=maxLevel){
            me.logo.image = me.config.loader.getResult("logo"+levelInfo.id);
            me.logo.setTransform(-30,50,1.5,1.5);
        }else{
            me.logo.image = me.config.loader.getResult("lock");
            me.logo.setTransform(0,50,1,1);
        }

        me.config.stage.update();
    }
    GameLevelController.prototype.setLevel = function (level) {
        this.config.gameState.currentLevel = level;
        EventBus.dispatch("hideAll");
        EventBus.dispatch("newGame");
        $("#myCanvas").show();

    }

}