/// <reference path="../model/gamestate.ts" />
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

    //config: any;
    store: LocalStorage;
    myBag: MyBag;
	stage: createjs.Stage;
	popupStage: createjs.Stage;
	utilityStage: createjs.Stage;
	gameState: GameState;

	smbLoadQueue: SmbLoadQueue;
	menuController: MenuController;
	soundController: SoundController;
	stageController: StageController;
	shopController: ShopController;
	gameLeveController: GameLevelController;

    constructor(config: any) {
        //this.config = config;
    }

    init() {

        this.stage = new createjs.Stage("loaderCanvas");
        this.popupStage = new createjs.Stage("popupCanvas");
        this.utilityStage = new createjs.Stage("utilityCanvas");
        this.stage.canvas.width = window.innerWidth;//TODO make this better
        this.stage.canvas.height = window.innerHeight;//TODO make this better


        this.store = new LocalStorage();

        this.gameState = new GameState({ "store": this.store.getFromStore().gameState });
        this.gameState.init();

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
        this.smbLoadQueue = new SmbLoadQueue({ "stage": this.stage, "gameState": this.gameState });
        this.smbLoadQueue.initialLoad(Manifest.initial, () => {
            this.smbLoadQueue.loadQueue(manifest, () => this.showSplashScreens());
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
                    $("#tiltfactorLogo").fadeIn(1000).delay(2000).fadeOut(1000,() => {		
						this.doInit();				
                        $("#mainSplashScreen").fadeOut(500,() => { });
                    });
                });
            });
        }
    }

    private doInit() 
    {
        var config = { "loader": this.smbLoadQueue, "gameState": this.gameState };
        this.myBag = new MyBag(config)

        this.menuController = new MenuController({
            "gameState": this.gameState,
            "loader": this.smbLoadQueue
        });
        this.menuController.init();

        this.soundController = new SoundController({
            "gameState": this.gameState,
            "loader": this.smbLoadQueue
        });
        this.soundController.init();

        this.stageController = new StageController({
            "gameState": this.gameState,
            "loader": this.smbLoadQueue,
            "myBag": this.myBag
        })
        this.stageController.init();

        this.shopController = new ShopController({
            "gameState": this.gameState,
            "loader": this.smbLoadQueue,
            "stage": this.popupStage
            , "myBag": this.myBag
        })
        this.shopController.init();

        this.gameLeveController = new GameLevelController({
            "gameState": this.gameState,
            "loader": this.smbLoadQueue,
            "stage": this.utilityStage
        });
        this.gameLeveController.init();
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
            gameState: this.gameState.persist()
        });
        return json;
    }

    save()
    {
        var object = this.persist();
        this.store.saveToStore(object);
    }
}