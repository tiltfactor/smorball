/// <reference path="../../typings/smorball/smorball.d.ts" />


class ShopScreen extends ScreenBase
{
	cashEl: HTMLElement;

	background: StarBackground;

	constructor() {
		super("shopScreen", "shop_screen_html");
	}

	init() {
		super.init();	

		// Grab these from the dom
		this.cashEl = <HTMLImageElement>$("#shopScreen .cashbar").get(0);
		
		// Create the anuimated star background
		this.background = new StarBackground();
		this.addChild(this.background);

		// Listen for some things
		$("#shopScreen .back").click(() => smorball.screens.open(smorball.screens.map));
		
		$("#shopScreen .items").mCustomScrollbar({
			scrollbarPosition: "outside",
			theme: "smorball"
		});

		// Handle the buy button
		$("#shopScreen .shop-item button").click(e => this.onItemButtonClicked(e));

		this.updateItems();
	}

	onItemButtonClicked(e: JQueryEventObject) {

		// Find the index in the items list
		var el = <HTMLElement>e.currentTarget;
		var indx = $("#shopScreen .shop-item").index(el.parentElement.parentElement);

		// Buy or sell
		if (smorball.upgrades.upgradesOwned[indx]) smorball.upgrades.sell(indx);
		else smorball.upgrades.purchase(indx);

		// Play sound
		smorball.audio.playSound("purchase_item_sound");

		// Refresh the view
		this.updateItems();
		this.cashEl.textContent = smorball.user.cash + "";
	}

	show() {
		super.show();
		this.cashEl.textContent = smorball.user.cash + "";
		this.updateItems();
	}

	update(delta: number) {
		this.background.update(delta);
	}

	updateItems() {


		$("#shopScreen .shop-item").each((i, e) => {

			var upgrade = smorball.upgrades.upgrades[i];
			var isOwned = smorball.upgrades.upgradesOwned[i];
			var isLocked = smorball.upgrades.isUpgradeLocked(i);

			$(e).removeClass("purchased");
			$(e).removeClass("too-expensive");
			$(e).removeClass("locked");

			if (isLocked) {
				$(e).find("button").text("LOCKED");
				$(e).addClass("locked");
			}
			else {
				if (isOwned) {
					$(e).addClass("purchased");
					$(e).find("button").text("SELL");
				}
				else {
					$(e).find("button").text("BUY");
					if (upgrade.price > smorball.user.cash)
						$(e).addClass("too-expensive");
				}
			} 

			$(e).find(".title").text(upgrade.name);
			$(e).find(".description").text(upgrade.description);
			$(e).find(".price").text("$"+upgrade.price);
			$(e).find(".icon").attr("src", "images/Clubhouse/" + upgrade.icon + ".png");

		});


	}


	
}