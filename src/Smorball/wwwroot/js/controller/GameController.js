/// <reference path="../model/gamestate.ts" />
/// <reference path="stagecontroller.ts" />
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
        //this.config = config;
    }
    GameController.prototype.init = function () {
        // Declaring a single global model
        smorball = this;
        this.stage = new createjs.Stage("loaderCanvas");
        this.popupStage = new createjs.Stage("popupCanvas");
        this.utilityStage = new createjs.Stage("utilityCanvas");
        this.stage.canvas.width = window.innerWidth; //TODO make this better
        this.stage.canvas.height = window.innerHeight; //TODO make this better
        this.store = new LocalStorage();
        this.depersistGameState();
        this.loadEvents();
        this.loadImages();
        window.onkeydown = this.onKeyBoardEvents;
        // If the param is supplied disable the timeout when the window isnt focued (annoying when developing)
        if (Utils.deparam(window.location.href).disableTimeout != "true")
            window.onblur = function () {
                EventBus.dispatch("showTimeoutScreen");
            };
        window.onclick = function () {
            var fileId = "click";
            EventBus.dispatch("playSound", fileId);
        };
    };
    GameController.prototype.depersistGameState = function () {
        this.gameState = this.store.getFromStore().gameState;
        if (this.gameState == null)
            this.gameState = {};
    };
    GameController.prototype.loadImages = function () {
        var _this = this;
        var manifest = Manifest.game;
        var splash = LoaderData[1];
        manifest.push({ "src": splash.image, "id": splash.id });
        // HAAAAACK! Adding all the captchas here for now, this should move after!
        var captachas = _.map(localCaptchaData.entries, function (e) {
            return { src: "shapes/captcha/" + e.image, id: "captcha_" + e.image.substr(0, 3) };
        });
        manifest = manifest.concat(captachas);
        this.loader = new SmbLoadQueue({ "stage": this.stage, "gameState": this.gameState });
        this.loader.initialLoad(Manifest.initial, function () {
            _this.loader.loadQueue(manifest, function () { return _this.showSplashScreens(); });
        });
    };
    GameController.prototype.showSplashScreens = function () {
        var _this = this;
        if (Utils.deparam(window.location.href).skipIntro == "true") {
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
        this.myBag = new MyBag({ "loader": this.loader, "gameState": this.gameState });
        this.menuController = new MenuController({
            "gameState": this.gameState,
            "loader": this.loader
        });
        this.soundController = new SoundController({
            "gameState": this.gameState,
            "loader": this.loader
        });
        this.stageController = new StageController();
        this.shopController = new ShopController({
            "gameState": this.gameState,
            "loader": this.loader,
            "stage": this.popupStage,
            "myBag": this.myBag
        });
        this.gameLeveController = new GameLevelController({
            "gameState": this.gameState,
            "loader": this.loader,
            "stage": this.utilityStage
        });
        this.menuController.init();
        this.soundController.init();
        this.shopController.init();
        this.gameLeveController.init();
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
        $("#captchaInputContainer").hide();
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
    GameController.prototype.save = function () {
        this.store.saveToStore({
            myBag: this.myBag.persist(),
            gameState: this.gameState
        });
    };
    return GameController;
})();
