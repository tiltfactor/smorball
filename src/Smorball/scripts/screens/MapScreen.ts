/// <reference path="../../typings/smorball/smorball.d.ts" />

interface MapPoint {
	x: number;
	y: number;
}

interface MapData {
	levels: MapPoint[];
	dots: MapPoint[];
}

class MapScreen extends ScreenBase
{
	levels: MapLevel[];

	shop: MapShop;
	survival: MapSurvival;

	teamLogoEl: HTMLImageElement;
	teamNameEl: HTMLElement;
	scoreEl: HTMLElement;
	lockIconEl: HTMLImageElement;
	cashEl: HTMLElement;

	constructor() {
		super("mapMenu", "map_menu_html");
	}

	init() {
		super.init();	

		var data = <MapData>smorball.resources.getResource("map_data"); 

		// Grab these
		this.teamLogoEl = <HTMLImageElement>$("#mapMenu .selected-team .team-logo").get(0);
		this.teamNameEl = $("#mapMenu .selected-team .team-name").get(0);
		this.scoreEl = $("#mapMenu .selected-team .score").get(0);
		this.lockIconEl = <HTMLImageElement>$("#mapMenu .selected-team .lock-icon").get(0);
		this.cashEl = <HTMLImageElement>$("#mapMenu .cashbar").get(0);

		// Add the background
		this.addChild(new createjs.Bitmap(smorball.resources.getResource("map_background")));

		// Add each map dot
		_.each(data.dots, d => this.addChild(new MapDot(d)));

		// Add each level
		this.levels = [];
		for (var i = 0; i < data.levels.length; i++)
		{
			var l = new MapLevel(i, data.levels[i]);
			l.on("mouseover",(e: any) => this.onLevelRollover(e.currentTarget));
			this.addChild(l);
			this.levels.push(l);			
		}

		// Add the shop
		this.shop = new MapShop();
		this.shop.x = 1080;
		this.shop.y = 947;
		this.addChild(this.shop);

		// Add the survival level
		this.survival = new MapSurvival();
		this.survival.x = 272;
		this.survival.y = 915;
		this.addChild(this.shop);
		
		//this.survival.on("click",() => smorball.screens.open(smorball.screens.shop));
		this.addChild(this.survival);

		// Listen for some events
		$("#mapMenu .fb-share").click(() => smorball.social.shareProgressToFB());
		$("#mapMenu .twitter-share").click(() => smorball.social.shareProgressToTwitter());
		$("#mapMenu .menu").click(() => smorball.screens.open(smorball.screens.main));
	}

	update(delta: number) {
	}

	show() {
		super.show();
		_.each(this.levels, l => l.updateLockedState());
		this.cashEl.textContent = smorball.user.cash + "";
		this.onLevelRollover(this.levels[0]);
		this.shop.updateLockedState();		
		this.survival.updateLockedState();		
	}

	private onLevelRollover(level:MapLevel) {

		if (level.isUnlocked) {
			var l = smorball.game.getLevel(level.levelId);
			var usrLvl = smorball.user.levels[level.levelId];
			var img = <HTMLImageElement>smorball.resources.getResource(l.team.id + "_logo_small");
			this.teamLogoEl.src = img.src;
			this.teamNameEl.textContent = l.team.name;
			this.scoreEl.textContent = (usrLvl.score / 1000) + "/" + smorball.config.enemyTouchdowns;
			this.lockIconEl.hidden = true;
			this.teamLogoEl.hidden = false;
		}
		else {
			this.teamLogoEl.hidden = true;
			this.teamNameEl.textContent = "Locked";
			this.scoreEl.textContent = "0/6";
			this.lockIconEl.hidden = false;
		}
	}

}