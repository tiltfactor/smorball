var UpgradesManager = (function () {
    function UpgradesManager() {
        this.upgradesOwned = [false, false, false, false, false, false, false, false, false];
    }
    UpgradesManager.prototype.init = function () {
        this.upgrades = smorball.resources.getResource("shop_data");
    };
    UpgradesManager.prototype.isUpgradeLocked = function (indx) {
        return (smorball.user.getHighestUnlockedLevel() + 2) <= this.upgrades[indx].unlocksAt;
    };
    UpgradesManager.prototype.isShopUnlocked = function () {
        return smorball.user.levels.length > 1;
    };
    UpgradesManager.prototype.purchase = function (upgrade) {
        this.upgradesOwned[upgrade] = true;
        smorball.user.cash -= this.upgrades[upgrade].price;
        smorball.persistance.persist();
    };
    UpgradesManager.prototype.sell = function (upgrade) {
        this.upgradesOwned[upgrade] = false;
        smorball.user.cash += this.upgrades[upgrade].price;
        smorball.persistance.persist();
    };
    return UpgradesManager;
})();
