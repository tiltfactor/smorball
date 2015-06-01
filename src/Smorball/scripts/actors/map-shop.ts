/// <reference path="../../typings/smorball/smorball.d.ts" />

class MapShop extends createjs.Container {

	lock: createjs.Bitmap;
    shop: createjs.Bitmap;
    sign: createjs.Bitmap;

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
		this.shop.on("click",() => this.openShop());
        this.addChild(this.shop);

        // Add the sign
        this.sign = new createjs.Bitmap(smorball.resources.getResource("spend_your_winnings_banner"));
        this.sign.regX = 467;
        this.sign.regY = 100;
        this.sign.y = -200;
        this.sign.visible = false;
        this.addChild(this.sign);
	
		this.updateLockedState();
    }

    openShop() {
        smorball.screens.open(smorball.screens.shop);
        createjs.Tween.removeTweens(this.sign);
        createjs.Tween.get(this.sign)
            .to({ scaleX: 0, scaleY: 0 }, 500, createjs.Ease.backIn);
    }

    show() {
        this.updateLockedState();	

        if (smorball.user.levels.length >= smorball.config.shopUnlockLevel && !smorball.user.hasShownShopSign)
            this.popupSign();
    }

    popupSign() {
        this.sign.visible = true;
        this.sign.scaleX = 0;
        this.sign.scaleY = 0;
        createjs.Tween.get(this.sign)
            .to({ scaleX: 1, scaleY: 1 }, 2000, createjs.Ease.elasticOut)
            .wait(3000)
            .to({ scaleX: 0, scaleY: 0 }, 500, createjs.Ease.backIn);
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

