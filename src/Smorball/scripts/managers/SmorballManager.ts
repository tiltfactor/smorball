/// <reference path="../../typings/smorball/smorball.d.ts" />

class SmorballManager {

	config: SmorballConfig;
	stage: createjs.Stage;
	resources: ResourcesManager;
	splashScreens: SplashScreensManager;
	loadingScreen: LoadingScreenManager;
	mainMenu: MainMenuManager;

	init() {
		console.log("starting up Smorball");

		// Load the config first
		this.config = new SmorballConfig();
		
		// Create the main stage
		this.stage = new createjs.Stage("mainCanvas");
		this.stage.stage.canvas.width = this.config.width;
		this.stage.stage.canvas.height = this.config.height;
		
		// Setup the ticker which handles the main game update loop
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick",(e: createjs.TickerEvent) => this.update(e));

		// Create Managers
		this.resources = new ResourcesManager();
		this.splashScreens = new SplashScreensManager();
		this.loadingScreen = new LoadingScreenManager();
		this.mainMenu = new MainMenuManager();		

		// Add managers that are containers
		this.stage.addChild(this.splashScreens);
		this.stage.addChild(this.loadingScreen);
		this.stage.addChild(this.mainMenu);

		// Init managers
		this.loadingScreen.init();
		this.mainMenu.init();
			
		// Handle resizing so we can centre the canvas
		window.onresize = () => this.onResize();
		this.onResize();

		// Start the game
		this.startGame();
	}

	startGame()	{

		this.resources.loadInitialResources(() => {
			console.log("initial resources loaded, showing loading screen and loading main game resources");

			this.loadingScreen.show();
			this.resources.loadMainGameResources(() => {

				this.loadingScreen.hide();
				console.log("main game resources loaded, showing splash screens.");
				this.splashScreens.showSplashScreens(() => {
					console.log("spash screens done, showing main menu.");

				});
			});
		});
	}

	onResize() {
		// Scale so its always on screen
		var ratioH = window.innerHeight / this.config.height;
		var ratioW = window.innerWidth / this.config.width;
		var ratio = Math.min(ratioH, ratioW);
		this.stage.scaleX = this.stage.scaleY = ratio;
		this.stage.canvas.width = ratio * this.config.width;
		this.stage.canvas.height = ratio * this.config.height;

		$("#smorballContainer").innerWidth(this.stage.canvas.width);
		$("#smorballContainer").innerHeight(this.stage.canvas.height);
	}
	
	update(e: createjs.TickerEvent) {

		// Dont update if paused!
		if (createjs.Ticker.getPaused()) return;

		// Get the delta (in seconds) as this is all we need to pass to the children
		var delta = e.delta / 1000;
					
		// Update all the bits
		this.loadingScreen.update(delta);
		//this.spawing.update(delta);
		//_.each(this.enemies, e => e.update(delta));
		//_.each(this.players, p => p.update(delta));
		//this.capatchas.update(delta);

		// Physics
		//this.hitTest();

		// Finally render
		this.stage.update(e);
	}


}