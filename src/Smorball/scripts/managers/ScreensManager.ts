/// <reference path="../../typings/smorball/smorball.d.ts" />

class ScreensManager extends createjs.Container {

	main: MainMenu;
	options: OptionsMenu;
	map: MapScreen;
	container: createjs.DOMElement;
	loadingLevel: LoadingLevelScreen
	game: GameScreen;
	instructions: InstructionsScreen;
	shop: ShopScreen;

	current: ScreenBase;

	menus: ScreenBase[];

	constructor() {
		super();

		this.menus = [];
		this.main = this.addMenu(new MainMenu());
		this.options = this.addMenu(new OptionsMenu());
		this.map = this.addMenu(new MapScreen());
		this.loadingLevel = this.addMenu(new LoadingLevelScreen());
		this.game = this.addMenu(new GameScreen());
		this.instructions = this.addMenu(new InstructionsScreen());
		this.shop = this.addMenu(new ShopScreen());
	}

	private addMenu<T extends ScreenBase>(menu: T) : T {
		this.addChild(menu);
		this.menus.push(menu);
		return menu;
	}

	init()
	{
		// Add the DOM element to the stage, this allows us to scale and position correctly
		this.container = new createjs.DOMElement(document.getElementById("menusContainer"));
		this.addChild(this.container);

		// init each menu
		_.each(this.menus, m => m.init());

		// Make sure we start off hidden
		_.each(this.menus, m => m.hide());
	}

	open(menu: ScreenBase) {
		if (this.current) this.current.hide();
		menu.show();
		this.current = menu;
	}

	update(delta: number) {
		if (this.current != null)
			this.current.update(delta);
	}

	//showMainMenu() {
	//	this.mainMenu.show();
	//}

}