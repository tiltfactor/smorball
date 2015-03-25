/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../data/shopdata.ts" />
var ShopController = (function () {
    function ShopController(config) {
        this.config = config;
    }
    ShopController.prototype.init = function () {
        this.config.bag = [];
        this.initial = true;
        this.loadEvents();
        this.config.products = [];
        this.generateDiv();
    };
    ShopController.prototype.generateDiv = function () {
        var template = $("#shopComponents").html();
        var compile = _.template(template);
        $(".itemDiv").append(compile({ items: shopData }));
    };
    ShopController.prototype.resetAll = function () {
        this.config.bag = [];
        this.initial = true;
        this.config.products = [];
    };
    ShopController.prototype.loadEvents = function () {
        var _this = this;
        EventBus.addEventListener("exitShop", this.hideShop);
        EventBus.addEventListener("addToBag", function (ob) { return _this.addToBag(ob.target); });
        EventBus.addEventListener("removeFromBag", function (ob) { return _this.removeFromBag(ob.target); });
        EventBus.addEventListener("showShop", function () { return _this.showShop(); });
    };
    ShopController.prototype.showShop = function () {
        this.score = new Score({ "gameState": this.config.gameState });
        var money = this.score.getMyMoney();
        $(".wallet").text(money);
        this.config.stage.removeAllChildren();
        this.resetAll();
        EventBus.dispatch("hideAll");
        this.setUpgradeStatus();
        this.setLockedStatus();
        $("#shopOuterWrapper").css("display", "block");
        $('.scrollContainer').mCustomScrollbar({ theme: "rounded", axis: "y", setWidth: "100%", scrollButtons: { enable: true } });
    };
    ShopController.prototype.setUpgradeStatus = function () {
        var _this = this;
        $(".wallet").text(this.score.getMyMoney());
        var innerItems = $(".itemDiv").children().filter(".innerItem").find(".innerDiv");
        _.each(innerItems, function (item) {
            $(item).find(".upgrade").unbind("click");
            var price = _this.getPrice(item.id);
            if (price > _this.score.getMyMoney()) {
                $(item).find(".upgrade").unbind("click");
                $(item).find(".upgrade").css("background-image", "url(shapes/btn1_grey.png)");
                $(item).find(".upgrade").text("$" + price);
                $(item).find(".upgrade").click(function () {
                    EventBus.dispatch("playSound", "insufficientMoney");
                });
            }
            else if (price <= _this.score.getMyMoney()) {
                $(item).find(".upgrade").click(function () {
                    EventBus.dispatch("playSound", "purchaseItem");
                    EventBus.dispatch("addToBag", _this.parentElement);
                });
                $(item).find(".upgrade").css("background-image", "url(shapes/btn_bg.png)");
                $(item).find(".upgrade").text("$" + price);
            }
            _.each(_this.config.myBag.myBag, function (upgrade) {
                if (upgrade.shopped > 0 && upgrade.getType() == item.id) {
                    var btn = $(item).find(".upgrade");
                    _this.setButtonDown(btn);
                }
            });
            _.each(_this.config.gameState.gs.sponserShips, function (sponser) {
                if (sponser == item.id) {
                    var btn = $(item).find(".upgrade");
                    _this.setButtonDown(btn);
                }
            });
            var btn = $(item).find(".upgrade");
            if (item.id == "strength" && _this.config.gameState.gs.knockBack == 0.15) {
                _this.setButtonDown(btn);
            }
            if (item.id == "breakfast" && _this.config.gameState.gs.extraDamage == 2) {
                _this.setButtonDown(btn);
            }
            if (item.id == "nightclass" && _this.config.gameState.gs.penalty == 1000) {
                _this.setButtonDown(btn);
            }
        });
    };
    ShopController.prototype.setLockedStatus = function () {
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
    };
    ShopController.prototype.setButtonDown = function (btn) {
        var _this = this;
        btn.unbind("click");
        btn.css("background-image", "url(shapes/btn1_down.png)");
        btn.click(function () {
            EventBus.dispatch("removeFromBag", _this.parentElement);
        });
    };
    ShopController.prototype.getPrice = function (id) {
        var price = _.pick(_.where(shopData, { "id": id })[0], "price");
        return price.price;
    };
    ShopController.prototype.getUnlockStatus = function (id) {
        var json = _.where(shopData, { "id": id });
        return json[0].unlocksAt;
    };
    ShopController.prototype.showMap = function () {
        EventBus.dispatch("exitShop");
    };
    ShopController.prototype.addToBag = function (ob) {
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
        this.setUpgradeStatus();
    };
    ShopController.prototype.removeFromBag = function (ob) {
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
    };
    ShopController.prototype.hideShop = function () {
        EventBus.dispatch("hideAll");
        EventBus.dispatch("showMap");
    };
    ShopController.prototype.persist = function () {
    };
    return ShopController;
})();
