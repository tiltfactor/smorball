/// <reference path="mypowerup.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />

class MyBag {

	config: any;

	myBag: any[];
	selectedId: number;


	constructor(config: any) {
		this.config = config;
        this.myBag = [];
        this.selectedId = -1;
        this.initialize();
	}

	private initialize() {
		this.loadEvents();
		this.loadBag();
	}

	private loadBag() {
		var store = new LocalStorage();
		var data = store.getFromStore();
		var inbag = data.myBag || this.loadInitBag();
		this.createMyPowerup(inbag);
	}

	private createMyPowerup(inbag) {
		for (var i = 0; i < inbag.length; i++) {
			var p = inbag[i];
			var config = { "type": p.type, "shopped": p.shopped, "loader": this.config.loader };
			var myPowerup = new MyPowerup(config);
			this.myBag.push(myPowerup);
		}
	}

	private loadInitBag() {
		var arr = [];
		for (var key in PowerupsData) {
			if (PowerupsData.hasOwnProperty(key)) {
				var data = { "type": key };
				arr.push(data);
			}
		}
		return arr;
	}

	private loadEvents() {
		var st = () => { this.selectOnTab() };
		EventBus.addEventListener("selectOnTab", st);
	}

	unselectAll() {
		var myPowerup = _.findWhere(this.myBag, { selected: true });
		if (myPowerup)
			myPowerup.unselect();

	}

	private selectOnTab() {
		EventBus.dispatch("unselectAllInBag");
		var mp;
		this.selectedPowerupOnTab();
		if (this.myBag[this.selectedId] != undefined) {
			this.myBag[this.selectedId].select();
		} else {
			this.selectedId = -1;
		}

	}

	private selectedPowerupOnTab() {

		do {
			++this.selectedId;
			if (this.selectedId >= this.myBag.length) {
				this.selectedId = -1;
				return;
			}
		} while (this.myBag[this.selectedId].getSum() <= 0)
	}

	addToBagFromField(powerup) {
		var myPowerup = this.getMyPowerupByType(powerup.getType());
		myPowerup.addFieldPowerup();
	}

	addToBagFromShop(powerupId) {
		var myPowerup = this.getMyPowerupByType(powerupId);
		myPowerup.addShopPowerup();
	}

	removeFromBag(powerup) {
		var myPowerup = this.getMyPowerupByType(powerup.getType());
		myPowerup.unselect();
		myPowerup.removeFromField();
	}

	private removeFromBagToShop(powerupId) {
		var myPowerup = this.getMyPowerupByType(powerupId);
		myPowerup.removeShopPowerup();
	}

	private getMyPowerupByType(type) {
		for (var i = 0; i < this.myBag.length; i++) {
			var myPowerup = this.myBag[i];
			if (myPowerup.getType() == type) {
				return myPowerup;
			}
		}
		return null;
	}

	persist() {
		var myBag = [];
		for (var i = 0; i < this.myBag.length; i++) {
			var mp = this.myBag[i];
			myBag.push(mp.persist());
		}
		return myBag;
	}

	reset() {
		this.myBag = [];
		var inbag = this.loadInitBag();
		this.createMyPowerup(inbag);
	}

	newGame() {
		this.selectedId = -1;
		this.myBag = [];
		this.loadBag();
	}

}


