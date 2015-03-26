/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../data/shopdata.ts" />

class ShopController {

	stage: createjs.Stage;

	initial: boolean;
	score: Score;
	parentElement: any;

	bag: any;
	products: any;

	constructor(stage: createjs.Stage) {
		this.stage = stage;
	}

	init() {
		this.bag = [];
        this.initial = true;
        this.loadEvents();
        this.products = [];
        this.generateDiv()
	}

	private generateDiv() {
		var template = $("#shopComponents").html();
		var compile = _.template(template);
		$(".itemDiv").append(compile({ items: shopData }));

	}
	private resetAll() {
		this.bag = [];
		this.initial = true;
		this.products = [];
	}

	private loadEvents() {
		EventBus.addEventListener("exitShop", this.hideShop);
		EventBus.addEventListener("addToBag", ob => this.addToBag(ob.target));
		EventBus.addEventListener("removeFromBag", ob => this.removeFromBag(ob.target));
		EventBus.addEventListener("showShop",() => this.showShop());
	}

	private showShop() {
		this.score = new Score();
		var money = this.score.getMyMoney();
		$(".wallet").text(money);
		this.config.stage.removeAllChildren();
		this.resetAll();
		EventBus.dispatch("hideAll");
		this.setUpgradeStatus();
		this.setLockedStatus();
		$("#shopOuterWrapper").css("display", "block");
		$('.scrollContainer').mCustomScrollbar({ theme: "rounded", axis: "y", setWidth: "100%", scrollButtons: { enable: true } });

	}

	private setUpgradeStatus() {
		$(".wallet").text(this.score.getMyMoney());
		var innerItems = $(".itemDiv").children().filter(".innerItem").find(".innerDiv");
		_.each(innerItems, (item) => {
			$(item).find(".upgrade").unbind("click");
			var price = this.getPrice(item.id);
			if (price > this.score.getMyMoney()) {
				$(item).find(".upgrade").unbind("click");
				$(item).find(".upgrade").css("background-image", "url(shapes/btn1_grey.png)");
				$(item).find(".upgrade").text("$" + price);
				$(item).find(".upgrade").click(() => { EventBus.dispatch("playSound", "insufficientMoney") });
			} else if (price <= this.score.getMyMoney()) {
				$(item).find(".upgrade").click(() => { EventBus.dispatch("playSound", "purchaseItem"); EventBus.dispatch("addToBag", this.parentElement); });
				$(item).find(".upgrade").css("background-image", "url(shapes/btn_bg.png)");
				$(item).find(".upgrade").text("$" + price)
			}
			_.each(this.config.myBag.myBag, (upgrade:any) => {
				if (upgrade.shopped > 0 && upgrade.getType() == item.id) {
					var btn = $(item).find(".upgrade");
					this.setButtonDown(btn);
				}
			});
			_.each(this.config.gameState.gs.sponserShips, (sponser) => {
				if (sponser == item.id) {
					var btn = $(item).find(".upgrade");
					this.setButtonDown(btn);
				}
			});
			var btn = $(item).find(".upgrade");
			if (item.id == "strength" && this.config.gameState.gs.knockBack == 0.15) {
				this.setButtonDown(btn)
			}
			if (item.id == "breakfast" && this.config.gameState.gs.extraDamage == 2) {
				this.setButtonDown(btn);
			}
			if (item.id == "nightclass" && this.config.gameState.gs.penalty == 1000) {
				this.setButtonDown(btn)
			}


		});

	}

	private setLockedStatus() {
		var innerItems = $(".itemDiv").children().filter(".innerItem").find(".innerDiv");
		_.each(innerItems, function (item) {
			var id = item.id;
			var unlocksAt = this.getUnlockStatus(id);
			if (unlocksAt > this.config.gameState.gs.maxLevel) {
				$(item).find(".upgrade").unbind("click");
				$(item).find(".upgrade").css("background-image", "url(shapes/btn1_grey.png)");
				$(item).find(".upgrade").text("Locked");
			}


		});
	}

	private setButtonDown(btn) {
		btn.unbind("click");
		btn.css("background-image", "url(shapes/btn1_down.png)");
		btn.click(() => { EventBus.dispatch("removeFromBag", this.parentElement) });
	}

	private getPrice(id) {
		var price = _.pick(_.where(shopData, { "id": id })[0], "price");
		return price.price;
	}

	private getUnlockStatus(id) {
		var json = _.where(shopData, { "id": id });
		return json[0].unlocksAt;
	}

	private showMap() {
		EventBus.dispatch("exitShop")
	}

	private addToBag(ob) {
		var btn = $(ob).find(".upgrade");
		var id = ob.id;
		btn.unbind("click");
		var type = $(ob).find(".title").attr("pType");
		if (type == "powerup") {
			this.config.myBag.addToBagFromShop(id);
		}
		if (type == "sponserShip") {
			var sponser = id;
			this.config.gameState.gs.sponserShips.push(sponser);
		}
		if (type == "strength") {
			this.config.gameState.gs.knockBack = 0.15;
		}
		if (type == "breakfast") {
			this.config.gameState.gs.extraDamage = 2;
		}
		if (type == "nightclass") {
			this.config.gameState.gs.penalty = 1000;
		}


		this.config.gameState.gs.dollorSpend += this.getPrice(id);

		this.setUpgradeStatus()

	}

	private removeFromBag(ob) {

		var btn = $(ob).find(".upgrade");
		btn.unbind("click");
		var id = ob.id;
		var type = $(ob).find(".title").attr("pType");
		if (type == "powerup") {
			this.config.myBag.removeFromBagToShop(id);
		}
		if (type == "sponserShip") {
			var sponser = id;
			this.config.gameState.gs.sponserShips.splice(sponser, 1);
		}
		if (type == "strength") {
			this.config.gameState.gs.knockBack = 0.1;
		}
		if (type == "breakfast") {
			this.config.gameState.gs.extraDamage = 1;
		}
		if (type == "nightclass") {
			this.config.gameState.gs.penalty = 2000;
		}

		this.config.gameState.gs.dollorSpend -= this.getPrice(id);
		this.setUpgradeStatus();

	}

	hideShop() {
		EventBus.dispatch("hideAll");
		EventBus.dispatch("showMap");
	}

	private persist() {

	}

}


