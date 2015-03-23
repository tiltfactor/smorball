/// <reference path="mypowerup.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
var MyBag = (function () {
    function MyBag(config) {
        this.config = config;
        this.myBag = [];
        this.selectedId = -1;
        this.initialize();
    }
    MyBag.prototype.initialize = function () {
        this.loadEvents();
        this.loadBag();
    };
    MyBag.prototype.loadBag = function () {
        var store = new LocalStorage();
        var data = store.getFromStore();
        var inbag = data.myBag || this.loadInitBag();
        this.createMyPowerup(inbag);
    };
    MyBag.prototype.createMyPowerup = function (inbag) {
        for (var i = 0; i < inbag.length; i++) {
            var p = inbag[i];
            var config = { "type": p.type, "shopped": p.shopped, "loader": this.config.loader };
            var myPowerup = new MyPowerup(config);
            this.myBag.push(myPowerup);
        }
    };
    MyBag.prototype.loadInitBag = function () {
        var arr = [];
        for (var key in PowerupsData) {
            if (PowerupsData.hasOwnProperty(key)) {
                var data = { "type": key };
                arr.push(data);
            }
        }
        return arr;
    };
    MyBag.prototype.loadEvents = function () {
        var _this = this;
        var st = function () {
            _this.selectOnTab();
        };
        EventBus.addEventListener("selectOnTab", st);
    };
    MyBag.prototype.unselectAll = function () {
        var myPowerup = _.findWhere(this.myBag, { selected: true });
        if (myPowerup)
            myPowerup.unselect();
    };
    MyBag.prototype.selectOnTab = function () {
        EventBus.dispatch("unselectAllInBag");
        var mp;
        this.selectedPowerupOnTab();
        if (this.myBag[this.selectedId] != undefined) {
            this.myBag[this.selectedId].select();
        }
        else {
            this.selectedId = -1;
        }
    };
    MyBag.prototype.selectedPowerupOnTab = function () {
        do {
            ++this.selectedId;
            if (this.selectedId >= this.myBag.length) {
                this.selectedId = -1;
                return;
            }
        } while (this.myBag[this.selectedId].getSum() <= 0);
    };
    MyBag.prototype.addToBagFromField = function (powerup) {
        var myPowerup = this.getMyPowerupByType(powerup.getType());
        myPowerup.addFieldPowerup();
    };
    MyBag.prototype.addToBagFromShop = function (powerupId) {
        var myPowerup = this.getMyPowerupByType(powerupId);
        myPowerup.addShopPowerup();
    };
    MyBag.prototype.removeFromBag = function (powerup) {
        var myPowerup = this.getMyPowerupByType(powerup.getType());
        myPowerup.unselect();
        myPowerup.removeFromField();
    };
    MyBag.prototype.removeFromBagToShop = function (powerupId) {
        var myPowerup = this.getMyPowerupByType(powerupId);
        myPowerup.removeShopPowerup();
    };
    MyBag.prototype.getMyPowerupByType = function (type) {
        for (var i = 0; i < this.myBag.length; i++) {
            var myPowerup = this.myBag[i];
            if (myPowerup.getType() == type) {
                return myPowerup;
            }
        }
        return null;
    };
    MyBag.prototype.persist = function () {
        var myBag = [];
        for (var i = 0; i < this.myBag.length; i++) {
            var mp = this.myBag[i];
            myBag.push(mp.persist());
        }
        return myBag;
    };
    MyBag.prototype.reset = function () {
        this.myBag = [];
        var inbag = this.loadInitBag();
        this.createMyPowerup(inbag);
    };
    MyBag.prototype.newGame = function () {
        this.selectedId = -1;
        this.myBag = [];
        this.loadBag();
    };
    return MyBag;
})();
