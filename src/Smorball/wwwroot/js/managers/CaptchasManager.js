var CaptchasManager = (function () {
    function CaptchasManager() {
    }
    CaptchasManager.prototype.init = function () {
        var _this = this;
        // Catch text entry
        $("#gameScreen .entry .pass-btn").click(function () { return _this.pass(); });
        $("#gameScreen .entry .submit-btn").click(function () { return _this.testTextEntry(); });
        $("#gameScreen .entry input").on("keydown", function (event) {
            if (event.which == 13)
                _this.testTextEntry();
        });
    };
    CaptchasManager.prototype.startNewLevel = function (level) {
        this.captchasSucceeded = 0;
        this.updatePassButton();
        // Reset the local entries cache
        var data = smorball.resources.getResource("captcha_data");
        this.entries = data.entries.slice().reverse();
        // If this isnt the first level then shuffle up the entries a little
        if (level.index != 0)
            this.entries = _.shuffle(this.entries);
        // Make the new ones
        this.constructCaptchas(level);
    };
    CaptchasManager.prototype.constructCaptchas = function (level) {
        var _this = this;
        this.captchas = [];
        // Making a captcha for each lane needed
        _.each(level.lanes, function (lane) {
            var captcha = new Captcha(lane);
            _this.captchas.push(captcha);
            smorball.screens.game.captchas.addChild(captcha);
        });
    };
    CaptchasManager.prototype.showCaptchas = function () {
        _.each(this.captchas, function (c) { return c.visible = true; });
    };
    CaptchasManager.prototype.hideCaptchas = function () {
        _.each(this.captchas, function (c) { return c.visible = false; });
    };
    CaptchasManager.prototype.refreshCaptcha = function (lane) {
        var captcha = _.find(this.captchas, function (c) { return c.lane == lane; });
        captcha.setEntry(this.entries.pop());
    };
    CaptchasManager.prototype.update = function (delta) {
        if (this.isLocked) {
            this.lockedTimer += delta;
            if (this.lockedTimer >= smorball.config.penaltyTime)
                this.unlock();
        }
    };
    CaptchasManager.prototype.pass = function () {
        var _this = this;
        // Decrement the number of passes remaining
        smorball.game.passesRemaining--;
        // Set new entries for the visible captcahs
        _.chain(this.captchas).filter(function (c) { return c.entry != null; }).each(function (c) { return c.setEntry(_this.entries.pop()); });
        this.updatePassButton();
    };
    CaptchasManager.prototype.updatePassButton = function () {
        if (smorball.game.passesRemaining == 0) {
            $("#gameScreen .entry .pass-btn").prop("disabled", true).text("PASS");
        }
        else {
            $("#gameScreen .entry .pass-btn").text("PASS (" + smorball.game.passesRemaining + ")");
        }
    };
    CaptchasManager.prototype.testTextEntry = function () {
        var _this = this;
        // Grab the text and reset it ready for the next one
        var text = $("#gameScreen .entry input").val();
        $("#gameScreen .entry input").val("");
        // Check for cheats first
        if (this.checkForCheats(text))
            return;
        // Get the visible captchas on screen 
        var visibleCapatchas = _.filter(this.captchas, function (c) { return c.entry != null; });
        // If there are no visible then lets just jump out until they are
        if (visibleCapatchas.length == 0)
            return;
        // Log
        console.log("Comparing text", text, _.map(this.captchas, function (c) { return c.entry; }));
        // Convert them into a form that the closestWord algo needs
        var differences = _.map(visibleCapatchas, function (c) {
            return {
                captcha: c,
                texts: [c.entry.ocr1, c.entry.ocr2]
            };
        });
        // Slam it through the library
        var output = new closestWord(text, differences);
        console.log("Comparing inputted text against captchas", text, output);
        if (output.match) {
            // Hide the current captcha
            output.closestOcr.captcha.clear();
            // Start the athlete running
            var lane = output.closestOcr.captcha.lane;
            _.find(smorball.game.athletes, function (a) { return a.lane == lane && a.state == 1 /* ReadyToRun */; }).run();
            // Spawn another in the same lane
            smorball.spawning.spawnAthlete(lane);
        }
        else {
            this.lock();
            // So long as we arent running the first level then lets refresh all the captchas
            if (smorball.game.levelIndex != 0) {
                _.each(visibleCapatchas, function (c) { return c.setEntry(_this.entries.pop()); });
            }
        }
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
    CaptchasManager.prototype.checkForCheats = function (text) {
        if (text.toLowerCase() == "win level") {
            smorball.game.enemiesKilled = smorball.spawning.enemySpawnsThisLevel;
            smorball.game.enemyTouchdowns = Math.round(Math.random() * (smorball.config.enemyTouchdowns - 1));
            smorball.game.gameOver(true);
            return true;
        }
        else if (text.toLowerCase() == "loose level") {
            smorball.game.enemiesKilled = Math.round(Math.random() * smorball.spawning.enemySpawnsThisLevel);
            smorball.game.enemyTouchdowns = smorball.config.enemyTouchdowns;
            smorball.game.gameOver(false);
            return true;
        }
        else if (text.toLowerCase() == "win all levels") {
            smorball.game.enemiesKilled = Math.round(Math.random() * smorball.spawning.enemySpawnsThisLevel);
            smorball.game.enemyTouchdowns = smorball.config.enemyTouchdowns;
            for (var i = 0; i < smorball.game.levels.length; i++)
                smorball.user.levelWon(i);
            smorball.game.gameOver(true);
            return true;
        }
        return false;
    };
    CaptchasManager.prototype.lock = function () {
        // Disable all the inputs
        $("#gameScreen .entry .submit-btn").prop("disabled", true);
        $("#gameScreen .entry input").prop("disabled", true);
        $("#gameScreen .entry .pass-btn").prop("disabled", true);
        // Shake them
        Utils.shake($("#gameScreen .entry input"));
        // Make the athletes play their confused animations
        _.each(smorball.game.athletes, function (a) {
            if (a.state == 1 /* ReadyToRun */)
                a.sprite.gotoAndPlay("confused");
        });
        // After some time enable them again
        this.lockedTimer = 0;
        this.isLocked = true;
    };
    CaptchasManager.prototype.unlock = function () {
        $("#gameScreen .entry .submit-btn").prop("disabled", false);
        $("#gameScreen .entry input").prop("disabled", false);
        if (smorball.game.passesRemaining > 0)
            $("#gameScreen .entry .pass-btn").prop("disabled", false);
        // Focus the input again
        $("#gameScreen .entry input").focus();
        // Make the athletes return to normal
        _.each(smorball.game.athletes, function (a) {
            if (a.state == 1 /* ReadyToRun */)
                a.sprite.gotoAndPlay("idle");
        });
        // Not locked any more
        this.isLocked = false;
    };
    CaptchasManager.prototype.sendInputsToServer = function () {
        //var arr = smorball.gameState.inputTextArr;
        //$.ajax({
        //	url: 'http://tiltfactor1.dartmouth.edu:8080/api/difference',
        //	type: 'PUT',
        //	dataType: 'json',
        //	headers: { "x-access-token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1lIiwiaWF0IjoxNDE1MzQxNjMxMjY4LCJpc3MiOiJCSExTZXJ2ZXIifQ.bwRps5G6lAd8tGZKK7nExzhxFrZmAwud0C2RW26sdRM' },
        //	processData: false,
        //	contentType: 'application/json',
        //	timeout: 10000,
        //	data: JSON.stringify(arr), //this data will be in the format of a json object of user inputs and database IDs of the word they were going for (provided in the json that GET returns)
        //	crossDomain: true,
        //	error: (err) => {
        //		var errorText = JSON.parse(err.responseText);
        //		console.log(errorText);
        //		smorball.gameState.inputTextArr = [];
        //	},
        //	success: (data) => {
        //		smorball.gameState.inputTextArr = [];
        //		console.log(data);
        //	}
    };
    return CaptchasManager;
})();
