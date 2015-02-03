/**
 * Created by user on 9/12/14.
 */
function GameLevelController(config) {
    this.config = config;
    gl = this;

    GameLevelController.prototype.init = function () {

        this.gameLevels = [];

        this.config.stage.canvas.width = window.innerWidth;
        this.config.stage.canvas.height = window.innerHeight;
        this.scaleFactorX = window.innerWidth / 800;
        this.scaleFactorY = window.innerHeight / 600;
        this.config.stage.enableMouseOver(10);
        loadEvents(this);
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

        me.config.loader.loadQueue(manifest, showMapScreen, me);
    }

    GameLevelController.prototype.showMap = function () {
        EventBus.dispatch("hideAll");
        $("#loaderCanvas").show();
        loadImages(this);
    }

    var showMapScreen = function (me) {
        me.config.stage.removeAllChildren();
        $("#dialog-utility").show();
        me.map = new createjs.Container();
        me.map.scaleX = me.scaleFactorX;
        me.map.scaleY = me.scaleFactorY;

        me.config.stage.addChild(me.map);
        var levelmap = new createjs.Bitmap(me.config.loader.getResult("map_background"));
        levelmap.setTransform(0, 0, 0.5, 0.5);

        me.map.addChild(levelmap);
        drawLevels(me);
        drawShop(me);
        drawCashBar(me);
        drawSurvival(me);
        drawLevelInfoBar(me);
        me.config.stage.update();
    }

    var drawLevels = function (me) {
        var totLevels = 7;
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
        var cashContainer = new createjs.Container();
        var cashbar = new createjs.Bitmap(me.config.loader.getResult("cash_bar"));
        cashbar.setTransform(0, 0, 0.5, 0.5);
        cashContainer.addChild(cashbar);
        cashContainer.x = me.map.getBounds().width - cashbar.getTransformedBounds().width - 20;
        cashContainer.y = 10;
        me.map.addChild(cashContainer);

    };
    var drawSurvival = function (me) {
        var survival = new createjs.Bitmap(me.config.loader.getResult("stopwatch_icon"));
        survival.setTransform(100,350,0.5,0.5);
        me.map.addChild(survival);
    }
    drawLevelInfoBar = function(me){
        var infoContainer = new createjs.Container();
        me.map.addChild(infoContainer);
        var inforbar = new createjs.Bitmap(me.config.loader.getResult("level_info_bar"));
        inforbar.setTransform(0,0,0.5,0.5);
        infoContainer.addChild(inforbar);
        infoContainer.x = 10;
        infoContainer.y = me.map.getBounds().height-infoContainer.getTransformedBounds().height-10;
    }
    GameLevelController.prototype.setLevel = function (label) {
        this.config.gameState.gs.currentLevel = label.id;
        EventBus.dispatch("hideAll");
        EventBus.dispatch("newGame");
        $("#myCanvas").show();

    }

}