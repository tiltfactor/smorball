

class UpgradesManager {
	
	upgrades: Upgrade[];
	upgradesOwned = [false, false, false, false, false, false, false, false, false];

	constructor() {
	}

	init() {
		this.upgrades = <Upgrade[]>smorball.resources.getResource("upgrade_data");
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

}