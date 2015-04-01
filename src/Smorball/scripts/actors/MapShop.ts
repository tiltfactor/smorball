/// <reference path="../../typings/smorball/smorball.d.ts" />

class MapShop extends createjs.Container {

	lock: createjs.Bitmap;
	shop: createjs.Bitmap;

	constructor() {
		super();

		// Add the lock
		this.lock = new createjs.Bitmap(smorball.resources.getResource("map_lock"));
		this.lock.x = -64;
		this.lock.y = -131;
		this.addChild(this.lock);

		// Add the shop
		this.shop = new createjs.Bitmap(smorball.resources.getResource("shop_icon"));
		this.shop.x = -70;
		this.shop.y = -188;	
		this.shop.cursor = "pointer";
		this.shop.mouseEnabled = true;
		this.shop.on("click",() => smorball.screens.open(smorball.screens.shop));
		this.addChild(this.shop);
	
		this.updateLockedState();
	}

	updateLockedState() {

		if (smorball.upgrades.isShopUnlocked()) {
			this.lock.visible = false;
			this.shop.visible = true;
		}
		else {
			this.lock.visible = true;
			this.shop.visible = false;
		}
	}
}

