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
                if(me.config.gameState.currentLevel != 7)
                {
                    var splash = LoaderData[me.config.gameState.currentLevel+1];
                    manifest.push({"src": splash.image, "id" : splash.id});
                }

            }


        }


        me.config.loader.loadQueue(manifest, _showMapScreen, me);

    }

    GameLevelController.prototype.showMap = function (isCheated) {
        var me = this;
        EventBus.dispatch("hideAll");
        $("#loaderCanvas").show();
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
        drawFaceBookButton(me);
        drawTwitterButton(me);

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
        shop.addEventListener("click", showShop);
        shop.addEventListener("mouseover",function(evt){
            evt.target.cursor = 'pointer';
        });
        me.map.addChild(shop);

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
        cashText.font = "bold 40px Arial";
        cashText.color = "white";
        cashText.setTransform(cashbar.getTransformedBounds().width/2-cashText.getMeasuredWidth(),cashText.getMeasuredHeight());
        cashContainer.addChild(cashbar,cashText);
        me.map.addChild(cashContainer);

    };
    var drawSurvival = function (me) {
        var survival = new createjs.Bitmap(me.config.loader.getResult("stopwatch_icon"));
        survival.setTransform(200,700,1,1);
        me.map.addChild(survival);
    }
    var drawLevelInfoBar = function(me){
        me.infoContainer = new createjs.Container();
        me.map.addChild(me.infoContainer);
        var inforbar = new createjs.Bitmap(me.config.loader.getResult("level_info_bar"));
        me.infoContainer.addChild(inforbar);
        me.infoContainer.x = 20;
        me.infoContainer.y = me.map.getBounds().height-me.infoContainer.getTransformedBounds().height-40;
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
        fbbtn.y =  me.map.getBounds().height -  fbbtn.getTransformedBounds().height;
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
        tbtn.y =  me.map.getBounds().height -  tbtn.getTransformedBounds().height;
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
    GameLevelController.prototype.setLevel = function (label) {
        this.config.gameState.currentLevel = label.id;
        EventBus.dispatch("hideAll");
        EventBus.dispatch("newGame");
        $("#myCanvas").show();

    }

}