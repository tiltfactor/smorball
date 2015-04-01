/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameScreen = (function (_super) {
    __extends(GameScreen, _super);
    function GameScreen() {
        _super.call(this, "gameScreen", "game_screen_html");
    }
    GameScreen.prototype.init = function () {
        _super.prototype.init.call(this);
        this.stadium = new Stadium();
        this.stadium.init();
        this.addChild(this.stadium);
        this.opponentsEl = $("#gameScreen .opponents").get(0);
        this.scoreEl = $("#gameScreen .score").get(0);
        this.captchas = new createjs.Container();
        this.addChild(this.captchas);
        this.actors = new createjs.Container();
        this.addChild(this.actors);
        this.bubble = new CommentatorBubble();
        this.bubble.x = 800;
        this.bubble.y = 314;
        this.addChild(this.bubble);
        this.timeoutEl = $('#gameScreen .timeout').get(0);
        this.victoryEl = $('#gameScreen .victory').get(0);
        this.defeatEl = $('#gameScreen .defeat').get(0);
        // Setup the music slider and listen for changes to it
        $('#gameScreen .timeout .music-slider').slider({ value: smorball.audio.musicVolume * 100 }).on("slide", function (e) { return smorball.audio.setMusicVolume(e.value / 100); });
        // Setup the sound slider and listen for changes
        $('#gameScreen .timeout .sound-slider').slider({ value: smorball.audio.soundVolume * 100 }).on("slide", function (e) { return smorball.audio.setSoundVolume(e.value / 100); });
        $("#gameScreen .menu").click(function () { return smorball.game.timeout(); });
        $('#gameScreen .timeout button.close').click(function () { return smorball.game.resume(); });
        $('#gameScreen .timeout button.quit').click(function () { return smorball.game.returnToMap(); });
        $('#gameScreen .timeout button.help').click(function () { return smorball.game.help(); });
        $('#gameScreen button.continue').click(function () { return smorball.game.returnToMap(); });
    };
    GameScreen.prototype.newGame = function () {
        this.timeoutEl.hidden = true;
        this.captchas.visible = true;
        this.victoryEl.hidden = true;
        this.defeatEl.hidden = true;
        this.bubble.visible = false;
        this.actors.removeAllChildren();
        this.captchas.removeAllChildren();
        this.stadium.setTeam(smorball.game.level.team);
    };
    GameScreen.prototype.showVictory = function (cashEarnt) {
        this.victoryEl.hidden = false;
        $('#gameScreen .victory .cashbar-small').text(cashEarnt + "").focus();
    };
    GameScreen.prototype.showDefeat = function (cashEarnt) {
        this.defeatEl.hidden = false;
        $('#gameScreen .defeat .cashbar-small').text(cashEarnt + "").focus();
    };
    GameScreen.prototype.update = function (delta) {
        this.opponentsEl.textContent = (smorball.spawning.enemySpawnsThisLevel - smorball.game.enemiesKilled) + "";
        this.scoreEl.textContent = smorball.game.getScore() + "";
        // Sort by depth
        this.actors.sortChildren(function (a, b) { return a.y - b.y; });
    };
    return GameScreen;
})(ScreenBase);
