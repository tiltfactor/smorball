/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
var CaptchaController = (function () {
    function CaptchaController() {
        var _this = this;
        EventBus.addEventListener("compareCaptcha", function () { return _this.testInput(); });
        this.container = new createjs.Container();
    }
    CaptchaController.prototype.init = function () {
        this.entries = localCaptchaData.entries.slice().reverse();
    };
    CaptchaController.prototype.startNewLevel = function (level) {
        this.captchasSucceeded = 0;
        // First remove any old captchas
        if (this.captchas != null)
            this.container.removeAllChildren();
        // Make the new ones
        this.constructCaptchas(level);
        // Make sure these are enabled
        _.each([$("#inputText"), $("#submitButton"), $("#passButton")], function (e) { return e.prop("disabled", false); });
    };
    CaptchaController.prototype.constructCaptchas = function (level) {
        var _this = this;
        this.captchas = [];
        // Making a captcha for each lane needed
        _.each(level.lanes, function (lane) {
            var captcha = new Captcha(lane);
            var pos = gameConfig.captchaPositions[lane];
            captcha.x = pos.x;
            captcha.y = pos.y;
            _this.captchas.push(captcha);
            _this.container.addChild(captcha);
        });
    };
    CaptchaController.prototype.showCaptchas = function () {
        _.each(this.captchas, function (c) { return c.visible = true; });
    };
    CaptchaController.prototype.hideCaptchas = function () {
        _.each(this.captchas, function (c) { return c.visible = false; });
    };
    CaptchaController.prototype.refreshCaptcha = function (lane) {
        var captcha = _.find(this.captchas, function (c) { return c.lane == lane; });
        captcha.setEntry(this.entries.pop());
    };
    CaptchaController.prototype.update = function (delta) {
        if (this.isLocked) {
            this.disabledTimer += delta;
            console.log(smorball.gameState.gs.penalty, this.disabledTimer);
            if (this.disabledTimer >= smorball.gameState.gs.penalty)
                this.unlock();
        }
    };
    CaptchaController.prototype.testInput = function () {
        // Grab the input and then reset it for next time
        var input = $("#inputText").val();
        $("#inputText").val("");
        // Get the visible captchas on screen 
        var visibleCapatchas = _.filter(this.captchas, function (c) { return c.entry != null; });
        // If there are no visible then lets just jump out until they are
        if (visibleCapatchas.length == 0)
            return;
        // Convert them into a form that the closestWord algo needs
        var differences = _.map(visibleCapatchas, function (c) {
            return {
                captcha: c,
                texts: [c.entry.ocr1, c.entry.ocr2]
            };
        });
        // Slam it through the library
        var output = new closestWord(input, differences);
        console.log("Comparing inputted text against captchas", input, output);
        // Sweet we have a match
        if (output.match) {
            output.closestOcr.captcha.clear();
        }
        else
            this.lock();
        //this.captchaProcessor.compare();
        //EventBus.dispatch("playSound", "textEntry1");
        //var output = this.captchaProcessor.compare();
        //if (output.cheated) {
        //	EventBus.dispatch("showCommentary", output.message);
        //	this.showResultScreen(2);
        //} else {
        //	this.showMessage(output.message);
        //	this.removeActivePowerup();
        //	if (output.pass) {
        //		if (this.activePowerup != null) {
        //			EventBus.dispatch("playSound", "correctPowerup");
        //			smorball.myBag.selectedId = -1;
        //		}
        //		else {
        //			EventBus.dispatch("playSound", "correctSound");
        //		}
        //		if (this.activePowerup != null && this.activePowerup.getId() == "bullhorn") {
        //			this.startPlayersFromAllLanes();
        //		} else {
        //			var lane = this.getLaneById(output.laneId);
        //			this.activatePlayer(lane.player);
        //			if (output.extraDamage && lane.player != undefined && lane.player.getLife() == 1) {
        //				lane.player.setLife(smorball.gameState.gs.extraDamage);
        //			}
        //			lane.player = undefined;
        //		}
        //	} else {
        //		EventBus.dispatch("playSound", "incorrectSound");
        //		this.updatePlayerOnDefault();
        //		this.playConfusedAnimation();
        //		this.activePowerup = undefined;
        //	}
        //}
    };
    CaptchaController.prototype.lock = function () {
        var elements = [$("#inputText"), $("#submitButton"), $("#passButton")];
        // Disable all the inputs
        _.each(elements, function (e) { return e.prop("disabled", true); });
        // Shake them
        $("#inputText").parent().effect("shake");
        // After some time enable them again
        this.disabledTimer = 0;
        this.isLocked = true;
    };
    CaptchaController.prototype.unlock = function () {
        var elements = [$("#inputText"), $("#submitButton"), $("#passButton")];
        // Enable all the inputs
        _.each(elements, function (e) { return e.prop("disabled", false); });
        // Not locked any more
        this.isLocked = false;
    };
    return CaptchaController;
})();
