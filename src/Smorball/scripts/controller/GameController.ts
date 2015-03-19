/// <reference path="stagecontroller.ts" />
/// <reference path="../utils/deparam.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../data/manifest.ts" />
/// <reference path="../data/loaderdata.ts" />
/// <reference path="soundcontroller.ts" />

class GameController {

    ESC_KEY = 27;
    SHIFT_KEY = 16;
    ONE = 49;
    TWO = 50;
    THREE = 51;
    TAB_KEY = 9;

    config: any;
    store: LocalStorage;
    myBag: MyBag;

    constructor(config: any) {
        this.config = config;
    }

    init() {

        this.config.stage = new createjs.Stage("loaderCanvas");
        this.config.popupStage = new createjs.Stage("popupCanvas");
        this.config.utilityStage = new createjs.Stage("utilityCanvas");
        this.config.stage.canvas.width = window.innerWidth;//TODO make this better
        this.config.stage.canvas.height = window.innerHeight;//TODO make this better


        this.store = new LocalStorage();

        this.config.gameState = new GameState({ "store": this.store.getFromStore().gameState });
        this.config.gameState.init();

        this.loadEvents();
        this.loadImages();
        window.onkeydown = this.onKeyBoardEvents;

        // If the param is supplied disable the timeout when the window isnt focued (annoying when developing)
        if (deparam(window.location.href).disableTimeout != "true")
            window.onblur = () => { EventBus.dispatch("showTimeoutScreen") };

        window.onclick = () => {
            var fileId = "click";
            EventBus.dispatch("playSound", fileId);
        };
    }

    private loadImages() 
    {
        var manifest = Manifest.game;
        var splash = LoaderData[1];
        manifest.push({ "src": splash.image, "id": splash.id });
        this.config.smbLoadQueue = new SmbLoadQueue({ "stage": this.config.stage, "gameState": this.config.gameState });
        this.config.smbLoadQueue.initialLoad(Manifest.initial, () => {
            this.config.smbLoadQueue.loadQueue(manifest, () => this.showSplashScreens());
        });

    }

    private showSplashScreens() {
        if (deparam(window.location.href).skipIntro == "true") {
            this.doInit();
        }
        else {

            $("#mainSplashScreen").css("display", "table");
            $("#MBGLogo").delay(2000).fadeOut(1000, () => {
                $("#BHLlogo").fadeIn(1000).delay(2000).fadeOut(1000, () => {
                    $("#tiltfactorLogo").delay(2000).fadeOut(1000, () => {
                        $("#mainSplashScreen").fadeOut(1000, () => {
                            this.doInit();
                        })
                    });
                });
            });
        }
    }

    private doInit() 
    {
        var config = { "loader": this.config.smbLoadQueue, "gameState": this.config.gameState };
        this.myBag = new MyBag(config)

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
        })
        this.config.stageController.init();

        this.config.shopController = new ShopController({
            "gameState": this.config.gameState,
            "loader": this.config.smbLoadQueue,
            "stage": this.config.popupStage
            , "myBag": this.myBag
        })
        this.config.shopController.init();

        this.config.gameLeveController = new GameLevelController({
            "gameState": this.config.gameState,
            "loader": this.config.smbLoadQueue,
            "stage": this.config.utilityStage
        });
        this.config.gameLeveController.init();
        this.hideAll();
        EventBus.dispatch("showMenu");
    }

    private loadEvents() 
    {
        EventBus.addEventListener("hideAll", () => this.hideAll() );
        EventBus.addEventListener("saveToStore", () => this.save());
    }

    private hideAll() 
    {
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
    }


    private clearStage(stage) 
    {
        stage.removeAllChildren();
    }
    
    private onKeyBoardEvents(e) {
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
    }

    persist() 
    {
        var json = JSON.stringify({
            myBag: this.myBag.persist(),
            gameState: this.config.gameState.persist()
        });
        return json;
    }

    save()
    {
        var object = this.persist();
        this.store.saveToStore(object);
    }
}