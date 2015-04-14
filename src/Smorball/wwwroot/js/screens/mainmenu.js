/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        _super.call(this, "mainMenu", "main_menu_html");
    }
    MainMenu.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        // Grab some bits from the DOM
        this.newGameContinue = document.getElementById("newGameContinue");
        this.confirmEraseGame = document.getElementById("confirmEraseGame");
        // Add listeners to the main menu buttons
        $("#mainMenuPlayBtn").click(function () { return _this.onPlayClicked(); });
        $("#mainMenuOptionsBtn").click(function () { return _this.onOptionsClicked(); });
        $("#mainMenuHelpBtn").click(function () { return _this.onHelpClicked(); });
        $("#newGameButton").click(function () { return _this.confirmEraseGame.hidden = false; });
        $("#confirmEraseCurrentGameButton").click(function () { return _this.newGame(); });
        $("#cancelEraseCurrentGameButton").click(function () { return _this.confirmEraseGame.hidden = true; });
        $("#continueGameButton").click(function () { return smorball.screens.open(smorball.screens.map); });
    };
    MainMenu.prototype.show = function () {
        _super.prototype.show.call(this);
        // These popups start off hidden
        this.newGameContinue.hidden = this.confirmEraseGame.hidden = true;
    };
    MainMenu.prototype.onPlayClicked = function () {
        // If there is no currently active saved game, just jump straight into it
        if (!smorball.user.hasSaveGame)
            this.newGame();
        else
            this.newGameContinue.hidden = false;
    };
    MainMenu.prototype.newGame = function () {
        smorball.user.newGame();
        smorball.screens.open(smorball.screens.map);
    };
    MainMenu.prototype.onOptionsClicked = function () {
        smorball.screens.open(smorball.screens.options);
    };
    MainMenu.prototype.onHelpClicked = function () {
        smorball.screens.instructions.backMenu = smorball.screens.main;
        smorball.screens.open(smorball.screens.instructions);
    };
    MainMenu.prototype.update = function (delta) {
    };
    return MainMenu;
})(ScreenBase);
