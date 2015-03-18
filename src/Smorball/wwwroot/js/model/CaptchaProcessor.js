/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
var CaptchaProcessor = (function () {
    function CaptchaProcessor(config) {
        this.wordCount = 0;
        this.currentPass = 0;
        this.maxPass = 1;
        this.captchasOnScreen = [];
        this.captchaTextBoxId = "inputText";
        this.captchaPassButton = "passButton";
        this.config = config;
        this.init();
    }
    CaptchaProcessor.prototype.init = function () {
        this.currentIndex = 0;
        if (this.config.gameState.captchaDatasArray.length == 1) {
            this.callCaptchaFromServer();
        }
        this.activateCaptchaSet();
        this.loadEvents();
    };
    CaptchaProcessor.prototype.activateUI = function () {
        $("#canvasHolder").parent().css({ position: 'relative' });
        document.getElementById('canvasHolder').style.display = "block";
        document.getElementById(this.captchaPassButton).value = 'Pass(' + this.maxPass + ')';
        this.disablePassButton(false);
        window.onload = this.prevent;
        $('#inputText').focus();
    };
    CaptchaProcessor.prototype.prevent = function (e) {
        e.defaultPrevented = true;
    };
    CaptchaProcessor.prototype.loadEvents = function () {
        var _this = this;
        EventBus.addEventListener("passText", function (e) { return _this.passText(); });
        EventBus.addEventListener("assistText", function (e) { return _this.assistText(e.target); });
        EventBus.addEventListener("callCaptchaFromServer", function () { return _this.callCaptchaFromServer(); });
    };
    CaptchaProcessor.prototype.getCaptchaPlaceHolder = function (maxWidth, height, laneId) {
        this.activateUI();
        var captchaHolder = new createjs.Bitmap(null);
        captchaHolder.maxHeight = height;
        captchaHolder.maxWidth = maxWidth;
        captchaHolder.id = laneId;
        this.load(captchaHolder);
        return captchaHolder;
    };
    CaptchaProcessor.prototype.load = function (captcha) {
        var captchaData = this.getCaptchaData();
        var message = "";
        captcha.image = captchaData.url;
        if (this.captchaDatas.local) {
            this.setScale(captcha, captcha.image.width, captcha.image.height);
            captcha.texts = [captchaData.ocr1, captchaData.ocr2];
            if (this.config.gameState.currentLevel == 1) {
                EventBus.dispatch("showCommentary", captchaData.message);
            }
        }
        else {
            var myCords = this.getCaptchaCoordinates(captchaData.coords);
            captcha.sourceRect = new createjs.Rectangle(myCords.sPoint.x, myCords.sPoint.y, myCords.width, myCords.height);
            this.setScale(captcha, myCords.width, myCords.height);
            captcha.texts = captchaData.texts;
            captcha._id = captchaData._id;
        }
        captcha.scaleX = captcha.scaleY = 0;
        createjs.Tween.get(captcha).to({ scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.backOut);
        this.captchasOnScreen.push(captcha);
        ++this.currentIndex;
    };
    CaptchaProcessor.prototype.getCaptchaData = function () {
        this.checkCaptchaSetting();
        var captchaData = this.captchaDatas.differences[this.currentIndex];
        var imageId = null;
        var myText = null;
        if (this.captchaDatas.local) {
            imageId = captchaData.image.split(".")[0];
            myText = captchaData.ocr1;
        }
        else {
            imageId = this.captchaDatas._id;
            myText = captchaData.texts[0];
        }
        captchaData.url = this.config.loader.getResult(imageId);
        if (captchaData.url == null) {
            this.currentIndex++;
            captchaData = this.getCaptchaData();
        }
        if (this.getCaptcha(myText) != null) {
            this.currentIndex++;
            captchaData = this.getCaptchaData();
        }
        return captchaData;
    };
    CaptchaProcessor.prototype.reset = function () {
        for (var i = this.captchasOnScreen.length - 1; i >= 0; i--) {
            var captcha = this.captchasOnScreen[i];
            var index = this.captchasOnScreen.indexOf(captcha);
            this.captchasOnScreen.splice(index, 1);
            this.load(captcha);
        }
    };
    CaptchaProcessor.prototype.setScale = function (captcha, imgWidth, imgHeight) {
        var cW = captcha.maxWidth - 20;
        var cH = captcha.maxHeight - 10;
        var sx = cW / imgWidth > 1 ? 1 : cW / imgWidth;
        var sy = cH / imgHeight > 1 ? 1 : cH / imgHeight;
        captcha.scaleX = sx;
        captcha.scaleY = sy;
    };
    CaptchaProcessor.prototype.checkCaptchaSetting = function () {
        if (this.currentIndex == Math.floor(this.captchaDatas.differences.length / 2) && this.config.gameState.currentLevel != 1) {
            this.callCaptchaFromServer();
        }
        if (this.captchaDatas.local && this.config.loader.localCapthcaSize <= this.currentIndex) {
            this.activateCaptchaSet();
        }
        if (this.currentIndex >= this.captchaDatas.differences.length) {
            this.activateCaptchaSet();
        }
    };
    CaptchaProcessor.prototype.compare = function () {
        var _this = this;
        var me = this;
        var output = {};
        var input = document.getElementById(this.captchaTextBoxId).value;
        if (input == '') {
            output.pass = false;
            output.message = "Enter text";
            return output;
        }
        if (input == "completelevel") {
            this.config.gameState.gs.gameLevelPoints[this.config.gameState.currentLevel - 1] = 3;
            if (this.config.gameState.gs.maxLevel <= this.config.gameState.currentLevel + 1) {
                this.config.gameState.gs.maxLevel = ++this.config.gameState.currentLevel;
            }
            this.config.gameState.currentState = this.config.gameState.states.GAME_OVER;
            output.pass = false;
            output.cheated = true;
            output.message = "cheat code is accessed";
            this.clearText();
            return output;
        }
        if (input == "unlockall") {
            this.config.gameState.gs.maxLevel = this.config.gameState.totalLevels;
            this.config.gameState.currentState = this.config.gameState.states.GAME_OVER;
            output.pass = false;
            output.cheated = true;
            output.message = "cheat code is accessed";
            this.clearText();
            return output;
        }
        var cw = new closestWord(input, this.captchasOnScreen);
        if (cw.match) {
            if (input.length > 8) {
                output.extraDamage = true;
            }
            output.pass = true;
            output.message = "correct";
            var captcha = cw.closestOcr;
            var index = this.captchasOnScreen.indexOf(captcha);
            this.wordCount++;
            this.captchasOnScreen.splice(index, 1);
            output.laneId = captcha.id;
            this.load(captcha);
        }
        else {
            output.pass = false;
            output.message = "incorrect";
            var captcha = cw.closestOcr;
            var passDisabled = $("#canvasHolder #passButton").prop("disabled");
            $("#canvasHolder input").prop("disabled", true);
            setTimeout(function () {
                $("#canvasHolder input").prop("disabled", false);
                if (passDisabled)
                    $("#canvasHolder #passButton").prop("disabled", true);
                _this.reset();
                $("#inputText").focus();
            }, this.config.gameState.gs.penalty);
        }
        var ob = {
            _id: captcha._id,
            text: input
        };
        if (ob._id) {
            this.config.gameState.inputTextArr.push(ob);
        }
        this.clearText();
        return output;
    };
    CaptchaProcessor.prototype.getCaptcha = function (input) {
        for (var i = 0; i < this.captchasOnScreen.length; i++) {
            var captcha = this.captchasOnScreen[i];
            if (input == captcha.texts[0] || input == captcha.texts[1]) {
                return captcha;
            }
        }
        return null;
    };
    CaptchaProcessor.prototype.passText = function () {
        this.clearText();
        if (++this.currentPass >= this.maxPass) {
            this.disablePassButton(true);
            document.getElementById(this.captchaPassButton).value = "PASS";
            $("#inputText").focus();
        }
        this.reset();
    };
    CaptchaProcessor.prototype.clearText = function () {
        document.getElementById(this.captchaTextBoxId).value = "";
    };
    CaptchaProcessor.prototype.disablePassButton = function (status) {
        document.getElementById(this.captchaPassButton).disabled = status;
    };
    CaptchaProcessor.prototype.getCaptchaCoordinates = function (cord) {
        return {
            sPoint: cord[3],
            width: cord[2].x - cord[3].x,
            height: cord[0].y - cord[3].y
        };
    };
    CaptchaProcessor.prototype.callCaptchaFromServer = function () {
        var _this = this;
        var url = "http://tiltfactor1.dartmouth.edu:8080/api/page";
        $.ajax({
            dataType: 'json',
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1lIiwiaWF0IjoxNDE1MzQxNjMxMjY4LCJpc3MiOiJCSExTZXJ2ZXIifQ.bwRps5G6lAd8tGZKK7nExzhxFrZmAwud0C2RW26sdRM');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error: " + textStatus);
            },
            success: function (data) {
                if (data != null)
                    _this.processCaptchaData(data);
            }
        });
    };
    CaptchaProcessor.prototype.processCaptchaData = function (data) {
        var _this = this;
        var myData = { "url": data.url, "differences": data.differences, "_id": data._id, "local": false };
        this.config.loader.load([{ src: myData.url + ".jpeg", id: myData._id }], function () {
            _this.config.gameState.captchaDatasArray.push(myData);
            if ((_this.captchaDatas == undefined || _this.captchaDatas.local) && _this.config.gameState.currentLevel != 1) {
                _this.activateCaptchaSet();
            }
        });
    };
    CaptchaProcessor.prototype.activateCaptchaSet = function () {
        if (this.config.gameState.currentLevel == 1) {
            this.captchaDatas = this.config.gameState.captchaDatasArray[0];
        }
        else {
            this.captchaDatas = this.config.gameState.captchaDatasArray[this.config.gameState.captchaDatasArray.length - 1];
        }
        if (!this.captchaDatas.local) {
            this.config.gameState.captchaDatasArray.pop();
        }
        this.currentIndex = 0;
    };
    CaptchaProcessor.prototype.getCaptchaImageData = function () {
        if (this.config.gameState.captchaDatasArray.length == 1) {
            var data = this.config.gameState.captchaDatasArray[0];
            var url = data.url + ".jpg";
            return { "src": url, "id": data._id };
        }
        return null;
    };
    CaptchaProcessor.prototype.assistText = function (laneId) {
        for (var i = 0; i < this.captchasOnScreen.length; i++) {
            var captcha = this.captchasOnScreen[i];
            if (captcha.id == laneId) {
                $("#" + this.captchaTextBoxId).val(captcha.texts[0]);
            }
        }
    };
    CaptchaProcessor.prototype.hideCaptchas = function () {
        for (var i = 0; i < this.captchasOnScreen.length; i++) {
            this.captchasOnScreen[i].alpha = 0;
        }
    };
    CaptchaProcessor.prototype.showCaptchas = function () {
        for (var i = 0; i < this.captchasOnScreen.length; i++) {
            this.captchasOnScreen[i].alpha = 1;
        }
    };
    CaptchaProcessor.prototype.getWordCount = function () {
        return this.wordCount;
    };
    return CaptchaProcessor;
})();
