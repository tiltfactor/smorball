/// <reference path="stagecontroller.ts" />
/// <reference path="../utils/deparam.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../data/manifest.ts" />
/// <reference path="../data/loaderdata.ts" />
/// <reference path="soundcontroller.ts" />
var GameController = (function () {
    function GameController(config) {
        this.ESC_KEY = 27;
        this.SHIFT_KEY = 16;
        this.ONE = 49;
        this.TWO = 50;
        this.THREE = 51;
        this.TAB_KEY = 9;
        this.config = config;
    }
    GameController.prototype.init = function () {
        this.config.stage = new createjs.Stage("loaderCanvas");
        this.config.popupStage = new createjs.Stage("popupCanvas");
        this.config.utilityStage = new createjs.Stage("utilityCanvas");
        this.config.stage.canvas.width = window.innerWidth; //TODO make this better
        this.config.stage.canvas.height = window.innerHeight; //TODO make this better
        this.store = new LocalStorage();
        this.config.gameState = new GameState({ "store": this.store.getFromStore().gameState });
        this.config.gameState.init();
        this.loadEvents();
        this.loadImages();
        window.onkeydown = this.onKeyBoardEvents;
        // If the param is supplied disable the timeout when the window isnt focued (annoying when developing)
        if (deparam(window.location.href).disableTimeout != "true")
            window.onblur = function () {
                EventBus.dispatch("showTimeoutScreen");
            };
        window.onclick = function () {
            var fileId = "click";
            EventBus.dispatch("playSound", fileId);
        };
    };
    GameController.prototype.loadImages = function () {
        var _this = this;
        var manifest = Manifest.game;
        var splash = LoaderData[1];
        manifest.push({ "src": splash.image, "id": splash.id });
        this.config.smbLoadQueue = new SmbLoadQueue({ "stage": this.config.stage, "gameState": this.config.gameState });
        this.config.smbLoadQueue.initialLoad(Manifest.initial, function () {
            _this.config.smbLoadQueue.loadQueue(manifest, function () { return _this.showSplashScreens(); });
        });
    };
    GameController.prototype.showSplashScreens = function () {
        var _this = this;
        if (deparam(window.location.href).skipIntro == "true") {
            this.doInit();
        }
        else {
            $("#mainSplashScreen").css("display", "table");
            $("#MBGLogo").delay(2000).fadeOut(1000, function () {
                $("#BHLlogo").fadeIn(1000).delay(2000).fadeOut(1000, function () {
                    $("#tiltfactorLogo").fadeIn(1000).delay(2000).fadeOut(1000, function () {
                        _this.doInit();
                        $("#mainSplashScreen").fadeOut(500, function () {
                        });
                    });
                });
            });
        }
    };
    GameController.prototype.doInit = function () {
        var config = { "loader": this.config.smbLoadQueue, "gameState": this.config.gameState };
        this.myBag = new MyBag(config);
        this.config.menuController = new MenuController({
            "gameState": this.config.gameState,
            "loader": this.config.smbLoadQueue
        });
        this.config.menuController.init();
        this.config.soundController = new SoundController({
            "gameState": this.config.gameState,
            "loader": this.config.smbLoadQueue
        });
        this.config.soundController.init();
        this.config.stageController = new StageController({
            "gameState": this.config.gameState,
            "loader": this.config.smbLoadQueue,
            "myBag": this.myBag
        });
        this.config.stageController.init();
        this.config.shopController = new ShopController({
            "gameState": this.config.gameState,
            "loader": this.config.smbLoadQueue,
            "stage": this.config.popupStage,
            "myBag": this.myBag
        });
        this.config.shopController.init();
        this.config.gameLeveController = new GameLevelController({
            "gameState": this.config.gameState,
            "loader": this.config.smbLoadQueue,
            "stage": this.config.utilityStage
        });
        this.config.gameLeveController.init();
        this.hideAll();
        EventBus.dispatch("showMenu");
    };
    GameController.prototype.loadEvents = function () {
        var _this = this;
        EventBus.addEventListener("hideAll", function () { return _this.hideAll(); });
        EventBus.addEventListener("saveToStore", function () { return _this.save(); });
    };
    GameController.prototype.hideAll = function () {
        window.onresize = null;
        $("#shopOuterWrapper").css("display", "none");
        $("#loaderDiv").hide();
        $("#dialog-utility").hide();
        $("#dialog-shop").hide();
        $("#myCanvas").hide();
        $("#canvasHolder").hide();
        $("#menu-container").hide();
        $('#game-popup').hide();
        $('#confirm-popup').hide();
        $('#menu-confirm-popup').hide();
        $("#optionsScreen").hide();
        $('.resultContainer, #resultWrapper').hide();
    };
    GameController.prototype.clearStage = function (stage) {
        stage.removeAllChildren();
    };
    GameController.prototype.onKeyBoardEvents = function (e) {
        switch (e.keyCode) {
            case this.ESC_KEY:
                EventBus.dispatch("showTimeoutScreen");
                break;
            case this.ONE:
                if (e.shiftKey) {
                    EventBus.dispatch("assistText", 1);
                }
                break;
            case this.TWO:
                if (e.shiftKey) {
                    EventBus.dispatch("assistText", 2);
                }
                break;
            case this.THREE:
                if (e.shiftKey) {
                    EventBus.dispatch("assistText", 3);
                }
                break;
            case this.TAB_KEY:
                e.preventDefault();
                $("#inputText").focus();
                EventBus.dispatch("selectOnTab");
                break;
        }
    };
    GameController.prototype.persist = function () {
        var json = JSON.stringify({
            myBag: this.myBag.persist(),
            gameState: this.config.gameState.persist()
        });
        return json;
    };
    GameController.prototype.save = function () {
        var object = this.persist();
        this.store.saveToStore(object);
    };
    return GameController;
})();
