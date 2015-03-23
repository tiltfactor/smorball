/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MyPowerup = (function (_super) {
    __extends(MyPowerup, _super);
    function MyPowerup(config) {
        this.config = config;
        _super.call(this);
        this.shopped = this.config.shopped || 0;
        this.fromShop = this.shopped || 0;
        this.fromField = 0;
        this.selected = false;
        this.reset();
        this.drawPowerup();
        this.initText();
        this.loadEvents();
        this.checkCount(this.getSum());
    }
    MyPowerup.prototype.loadEvents = function () {
        var _this = this;
        this.events = {};
        this.events.click = function () {
            _this.activatePowerup();
        };
        //this.addEventListener("click", this.events.click)
    };
    MyPowerup.prototype.checkCount = function (sum) {
        if (sum > 0) {
            this.addEventListener("click", this.events.click);
        }
        else {
            this.removeEventListener("click", this.events.click);
        }
    };
    MyPowerup.prototype.reset = function () {
        this.fromField = 0;
        var sum = this.getSum() + this.shopped;
        if (sum > 0) {
            this.alpha = 1;
        }
        else {
            this.alpha = 0;
        }
        if (this.number) {
            this.number.text = this.shopped + "";
        }
    };
    MyPowerup.prototype.getSum = function () {
        var sum = this.fromField + this.fromShop;
        return sum;
    };
    MyPowerup.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    MyPowerup.prototype.unselect = function () {
        this.selected = false;
        this.powerup.scaleY = 1;
        var fileId = "powerupChange";
        EventBus.dispatch("playSound", fileId);
    };
    MyPowerup.prototype.select = function () {
        var fileId = "powerupActivated";
        EventBus.dispatch("playSound", fileId);
        if (this.getSum() > 0) {
            EventBus.dispatch("selectPowerUp", this);
            this.selected = true;
            this.powerup.scaleY = 1.1;
        }
    };
    MyPowerup.prototype.getId = function () {
        return this.config.type;
    };
    MyPowerup.prototype.getPower = function () {
        return PowerupsData[this.config.type].extras;
    };
    MyPowerup.prototype.activatePowerup = function () {
        var flag = this.selected;
        EventBus.dispatch("unselectAllInBag");
        if (flag) {
            this.unselect();
        }
        else {
            this.select();
        }
    };
    MyPowerup.prototype.drawPowerup = function () {
        var image = PowerupsData[this.config.type].data.images[0];
        this.powerup = new createjs.Bitmap(this.config.loader.getResult(image));
        this.addChild(this.powerup);
    };
    MyPowerup.prototype.initText = function () {
        this.number = new createjs.Text();
        this.number.text = this.shopped + "";
        this.number.font = "bold 40px Arial";
        this.number.color = "blue";
        this.number.x = this.powerup.getTransformedBounds().width - this.number.getMeasuredWidth();
        this.number.y = this.powerup.getTransformedBounds().height - this.number.getMeasuredHeight();
        this.addChild(this.number);
    };
    MyPowerup.prototype.setText = function (text) {
        this.number.text = text;
    };
    MyPowerup.prototype.getWidth = function () {
        return this.getTransformedBounds().width;
    };
    MyPowerup.prototype.removeFromField = function () {
        if (this.fromField) {
            this.fromField--;
        }
        else {
            this.fromShop--;
        }
        var sum = this.fromField + this.fromShop;
        this.checkCount(sum);
        this.setText(sum);
        if (sum == 0) {
            this.alpha = 0;
        }
    };
    MyPowerup.prototype.getType = function () {
        return this.config.type;
    };
    MyPowerup.prototype.addShopPowerup = function () {
        this.fromShop++;
        this.shopped++;
        var sum = this.fromField + this.fromShop;
        this.checkCount(sum);
        this.setText(sum);
        if (sum > 0) {
            this.alpha = 1;
        }
    };
    MyPowerup.prototype.removeShopPowerup = function () {
        this.fromShop = 0;
        this.shopped = 0;
    };
    MyPowerup.prototype.addFieldPowerup = function () {
        this.fromField++;
        var sum = this.fromField + this.fromShop;
        this.checkCount(sum);
        this.setText(sum);
        if (sum > 0) {
            this.alpha = 1;
        }
    };
    MyPowerup.prototype.removeFieldPowerup = function () {
        this.fromField--;
    };
    MyPowerup.prototype.persist = function () {
        var data = {};
        data.type = this.config.type;
        //data.fromShop = this.fromShop;
        data.shopped = this.shopped;
        return data;
    };
    return MyPowerup;
})(createjs.Container);
