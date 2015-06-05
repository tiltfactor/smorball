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
        this.bubble = new CommentatorBubble();
        this.bubble.x = 800;
        this.bubble.y = 314;
        this.addChild(this.bubble);
        this.actors = new createjs.Container();
        this.addChild(this.actors);
        this.captchas = new createjs.Container();
        this.addChild(this.captchas);
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
        this.musicSlider = new RangeSlider("#gameScreen .timeout .music-slider", smorball.audio.musicVolume, function (value) { return smorball.audio.setMusicVolume(value); });
        this.soundSlider = new RangeSlider("#gameScreen .timeout .sound-slider", smorball.audio.soundVolume, function (value) { return smorball.audio.setSoundVolume(value); });
        $("#gameScreen .menu").click(function () { return smorball.game.timeout(); });
        $('#gameScreen .timeout button.close').click(function () { return smorball.game.resume(); });
        $('#gameScreen .timeout button.quit').click(function () { return smorball.game.returnToMap(); });
        $('#gameScreen .timeout button.help').click(function () { return smorball.game.help(); });
        $('#gameScreen button.continue').click(function () { return smorball.game.returnToMap(); });
        $("#gameScreen .entry input").on("keydown", function (event) { return _this.onKeyDown(event); });
        // When any keyboard event happens focus the input
        window.onkeydown = function (event) {
            if (smorball.game.state == GameState.Playing /* Timeout */) {
                $("#gameScreen .entry input").focus();  // When any keyboard event happens focus the input
                // If the key is escape then lets resume
                if (event.keyCode == 27)
                    smorball.game.timeout();
            }
            else if (smorball.game.state == GameState.Timeout /* Playing */) {
                // If the key is escape then lets timeout
                if (event.keyCode == 27)
                    smorball.game.resume();
            }
            else if (smorball.game.state == GameState.Loading /* LoadingLevel */) {
                // If the key is enter then lets play
                if (event.keyCode == 13) {
                    smorball.game.play();
                    console.log ("enter pressed");
                // If the key is escape then lets go back to the map screen
                } else if (event.keycode == 27) {
                    smorball.game.returntoMap();
                    console.log ("esc pressed");
                }
            }
        };
        // If the window looses focus then lets pause the game if we are running
        window.onblur = function (event) {
            //if (smorball.game.state == GameState.Playing)
            //smorball.game.timeout();
        };
        this.framerate = new Framerate();
        this.framerate.x = smorball.config.width - 80;
        this.framerate.y = smorball.config.height - 60;
        // Only add the framerate if we are in debug mode
        if (smorball.config.debug)
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
        this.score = 600;
    };
    GameScreen.prototype.showEntry = function() {
            $("#gameScreen .entry").show();
    };
    GameScreen.prototype.hideEntry = function() {
            $("#gameScreen .entry").hide();
    };
    GameScreen.prototype.showTimeout = function () {
        console.log("timeout changed!");
        smorball.screens.game.timeoutEl.hidden = false;
        this.musicSlider.value = smorball.audio.musicVolume;
        this.soundSlider.value = smorball.audio.soundVolume;
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
    GameScreen.prototype.flashRed = function (el, time) {
        $(el).css("color", "red");
        // Jquery .delay() doesnt seem to work so I have to do this
        createjs.Tween.get(this).to({}, time).call(function () { return $(el).removeAttr("style"); });
    };
    GameScreen.prototype.update = function (delta) {
        if (smorball.game.level.timeTrial) {
            this.opponentsEl.textContent = smorball.game.enemiesKilled + "";
            this.scoreEl.textContent = Utils.formatTime(smorball.game.timeOnLevel);
        }
        else {
            var s = smorball.game.levelScore;
            if (this.score > s)
                this.score = Math.max(this.score - Math.round(delta * 1000), s);
            this.opponentsEl.textContent = smorball.game.getOpponentsRemaining() + "";
            this.scoreEl.textContent = this.score + "";
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
