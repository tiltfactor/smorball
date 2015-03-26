/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />

enum GameState {
	Menus,
	Playing,
	GameOver,
	Shop
}

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
	state: GameState;

	loader: SmbLoadQueue;
	menuController: MenuController;
	soundController: SoundController;
	levelController: LevelController;
	shopController: ShopController;
	gameLeveController: GameLevelController;	

    constructor(config: any) {
        //this.config = config;
    }

    init() {

		// Declaring a single global model
		smorball = this;

        this.stage = new createjs.Stage("loaderCanvas");
        this.popupStage = new createjs.Stage("popupCanvas");
        this.utilityStage = new createjs.Stage("utilityCanvas");
        this.stage.canvas.width = window.innerWidth;//TODO make this better
        this.stage.canvas.height = window.innerHeight;//TODO make this better

        this.store = new LocalStorage();
		this.depersist();

        this.loadEvents();
        this.loadImages();
        window.onkeydown = this.onKeyBoardEvents;

        // If the param is supplied disable the timeout when the window isnt focued (annoying when developing)
        if (Utils.deparam(window.location.href).disableTimeout != "true")
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

		// HAAAAACK! Adding all the captchas here for now, this should move after!
		var captachas = _.map(localCaptchaData.entries, e => { return { src: "shapes/captcha/" + e.image, id: "captcha_" + e.image.substr(0, 3) } });
		manifest = manifest.concat(captachas);

        this.loader = new SmbLoadQueue();
        this.loader.initialLoad(Manifest.initial, () => {
            this.loader.loadQueue(manifest, () => this.showSplashScreens());
        });

    }

    private showSplashScreens() {
        if (Utils.deparam(window.location.href).skipIntro == "true") {
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
        this.myBag = new MyBag({ "loader": this.loader, "gameState": this.gameState })

        this.menuController = new MenuController();		

        this.soundController = new SoundController(); 

        this.levelController = new LevelController()

        this.shopController = new ShopController(this.popupStage)
        this.gameLeveController = new GameLevelController(this.utilityStage);

        this.menuController.init();		
		this.soundController.init();
		this.shopController.init();
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
        $("#captchaInputContainer").hide();
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
        this.store.saveToStore({
			myBag: this.myBag.persist()
			//gameState: this.gameState
		});
    }
	
	depersist()
	{

	}

}