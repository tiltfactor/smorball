/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Stadium = (function (_super) {
    __extends(Stadium, _super);
    function Stadium(config) {
        _super.call(this);
        this.config = config;
        this.labels = [];
        this.team = this.config.stadiumInfo.team;
        this.drawStadium();
        //drawShop(this);
        this.setPosition();
        this.addEventListener("mouseover", function (evt) {
            evt.target.cursor = 'pointer';
            EventBus.dispatch("changeLevelInfoBar", evt.target.parent);
        });
    }
    Stadium.prototype.drawStadium = function () {
        var _this = this;
        var stadiumBase = new createjs.Bitmap(this.config.loader.getResult("stadium_base"));
        this.addChild(stadiumBase);
        var stadium = new createjs.Bitmap(null);
        if (this.config.locked) {
            stadium.image = this.config.loader.getResult("lock");
            this.id = this.config.id;
            stadium.x = stadiumBase.getTransformedBounds().width / 4;
            stadium.y = -stadium.getTransformedBounds().height / 2;
            this.addChild(stadium);
        }
        else {
            stadium.image = this.config.loader.getResult("stadium");
            this.id = this.config.id;
            this.addEventListener("click", function (e) { return _this.startLevel(e); });
            stadium.x = stadiumBase.getTransformedBounds().width / 8;
            stadium.y = -stadium.getTransformedBounds().height / 4;
            this.addChild(stadium);
            this.drawLogo(stadium);
        }
    };
    Stadium.prototype.setPosition = function () {
        this.x = this.config.stadiumInfo.x;
        this.y = this.config.stadiumInfo.y;
    };
    Stadium.prototype.startLevel = function (e) {
        EventBus.dispatch("setLevel", e.target.parent.id);
    };
    Stadium.prototype.drawLogo = function (stadium) {
        var logo = new createjs.Bitmap(this.config.loader.getResult(this.config.stadiumInfo.logo));
        logo.setTransform(0, stadium.y, 1.1, 1.1);
        logo.y = stadium.y - logo.getTransformedBounds().height / 2 - 25;
        this.addChild(logo);
    };
    return Stadium;
})(createjs.Container);
