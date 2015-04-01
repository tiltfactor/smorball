/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScreensManager = (function (_super) {
    __extends(ScreensManager, _super);
    function ScreensManager() {
        _super.call(this);
        this.menus = [];
        this.main = this.addMenu(new MainMenu());
        this.options = this.addMenu(new OptionsMenu());
        this.map = this.addMenu(new MapScreen());
        this.loadingLevel = this.addMenu(new LoadingLevelScreen());
        this.game = this.addMenu(new GameScreen());
        this.instructions = this.addMenu(new InstructionsScreen());
        this.shop = this.addMenu(new ShopScreen());
    }
    ScreensManager.prototype.addMenu = function (menu) {
        this.addChild(menu);
        this.menus.push(menu);
        return menu;
    };
    ScreensManager.prototype.init = function () {
        // Add the DOM element to the stage, this allows us to scale and position correctly
        this.container = new createjs.DOMElement(document.getElementById("menusContainer"));
        this.addChild(this.container);
        // init each menu
        _.each(this.menus, function (m) { return m.init(); });
        // Make sure we start off hidden
        _.each(this.menus, function (m) { return m.hide(); });
    };
    ScreensManager.prototype.open = function (menu) {
        if (this.current)
            this.current.hide();
        menu.show();
        this.current = menu;
    };
    ScreensManager.prototype.update = function (delta) {
        if (this.current != null)
            this.current.update(delta);
    };
    return ScreensManager;
})(createjs.Container);
