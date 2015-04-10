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
        var _this = this;
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
        this.indicator = new CorrectIncorrectIndicator();
        this.indicator.x = 800;
        this.indicator.y = 960;
        this.addChild(this.indicator);
        this.powerupIcons = [];
        var powerup = new PowerupHudIcon("helmet");
        powerup.x = 1220;
        powerup.y = 80;
        this.addChild(powerup);
        this.powerupIcons.push(powerup);
        var powerup = new PowerupHudIcon("cleats");
        powerup.x = 1360;
        powerup.y = 80;
        this.addChild(powerup);
        this.powerupIcons.push(powerup);
        var powerup = new PowerupHudIcon("bullhorn");
        powerup.x = 1500;
        powerup.y = 80;
        this.addChild(powerup);
        this.powerupIcons.push(powerup);
        this.timeoutEl = $('#gameScreen .timeout').get(0);
        this.victoryEl = $('#gameScreen .victory').get(0);
        this.defeatEl = $('#gameScreen .defeat').get(0);
        this.survivalEl = $('#gameScreen .survival').get(0);
        // Setup the music slider and listen for changes to it
        $('#gameScreen .timeout .music-slider').slider({ value: smorball.audio.musicVolume * 100 }).on("slide", function (e) { return smorball.audio.setMusicVolume(e.value / 100); });
        // Setup the sound slider and listen for changes
        $('#gameScreen .timeout .sound-slider').slider({ value: smorball.audio.soundVolume * 100 }).on("slide", function (e) { return smorball.audio.setSoundVolume(e.value / 100); });
        $("#gameScreen .menu").click(function () { return smorball.game.timeout(); });
        $('#gameScreen .timeout button.close').click(function () { return smorball.game.resume(); });
        $('#gameScreen .timeout button.quit').click(function () { return smorball.game.returnToMap(); });
        $('#gameScreen .timeout button.help').click(function () { return smorball.game.help(); });
        $('#gameScreen button.continue').click(function () { return smorball.game.returnToMap(); });
        $("#gameScreen .entry input").on("keydown", function (event) { return _this.onKeyDown(event); });
        // When any keyboard event happens focus the input
        window.onkeydown = function () {
            if (smorball.game.state == 2 /* Playing */) {
                $("#gameScreen .entry input").focus();
            }
        };
        this.framerate = new Framerate();
        this.framerate.x = smorball.config.width - 80;
        this.framerate.y = smorball.config.height - 60;
        this.addChild(this.framerate);
    };
    GameScreen.prototype.onKeyDown = function (event) {
        if (event.keyCode == 8) {
            smorball.audio.playSound("text_entry_backspace_sound", 0.5);
        }
        else if (event.keyCode == 9) {
        }
        else {
            smorball.audio.playSound("text_entry_4_sound", 0.2);
        }
    };
    GameScreen.prototype.newLevel = function () {
        this.timeoutEl.hidden = true;
        this.captchas.visible = true;
        this.victoryEl.hidden = true;
        this.defeatEl.hidden = true;
        this.survivalEl.hidden = true;
        this.selectPowerup(null);
        this.indicator.visible = false;
        this.bubble.visible = false;
        this.bubble.isOpen = false;
        this.actors.removeAllChildren();
        this.captchas.removeAllChildren();
        this.stadium.idleAudience();
        this.stadium.setTeam(smorball.game.level.team);
    };
    GameScreen.prototype.showTimeout = function () {
        console.log("timeout changed!");
        smorball.screens.game.timeoutEl.hidden = false;
        $('#gameScreen .timeout .music-slider').slider("setValue", smorball.audio.musicVolume * 100);
        $('#gameScreen .timeout .sound-slider').slider("setValue", smorball.audio.soundVolume * 100);
    };
    GameScreen.prototype.showVictory = function (cashEarnt) {
        this.victoryEl.hidden = false;
        $('#gameScreen .victory .cashbar-small').text(cashEarnt + "").focus();
    };
    GameScreen.prototype.showTimeTrialEnd = function () {
        this.survivalEl.hidden = false;
        $('#gameScreen .survival .best-time').text(Utils.formatTime(smorball.user.bestSurvivalTime)).focus();
        $('#gameScreen .survival .time-survived').text(Utils.formatTime(smorball.game.timeOnLevel)).focus();
    };
    GameScreen.prototype.showDefeat = function (cashEarnt) {
        this.defeatEl.hidden = false;
        $('#gameScreen .defeat .cashbar-small').text(cashEarnt + "").focus();
    };
    GameScreen.prototype.update = function (delta) {
        if (smorball.game.level.timeTrial) {
            this.opponentsEl.textContent = smorball.game.enemiesKilled + "";
            this.scoreEl.textContent = Utils.formatTime(smorball.game.timeOnLevel);
        }
        else {
            this.opponentsEl.textContent = smorball.game.getOpponentsRemaining() + "";
            this.scoreEl.textContent = smorball.game.getScore() + "";
        }
        // Sort by depth
        this.actors.sortChildren(function (a, b) { return a.y - b.y; });
        _.each(this.powerupIcons, function (i) { return i.update(delta); });
        this.framerate.update(delta);
        this.stadium.update(delta);
    };
    GameScreen.prototype.selectNextPowerup = function () {
        // If none is currently selected, find the first visible one and select that
        if (this.selectedPowerup == null) {
            var visible = _.find(this.powerupIcons, function (i) { return i.visible; });
            if (visible != null)
                this.selectPowerup(visible);
        }
        else {
            var indx = this.powerupIcons.indexOf(this.selectedPowerup);
            var next = null;
            for (var i = indx + 1; i < this.powerupIcons.length; i++) {
                if (this.powerupIcons[i].visible) {
                    next = this.powerupIcons[i];
                    break;
                }
            }
            this.selectPowerup(next);
        }
    };
    GameScreen.prototype.selectPowerup = function (powerup) {
        this.selectedPowerup = powerup;
        // Play a sound
        if (powerup != null)
            smorball.audio.playSound("powerup_selection_changed_sound", 1);
        // If no powerup was passed then we should deselect all powerups
        if (powerup == null) {
            _.each(this.powerupIcons, function (i) { return i.deselect(); });
        }
        else {
            // If that powerup is already selected then simply deselect it
            if (powerup.isSelected)
                powerup.deselect();
            else {
                _.each(this.powerupIcons, function (i) { return i.deselect(); });
                powerup.select();
            }
        }
        _.each(smorball.game.athletes, function (a) { return a.selectedPowerupChanged(powerup == null ? null : powerup.type); });
    };
    return GameScreen;
})(ScreenBase);
