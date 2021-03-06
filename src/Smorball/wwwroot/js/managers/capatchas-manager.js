var CaptchasManager = (function () {
    function CaptchasManager() {
        this.localChunks = [];
        this.remoteChunks = [];
        this.loadingData = false;
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
        this.attemptsNotSent = [];
        window.onbeforeunload = function () { return _this.sendInputsToServer(); };
    };
    CaptchasManager.prototype.startNewLevel = function (level) {
        this.captchasSucceeded = 0;
        this.updatePassButton();
        this.confusedTimeMuliplier = 1;
        this.attemptsNotSent = [];
        $("#gameScreen .entry input").val("");
        // First refresh our local chunks list
        this.localChunks = this.getLocalChunks();
        // Make the new ones
        this.constructCaptchas(level);
    };
    CaptchasManager.prototype.getLocalChunks = function () {
        // Grab the local page and make a copy
        var inData = smorball.resources.getResource("local_ocr_page_data");
        // Construct the spritesheet if we havent already
        if (inData.spritesheet == null) {
            var ssData = smorball.resources.getResource("captchas_json");
            ssData.images = [smorball.resources.getResource("captchas_jpg")];
            inData.spritesheet = new createjs.SpriteSheet(ssData);
            // Set the parent in each chunk (for easy reference later);
            _.each(inData.differences, function (d) { return d.page = inData; });
        }
        return inData.differences.slice().reverse();
    };
    CaptchasManager.prototype.constructCaptchas = function (level) {
        var _this = this;
        this.captchas = [];
        // Making a captcha for each lane needed
        _.each(level.lanes, function (lane) {
            var captcha = new Captcha(lane, Utils.randomOne(_this.localChunks));
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
    CaptchasManager.prototype.getCaptcha = function (lane) {
        return _.find(this.captchas, function (c) { return c.lane == lane; });
    };
    CaptchasManager.prototype.refreshCaptcha = function (lane) {
        var _this = this;
        var captcha = this.getCaptcha(lane);
        // Get the visible captchas on screen 
        var visibleCapatchas = _.filter(this.getActiveCaptchas(), function (c) { return c.lane != lane; });
        for (var i = 0; i < 100; i++) {
            // Grab the next chunk from the stack
            var nextChunk = this.getNextChunk(lane);
            console.log("Next captcha pulled from stack, isLocal:", nextChunk.page.isLocal, nextChunk);
            // Must ensure that the next chunk does not equal one that is already on screen
            var match = _.find(visibleCapatchas, function (c) { return _this.doChunksMatch(c.chunk, nextChunk); });
            if (match != null) {
                console.log("Cannot use captcha, same one is already on the screen");
                continue;
            }
            // Ensure that the chunk isnt too wide
            captcha.scaleX = captcha.scaleY = 1;
            captcha.setChunk(nextChunk);
            // If the new size of the captch is too small in either dimension then lets discard it
            if (captcha.getBounds().width < smorball.config.minCaptchaPixelSize || captcha.getBounds().height < smorball.config.minCaptchaPixelSize) {
                console.log("Cannot use captcha, width or height is less than minimum Captcha pixel size", captcha.getBounds(), smorball.config.minCaptchaPixelSize);
                // Because it can't be used, we should mark the captcha as passed
                this.markAsPassed(captcha.chunk);
                continue;
            }
            // Lets check the pre-scaled size of the captcha to anything too big
            var width = captcha.getWidth();
            if (width > smorball.config.maxCaptchaSize) {
                // If the chunk is too wide then lets see if we should scale it down or not
                var L = this.getAverageTextLength(nextChunk);
                var result = Math.min(width, smorball.config.maxCaptchaSize) / L;
                // If the result is less than a specific constant value then throw out this word and try another
                if (result < smorball.config.captchaScaleLimitConstantN) {
                    console.log("Cannot use captcha, its too wide compared to contant! result:", result);
                    // Because it can't be used, we should mark the captcha as passed
                    this.markAsPassed(captcha.chunk);
                    continue;
                }
                // Else lets scale the captcha down some
                var scale = smorball.config.maxCaptchaSize / width;
                console.log("Scaling captcha down to:", scale);
                captcha.scaleX = captcha.scaleY = scale;
                // If the new size of the captch is too small in either dimension then lets discard it
                if (captcha.getBounds().width * scale < smorball.config.minCaptchaPixelSize || captcha.getBounds().height * scale < smorball.config.minCaptchaPixelSize) {
                    console.log("Cannot use captcha, width or height is less than minimum Captcha pixel size", captcha.getBounds(), smorball.config.minCaptchaPixelSize);
                    // Because it can't be used, we should mark the captcha as passed
                    this.markAsPassed(captcha.chunk);
                    continue;
                }
            }
            // If we get here then we are done
            captcha.animateIn();
            break;
        }
    };
    CaptchasManager.prototype.getAverageTextLength = function (chunk) {
        var len = 0;
        _.each(chunk.texts, function (t) { return len += t.length; });
        return len / chunk.texts.length;
    };
    CaptchasManager.prototype.doChunksMatch = function (a, b) {
        for (var i = 0; i < a.texts.length; i++)
            for (var j = 0; j < b.texts.length; j++)
                if (a.texts[i] == b.texts[j])
                    return true;
        return false;
    };
    CaptchasManager.prototype.getNextChunk = function (lane, byProximity) {
        if (typeof byProximity === "undefined")
            byProximity = true;

        // If its a tutorial level then we need to use a speacially prepared list
        var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        //Check to see if all of the captchas on the screen are local
        if (smorball.game.levelIndex == 0)
            return this.localChunks.pop();
        else {
            
            // If there is nothing left in there lets grab another page
            // Because chrome has hardware acceleration issues when showing captchas
            // from two different pages at once, only load a new page when all of the
            // current captchas are local (if on chrome).  Otherwise, load some more pages
            if (this.remoteChunks.length == 0)
            {
				var visibleCapatchas = this.getActiveCaptchas();
				console.log(visibleCapatchas);
				var allLocal = true;
				for (var i = 0; i<visibleCapatchas.length; i++)
				{
					allLocal = (visibleCapatchas[i].chunk.page.isLocal);
					if(!allLocal)
					{
						break;
					}
				}
            	if (isChrome && allLocal && !this.loadingData)	
            	{
                	this.loadPagesFromServer(1);
                	this.loadingData = true;
                }
                if (!isChrome)
                	this.loadPagesFromServer(2);

                // If there arent any chunks remaining then just chunk our local store in there
                return Utils.randomOne(this.localChunks);
            }
            // Else return a captcha based on enemy proximity in the lane
            //  The closer the enemy is, the shorter the captcha should be
            
            if (byProximity) {
                var percent = 1 - smorball.game.getEnemyProximity(lane);
                // Select a random percentage within rangeSize of percent
                // This is to prevent captchas from being too deterministic
                var rangeSize = 0.1
                var rangeMin = percent - rangeSize/2;
                var rangeMax = percent + rangeSize/2;
                if (rangeMin < 0) {
                    rangeMin = 0;
                    rangeMax = rangeSize;
                } else if (rangeMax > 1) {
                    rangeMax = 1;
                    rangeMin = 1 - rangeSize;
                }
                var randPercent = Math.random() * (rangeMax - rangeMin) + rangeMin;
                console.log("percent: " + percent + ", randPercent: " + randPercent);
                var index = Math.min(this.remoteChunks.length - 1, Math.floor(this.remoteChunks.length * randPercent));
                return this.remoteChunks.splice(index, 1)[0];
            } else {
                return Utils.popRandomOne(this.remoteChunks);
            }
        }
    };
    CaptchasManager.prototype.update = function (delta) {
        if (this.isLocked) {
            this.lockedTimer += delta;
            if (this.lockedTimer >= smorball.config.penaltyTime * this.confusedTimeMuliplier)
                this.unlock();
        }
    };
    CaptchasManager.prototype.pass = function () {
        var _this = this;
        // Decrement the number of passes remaining
        smorball.game.passesRemaining--;
        // Add entries to submission and add new entries for the visible captchas
        _.chain(this.captchas).filter(function (c) { return c.chunk != null; }).each(function (c) {
            _this.markAsPassed(c.chunk);
            return c.setChunk(_this.getNextChunk(c.lane));
        });
        $("#gameScreen .entry input").val("");
        this.updatePassButton();
    };
    CaptchasManager.prototype.updatePassButton = function () {
        if (smorball.game.passesRemaining > 0) {
            $("#gameScreen .entry .pass-btn").prop("disabled", false);
            $("#gameScreen .entry .pass-btn").text("PASS (" + smorball.game.passesRemaining + ")");
        }
        else {
            $("#gameScreen .entry .pass-btn").prop("disabled", true).text("PASS");
        }
    };
    CaptchasManager.prototype.markAsPassed = function (ocr) {
        if (!ocr.page.isLocal) {
            this.attemptsNotSent.push({
                closestOcr: ocr,
                pass: true
            });
            if (this.attemptsNotSent.length > smorball.config.entriesBeforeServerSubmission)
                this.sendInputsToServer();
        }
    }
    CaptchasManager.prototype.testTextEntry = function () {
        // Cant test if the game is not running
        if (smorball.game.state != 2 /* Playing */)
            return;
        // Grab the text and reset it ready for the next one
        var text = $("#gameScreen .entry input").val();
        if (text == null || text == "")
            return; // skip if no text entered
        $("#gameScreen .entry input").val("");
        // Check for cheats first (if we are in debug mode)
        if (smorball.config.debug && this.checkForCheats(text))
            return;
        // Get the visible captchas on screen 
        var visibleCapatchas = this.getActiveCaptchas();
        // If there are no visible then lets just jump out until they are
        if (visibleCapatchas.length == 0)
            return;
        // Sort active captchas based on enemy proximity in each lane
        //  (in case two captchas match, this will prioritize the lane with a closer enemy)
        visibleCapatchas = _.sortBy(visibleCapatchas, function(c) {
            return -smorball.game.getEnemyProximity(c.lane);
        });
        // Log
        console.log("Comparing text", text, _.map(this.captchas, function (c) { return c.chunk; }));
        // Convert them into a form that the closestWord algo needs
        var differences = _.map(visibleCapatchas, function (c) { return c.chunk; });
        // Slam it through the library
        var output = new closestWord(text, differences);
        output.text = text;
        console.log("Comparing inputted text against captchas", text, output);
        // Increment and send if neccessary
        if (!output.closestOcr.page.isLocal) {
            this.attemptsNotSent.push(output);
            if (this.attemptsNotSent.length > smorball.config.entriesBeforeServerSubmission)
                this.sendInputsToServer();
        }
        // Handle success
        if (output.match) {
            // Which was the selected one?
            var captcha = _.find(visibleCapatchas, function (c) { return c.chunk == output.closestOcr; });
            this.onCaptchaEnteredSuccessfully(text, captcha);
        }
        else
            this.onCaptchaEnterError();
    };
    CaptchasManager.prototype.onCaptchaEnteredSuccessfully = function (text, captcha) {
        var _this = this;
        // Hide the current captcha
        captcha.clear();
        // Show the indicator
        smorball.screens.game.indicator.showCorrect();
        // This is needed as the Breakfast Club powerup is dependant on the length of the captcha
        var damageBonus = 0;
        if (text.length > 7 && smorball.upgrades.isOwned("breakfast"))
            damageBonus += smorball.upgrades.getUpgrade("breakfast").damageBonus;
        var speedMultiplier = 1;
        if (smorball.upgrades.isOwned("speeddrills"))
            speedMultiplier = smorball.upgrades.getUpgrade("speeddrills").speedMultiplier;
        // If we have the bullhorn powerup selected then send all athletes running
        var powerup = smorball.screens.game.selectedPowerup;
        if (powerup != null) {
            // Play a sound
            smorball.audio.playSound("word_typed_correctly_with_powerup_sound");
            // If its a bullhorn then send every athlete in the 
            if (powerup.type == "bullhorn") {
                _.chain(smorball.game.athletes).filter(function (a) { return a.state == 1 /* ReadyToRun */; }).each(function (a) { return _this.sendAthleteInLane(a.lane, text, damageBonus, speedMultiplier); });
            }
            else
                this.sendAthleteInLane(captcha.lane, text, damageBonus, speedMultiplier);
            // Decrement the powerup
            smorball.powerups.powerups[powerup.type].quantity--;
            // Deselect the powerup
            smorball.screens.game.selectPowerup(null);
        }
        else {
            // Play a sound
            smorball.audio.playSound("word_typed_correct_sound");
            this.sendAthleteInLane(captcha.lane, text, damageBonus, speedMultiplier);
            // If this is the tutorial level then make sure the captcha is now hidden so the user cant enter before the next wave
            if (smorball.game.levelIndex == 0)
                captcha.visible = false;
        }
    };
    CaptchasManager.prototype.getActiveCaptchas = function () {
        return _.filter(this.captchas, function (c) { return c.visible && c.chunk != null; });
    };
    CaptchasManager.prototype.onCaptchaEnterError = function () {
        var _this = this;
        // Play a sound
        smorball.audio.playSound("word_typed_incorrect_sound");
        // Show the indicator
        smorball.screens.game.indicator.showIncorrect();
        // Add a score penalty and show some floating text
        var penalty = smorball.config.incorrectCaptchaScorePenalty;
        smorball.game.levelScore -= penalty;
        smorball.screens.game.actors.addChild(new FloatingText("-" + penalty, smorball.config.width / 2, smorball.config.height / 2 + 200));
        // So long as we arent running the first level then lets refresh all the captchas
        if (smorball.game.levelIndex != 0) {
            _.each(this.getActiveCaptchas(), function (c) { return _this.refreshCaptcha(c.lane); });
        }
        // Finally lock
        this.lock();
    };
    CaptchasManager.prototype.sendAthleteInLane = function (lane, text, damageBonus, speedMultiplier) {
        // Start the athlete running
        var athelete = _.find(smorball.game.athletes, function (a) { return a.lane == lane && a.state == 1 /* ReadyToRun */; });
        athelete.damageBonus = damageBonus;
        athelete.speedMultiplier = speedMultiplier;
        athelete.knockback = Utils.clamp(text.length * smorball.config.knockbackWordLengthMultiplier, smorball.config.knockbackMin, smorball.config.knockbackMax);
        athelete.run();
        // Spawn another in the same lane
        smorball.spawning.spawnAthlete(lane);
    };
    CaptchasManager.prototype.checkForCheats = function (text) {
        if (text.toLowerCase() == "win level") {
            smorball.game.enemiesKilled = smorball.spawning.enemySpawnsThisLevel;
            smorball.game.levelScore = Math.round(100 + Math.random() * 500);
            smorball.game.gameOver(true);
            return true;
        }
        else if (text.toLowerCase() == "loose level") {
            smorball.game.enemiesKilled = Math.round(Math.random() * smorball.spawning.enemySpawnsThisLevel);
            smorball.game.levelScore = 0;
            smorball.game.gameOver(false);
            return true;
        }
        else if (text.toLowerCase() == "win all levels") {
            smorball.game.enemiesKilled = Math.round(Math.random() * smorball.spawning.enemySpawnsThisLevel);
            smorball.game.levelScore = Math.round(100 + Math.random() * 500);
            smorball.user.cash += 99999;
            for (var i = 0; i < smorball.game.levels.length; i++)
                smorball.user.levelWon(i);
            smorball.game.gameOver(true);
            return true;
        }
        else if (text.toLowerCase() == "increase cleats") {
            smorball.powerups.powerups.cleats.quantity++;
            return true;
        }
        else if (text.toLowerCase() == "increase helmets") {
            smorball.powerups.powerups.helmet.quantity++;
            return true;
        }
        else if (text.toLowerCase() == "increase bullhorns") {
            smorball.powerups.powerups.bullhorn.quantity++;
            return true;
        }
        else if (text.toLowerCase() == "spawn powerup") {
            smorball.powerups.spawnPowerup(Utils.randomOne(_.keys(smorball.powerups.types)), Utils.randomOne(smorball.game.level.lanes));
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
        // Hide all captchas unti lthe confused wears off
        this.hideCaptchas();
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
        // Show captchas again
        this.showCaptchas();
    };
    CaptchasManager.prototype.sendInputsToServer = function () {
        var _this = this;
        // Dont send anything if there arent enoughv to send!
        if (this.attemptsNotSent.length == 0)
            return;
        console.log("sending difference inputs to sever..");
        // Convert it into the format needed by the server
        var data = {
            differences: _.map(this.attemptsNotSent, function (a) {
                return { _id: a.closestOcr._id, text: a.text || "", pass: a.pass || false};
            })
        };
        // Make a copy of the attempts not sent and reset the list ready for the next send
        var attempts = this.attemptsNotSent.slice();
        this.attemptsNotSent = [];
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            processData: false,
            contentType: 'application/json',
            crossDomain: true,
            url: smorball.config.DifferenceAPIUrl,
            data: JSON.stringify(data),
            timeout: 10000,
            success: function (data) {
                console.log("data sent to DifferenceAPI success!", data);
            },
            error: function (err) {
                console.log("difference API error:", err);
                // If we get an error, add these attempts back into the list
                _this.attemptsNotSent = _this.attemptsNotSent.concat(attempts);
            },
            headers: { "x-access-token": smorball.config.PageAPIAccessToken }
        });
    };
    CaptchasManager.prototype.loadPageFromServer = function () {
        var _this = this;
        $.ajax({
            url: smorball.config.PageAPIUrl,
            success: function (data) { return _this.parsePageAPIData(data); },
            headers: { "x-access-token": smorball.config.PageAPIAccessToken },
            timeout: smorball.config.PageAPITimeout
        });
    };
    CaptchasManager.prototype.loadPagesFromServer = function (numPages, captchasPerPage) {
        if (typeof(captchasPerPage)==='undefined') captchasPerPage = 0;
        var _this = this;
        $.ajax({
            url: smorball.config.PageAPIUrl,
            success: function (data) {
                if (numPages > 1)
                    _this.loadPagesFromServer(numPages - 1);
                return _this.parsePageAPIData(data);
            },
            headers: { "x-access-token": smorball.config.PageAPIAccessToken },
            timeout: smorball.config.PageAPITimeout,
            data: { wordAmount: captchasPerPage }
        });
    };
    CaptchasManager.prototype.parsePageAPIData = function (data) {
        var _this = this;
        console.log("OCRPage loaded, loading image..", data);
        localStorage["last_page"] = JSON.stringify(data);
        data.isLocal = false;
        // This seems to be the only way I can get the CORS image to work
        var image = new Image();
        image.src = data.url;
        image.onload = function () {
            console.log("OCRPage image loaded..", image);
            var ssData = {
                frames: [],
                images: []
            };
            _.each(data.differences, function (d) {
                var x = d.coords[3].x;
                var y = d.coords[3].y;
                var w = d.coords[1].x - d.coords[3].x;
                var h = d.coords[1].y - d.coords[3].y;
                // A few error catches here
                if (x < 0)
                    console.error("X LESS THAN ZERO!! ", d);
                if (y < 0)
                    console.error("Y LESS THAN ZERO!! ", d);
                if (w <= 0)
                    console.error("WIDTH LESS THAN OR EQUAL TO ZERO!! ", d);
                if (h <= 0)
                    console.error("HEIGHT LESS THAN OR EQUAL TO ZERO!! ", d);
                if (x + w > image.width)
                    console.error("WIDTH GREATER THAN IMAGE!! ", d);
                if (y + h > image.height)
                    console.error("WIDTH GREATER THAN IMAGE!! ", d);
                d.frame = ssData.frames.length;
                d.page = data;
                ssData.frames.push([x, y, w, h]);
                _this.remoteChunks.push(d);
            });
            // Sort incoming captchas by length (ascending)
            _this.remoteChunks = _.sortBy(_this.remoteChunks, function(c) {
                return (c.texts[0].length + c.texts[1].length) / 2;
            });
            ssData.images = [image];
            data.spritesheet = new createjs.SpriteSheet(ssData);
            _this.loadingData = false;
        };
    };
    return CaptchasManager;
})();
