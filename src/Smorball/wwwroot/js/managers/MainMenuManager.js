/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MainMenuManager = (function (_super) {
    __extends(MainMenuManager, _super);
    function MainMenuManager() {
        _super.apply(this, arguments);
    }
    MainMenuManager.prototype.init = function () {
        this.menu = new createjs.DOMElement(document.getElementById("mainMenu"));
        this.addChild(this.menu);
    };
    return MainMenuManager;
})(createjs.Container);
