

class UpgradesManager {
	
	upgrades: Upgrade[];
	upgradesOwned = [false, false, false, false, false, false, false, false, false];

	constructor() {
	}

	init() {
		this.upgrades = <Upgrade[]>smorball.resources.getResource("upgrade_data");
	}

	newLevel() {
		if (this.isOwned("cleats")) smorball.powerups.powerups.cleats.quantity++;
		if (this.isOwned("helmet")) smorball.powerups.powerups.helmet.quantity++;
		if (this.isOwned("bullhorn")) smorball.powerups.powerups.bullhorn.quantity++;
		if (this.isOwned("snike")) smorball.powerups.powerups.bullhorn.spawnRateMultiplier = this.getUpgrade("snike").multiplier;
		if (this.isOwned("bawling")) smorball.powerups.powerups.bullhorn.spawnRateMultiplier = this.getUpgrade("bawling").multiplier;
		if (this.isOwned("loudmouth")) smorball.powerups.powerups.bullhorn.spawnRateMultiplier = this.getUpgrade("loudmouth").multiplier;
		if (this.isOwned("nightclass")) smorball.captchas.confusedTimeMuliplier = this.getUpgrade("nightclass").multiplier;
	}

	isUpgradeLocked(indx: number) {
		return (smorball.user.getHighestUnlockedLevel()+2) <= this.upgrades[indx].unlocksAt;
	}

	isShopUnlocked(): boolean {
		return smorball.user.levels.length > 1;
	}

	purchase(upgrade: number) {
		this.upgradesOwned[upgrade] = true;
		smorball.user.cash -= this.upgrades[upgrade].price;
		smorball.persistance.persist();
	}

	sell(upgrade: number) {
		this.upgradesOwned[upgrade] = false;
		smorball.user.cash += this.upgrades[upgrade].price;
		smorball.persistance.persist();
	}

	getUpgrade(id: string): Upgrade {
		return _.find(this.upgrades, u => u.id == id);
	}

	isOwned(id: string) {
		var u = this.getUpgrade(id);
		return this.upgradesOwned[this.upgrades.indexOf(u)];
	}

}