/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />

class MyPowerup extends createjs.Container {
	
	config: any;

	shopped: number;
	fromShop: number;
	fromField: number;
	selected: boolean;

	events: any;

	number: createjs.Text;
	powerup: createjs.Bitmap;


	constructor(config: any) {
		this.config = config;

		super();

        this.shopped = this.config.shopped || 0;
        this.fromShop = this.shopped || 0;
        this.fromField = 0;
        this.selected = false;
        this.reset();
        this.drawPowerup();
        this.initText();
        this.loadEvents();
        this.checkCount(this.getSum());
	}

	private loadEvents() {
		this.events = {};
		this.events.click = () => { this.activatePowerup() };
		//this.addEventListener("click", this.events.click)
	}

	private checkCount(sum) {
		if (sum > 0) {
			this.addEventListener("click", this.events.click);
		} else {
			this.removeEventListener("click", this.events.click);
		}
	}

	reset() {
		this.fromField = 0;
		var sum = this.getSum() + this.shopped;
		if (sum > 0) {
			this.alpha = 1;
		} else {
			this.alpha = 0;
		}
		if (this.number) {
			this.number.text = this.shopped + "";
		}
	}
	getSum() {
		var sum = this.fromField + this.fromShop;
		return sum;
	}
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}
	unselect() {
		this.selected = false;
		this.powerup.scaleY = 1;
		var fileId = "powerupChange";
		EventBus.dispatch("playSound", fileId);
	}
	select() {
		var fileId = "powerupActivated";
		EventBus.dispatch("playSound", fileId);
		if (this.getSum() > 0) {
			EventBus.dispatch("selectPowerUp", this);
			this.selected = true;
			this.powerup.scaleY = 1.1;
		}
	}
	getId() {
		return this.config.type;
	}
	getPower() {
		return PowerupsData[this.config.type].extras;
	}

	private activatePowerup() {
		var flag = this.selected;
		EventBus.dispatch("unselectAllInBag");
		if (flag) {
			this.unselect();
		} else {
			this.select();
		}

	}

	private drawPowerup() {
		var image = PowerupsData[this.config.type].data.images[0];
		this.powerup = new createjs.Bitmap(this.config.loader.getResult(image));
		this.addChild(this.powerup);
	}

	private initText() {
		this.number = new createjs.Text();
		this.number.text = this.shopped + "";
		this.number.font = "bold 40px Arial";
		this.number.color = "blue";
		this.number.x = this.powerup.getTransformedBounds().width - this.number.getMeasuredWidth();
		this.number.y = this.powerup.getTransformedBounds().height - this.number.getMeasuredHeight();
		this.addChild(this.number);
	}

	private setText(text) {
		this.number.text = text;
	}

	getWidth() {
		return this.getTransformedBounds().width;
	}

	removeFromField() {
		if (this.fromField) {
			this.fromField--
		} else {
			this.fromShop--
		}
		var sum = this.fromField + this.fromShop;
		this.checkCount(sum);
		this.setText(sum);
		if (sum == 0) {
			this.alpha = 0;
		}
	}

	getType() {
		return this.config.type;
	}

	addShopPowerup() {
		this.fromShop++;
		this.shopped++;
		var sum = this.fromField + this.fromShop;
		this.checkCount(sum);
		this.setText(sum);
		if (sum > 0) {
			this.alpha = 1;
		}
	}

	removeShopPowerup() {
		this.fromShop = 0;
		this.shopped = 0;
	}

	addFieldPowerup() {
		this.fromField++;
		var sum = this.fromField + this.fromShop;
		this.checkCount(sum);
		this.setText(sum);
		if (sum > 0) {
			this.alpha = 1;
		}
	}

	removeFieldPowerup() {
		this.fromField--;
	}

	persist() {
		var data : any = {};
		data.type = this.config.type;
		//data.fromShop = this.fromShop;
		data.shopped = this.shopped;
		return data;
	}


}


