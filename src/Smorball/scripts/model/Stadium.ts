/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />

class Stadium extends createjs.Container {

	labels: any[];
	config: any;
	team: any;

	constructor(config: any) {
		super();

		this.config = config;
		this.labels = [];

        this.team = this.config.stadiumInfo.team;

        this.drawStadium();
        //drawShop(this);
        this.setPosition();
        this.addEventListener("mouseover", (evt:any) => {
            evt.target.cursor = 'pointer';
            EventBus.dispatch("changeLevelInfoBar", evt.target.parent)
        });

	}

	private drawStadium() {
		var stadiumBase = new createjs.Bitmap(this.config.loader.getResult("stadium_base"));
		this.addChild(stadiumBase);
		var stadium = new createjs.Bitmap(null);

		if (this.config.locked) {
			stadium.image = this.config.loader.getResult("lock");
			this.id = this.config.id;

			stadium.x = stadiumBase.getTransformedBounds().width / 4;
			stadium.y = -stadium.getTransformedBounds().height / 2;
			this.addChild(stadium);

		} else {
			stadium.image = this.config.loader.getResult("stadium");
			this.id = this.config.id;
			this.addEventListener("click", (e) => this.startLevel(e));
			stadium.x = stadiumBase.getTransformedBounds().width / 8;
			stadium.y = -stadium.getTransformedBounds().height / 4;
			this.addChild(stadium);
			this.drawLogo(stadium);

		}
	}

	setPosition() {
		this.x = this.config.stadiumInfo.x;
		this.y = this.config.stadiumInfo.y;
	}

	private startLevel(e) {
		EventBus.dispatch("setLevel", e.target.parent.id);
	}

	private drawLogo(stadium)
	{
		var logo = new createjs.Bitmap(this.config.loader.getResult(this.config.stadiumInfo.logo));
		logo.setTransform(0, stadium.y, 1.1, 1.1);
		logo.y = stadium.y - logo.getTransformedBounds().height / 2 - 25;
		this.addChild(logo);
	}
}