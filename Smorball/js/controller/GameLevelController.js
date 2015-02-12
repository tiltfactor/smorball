/**
 * Created by user on 9/12/14.
 */
function GameLevelController(config) {
    this.config = config;
    gl = this;

    GameLevelController.prototype.init = function () {
        this.gameLevels = [];
        this.config.stage.enableMouseOver(10);
        loadEvents(this);
        setCanvasAttributes(this);
    }
    var setCanvasAttributes = function(me){
        var canvas = document.getElementById("utilityCanvas");
        me.config.stage.canvas.width = window.innerWidth;

        var h = me.config.stage.canvas.width * 3/4;
        if (window.innerHeight < h){
            h = window.innerHeight;
            me.config.stage.canvas.width = (h * 4/3);
        }
        me.config.stage.canvas.height =  h;
    }
    var loadEvents = function (me) {
        var sl = function () {
            me.showMap()
        };
        EventBus.addEventListener("showMap", sl);

        var tl = function (level) {
            me.setLevel(level.target)
        };
        EventBus.addEventListener("setLevel", tl);
    }

    var loadImages = function (me) {
        var _showMapScreen = function (me) {
            showMapScreen(me);
        }
        var manifest = Manifest.levelMap;
        for (var i = 1; i <= me.config.gameState.gs.maxLevel; i++) {
            var splash = LoaderData[i];
            manifest.push({"src": splash.image, "id": splash.id});
        }
        if(!me.config.gameState.map){
            me.config.gameState.map = true;
            me.config.loader.loadQueue(manifest, showMapScreen, me);
        }else{
            var manifest = [];
            me.config.loader.loadQueue(manifest, showMapScreen, me);
        }

    }

    GameLevelController.prototype.showMap = function () {
        EventBus.dispatch("hideAll");
        $("#loaderCanvas").show();
        EventBus.dispatch("saveToStore");
        loadImages(this);
    }

    var showMapScreen = function (me) {
        me.config.stage.removeAllChildren();
        $("#dialog-utility").show();
        me.map = new createjs.Container();
        me.map.scaleX = me.config.stage.canvas.width/800;
        me.map.scaleY = me.config.stage.canvas.height/600;

        me.config.stage.addChild(me.map);
        var levelmap = new createjs.Bitmap(me.config.loader.getResult("map_background"));
        levelmap.setTransform(0, 0, 0.5, 0.5);

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
        shop.setTransform(0, 0, 0.5, 0.5);
        shop.id = me.config.gameState.gs.maxLevel;
        shop.x = 500;
        shop.y = 390;
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
        cashbar.setTransform(0, 0, 0.5, 0.5);

        cashContainer.x = me.map.getBounds().width - cashbar.getTransformedBounds().width - 20;
        cashContainer.y = 10;

        cashText.text = score.getMyMoney();
        cashText.font = "bold 20px Arial";
        cashText.color = "white";
        cashText.setTransform(cashbar.getTransformedBounds().width/2-cashText.getMeasuredWidth(),cashText.getMeasuredHeight());
        cashContainer.addChild(cashbar,cashText);
        me.map.addChild(cashContainer);

    };
    var drawSurvival = function (me) {
        var survival = new createjs.Bitmap(me.config.loader.getResult("stopwatch_icon"));
        survival.setTransform(100,350,0.5,0.5);
        me.map.addChild(survival);
    }
    var drawLevelInfoBar = function(me){
        me.infoContainer = new createjs.Container();
        me.map.addChild(me.infoContainer);
        var inforbar = new createjs.Bitmap(me.config.loader.getResult("level_info_bar"));
        inforbar.setTransform(0,0,0.5,0.5);
        me.infoContainer.addChild(inforbar);
        me.infoContainer.x = 10;
        me.infoContainer.y = me.map.getBounds().height-me.infoContainer.getTransformedBounds().height-10;
    }
    var drawPathDots = function(me){
        var pointdata = PointData;
        for(var  i = 0;i<pointdata.length;i++){
            var dot  = new createjs.Bitmap(me.config.loader.getResult("path_dot"));
            dot.setTransform(pointdata[i].x,pointdata[i].y,0.5,0.5);
            me.map.addChild(dot)
        }
    }
    var drawFaceBookButton=function(me){
        var fbbtn = new createjs.Bitmap(me.config.loader.getResult("fb_btn_up"));
        fbbtn.setTransform(0,0,0.5,0.5);
        fbbtn.y =  me.map.getBounds().height -  fbbtn.getTransformedBounds().height;
        fbbtn.x = me.infoContainer.x + me.infoContainer.getTransformedBounds().width + 10;
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
        tbtn.setTransform(0,0,0.5,0.5);
        tbtn.y =  me.map.getBounds().height -  tbtn.getTransformedBounds().height;
        tbtn.x = me.infoContainer.x + me.infoContainer.getTransformedBounds().width + tbtn.getTransformedBounds().width + 10;
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
        mbtn.setTransform(0,0,0.5,0.5);
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