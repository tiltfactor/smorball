class PowerupHudIcon extends createjs.Container {

	icon: createjs.Bitmap;
	quantityOutline: createjs.Text;
	quantity: createjs.Text;

	type: string;
	isSelected: boolean;

	private counter: number;

	constructor(type:string) {
		super();

		this.counter = 0;
		this.type = type;
		this.icon = new createjs.Bitmap(smorball.resources.getResource(type + "_icon"));
		this.icon.regX = this.icon.getBounds().width / 2;
		this.icon.regY = this.icon.getBounds().height / 2;
		this.addChild(this.icon);

		this.quantity = new createjs.Text();
		this.quantity.font = "70px Boogaloo";
		this.quantity.text = "2";
		this.quantity.color = "#207a46";
		this.quantity.x = 20;
		this.quantity.y = 0;
		this.addChild(this.quantity);

		this.quantityOutline = new createjs.Text();
		this.quantityOutline.font = this.quantity.font;
		this.quantityOutline.text = this.quantity.text;
		this.quantityOutline.color = "white"; 
		this.quantityOutline.x = this.quantity.x;
		this.quantityOutline.y = this.quantity.y;
		this.quantity.outline = 8;
		this.addChild(this.quantityOutline);

		this.icon.mouseEnabled = true;
		this.icon.cursor = "pointer";
		this.icon.on("click",() => this.onClick());
	}

	private onClick() {
		smorball.screens.game.selectPowerup(this);
	}

	select() {
		this.isSelected = true;
		this.icon.image = smorball.resources.getResource(this.type + "_selected_icon");
	}

	deselect() {
		this.icon.scaleX = this.icon.scaleY = 1;
		this.isSelected = false;
		this.icon.image = smorball.resources.getResource(this.type + "_icon");
	}

	update(delta: number) {

		// Update the visibilities
		var quantity = smorball.powerups.quantities[this.type];
		if (quantity == 0) this.visible = false;
		else if (quantity == 1) {
			this.visible = true;
			this.quantity.visible = this.quantityOutline.visible = false;
		}
		else {
			this.quantity.visible = this.quantityOutline.visible = true;
			this.quantity.text = this.quantityOutline.text = quantity + "";
		}

		// If we are selected then slowly pulse to indicate that
		if (this.isSelected) {
			this.counter += delta;
			this.icon.scaleX = this.icon.scaleY = 1.1 + Math.sin(this.counter * 4) * 0.1; 
		}
		
	}


}