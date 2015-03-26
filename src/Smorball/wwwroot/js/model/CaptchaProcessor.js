/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
//class CaptchaProcessor {
//    wordCount = 0;
//    currentPass = 0;
//    maxPass = 1;
//    captchasOnScreen = [];
//    captchaTextBoxId = "inputText";
//    captchaPassButton = "passButton";
//    currentIndex: number;
//    captchaDatas: any;
//    constructor() {
//        this.init();
//    }
//    init() {
//        this.currentIndex = 0;
//        if (smorball.gameState.captchaDatasArray.length == 1) {
//            this.callCaptchaFromServer();
//        }
//        this.activateCaptchaSet();
//        this.loadEvents();
//    }
//    private activateUI() {
//        $("#captchaInputContainer").parent().css({ position: 'relative' });
//        document.getElementById('captchaInputContainer').style.display = "block";
//        (<HTMLButtonElement>document.getElementById(this.captchaPassButton)).value = 'Pass(' + this.maxPass + ')';
//        this.disablePassButton(false);
//        window.onload = this.prevent;
//        $('#inputText').focus();
//    }
//    prevent(e) {
//        e.defaultPrevented = true;
//    }
//    loadEvents() {
//        EventBus.addEventListener("passText", e => this.passText());
//        EventBus.addEventListener("assistText", e => this.assistText(e.target));
//        EventBus.addEventListener("callCaptchaFromServer", () => this.callCaptchaFromServer());
//    }
//    getCaptchaPlaceHolder(maxWidth, height, laneId) {
//        this.activateUI();
//        var captchaHolder : any = new createjs.Bitmap(null);
//        captchaHolder.maxHeight = height;
//        captchaHolder.maxWidth = maxWidth;
//        captchaHolder.id = laneId;
//        this.load(captchaHolder);
//        return captchaHolder;
//    }
//    load(captcha: createjs.Bitmap) {
//        var captchaData = this.getCaptchaData();
//        var message = "";
//        captcha.image = captchaData.url;
//        if (this.captchaDatas.local) {
//            this.setScale(captcha, captcha.image.width, captcha.image.height);
//            captcha.texts = [captchaData.ocr1, captchaData.ocr2];
//            if (smorball.gameState.currentLevel == 1) {
//                EventBus.dispatch("showCommentary", captchaData.message);
//            }
//        } else {
//            var myCords = this.getCaptchaCoordinates(captchaData.coords);
//            captcha.sourceRect = new createjs.Rectangle(myCords.sPoint.x, myCords.sPoint.y, myCords.width, myCords.height);
//            this.setScale(captcha, myCords.width, myCords.height);
//            captcha.texts = captchaData.texts;
//            captcha._id = captchaData._id;
//        }
//        captcha.scaleX = captcha.scaleY = 0;
//        createjs.Tween.get(captcha).to({ scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.backOut);
//        this.captchasOnScreen.push(captcha);
//        ++this.currentIndex;
//    }
//    getCaptchaData() {
//        this.checkCaptchaSetting();
//        var captchaData = this.captchaDatas.differences[this.currentIndex];
//        var imageId = null;
//        var myText = null;
//        if (this.captchaDatas.local) {
//            imageId = captchaData.image.split(".")[0];
//            myText = captchaData.ocr1;
//        } else {
//            imageId = this.captchaDatas._id;
//            myText = captchaData.texts[0];
//        }
//        captchaData.url = smorball.loader.getResult(imageId);
//        if (captchaData.url == null) {
//            this.currentIndex++;
//            captchaData = this.getCaptchaData();
//        }
//        if (this.getCaptcha( myText) != null) {
//            this.currentIndex++;
//            captchaData = this.getCaptchaData();
//        }
//        return captchaData;
//    }
//    reset() {
//        for (var i = this.captchasOnScreen.length - 1; i >= 0; i--) {
//            var captcha = this.captchasOnScreen[i];
//            var index = this.captchasOnScreen.indexOf(captcha);
//            this.captchasOnScreen.splice(index, 1);
//            this.load(captcha);
//        }
//    }
//    private setScale(captcha, imgWidth, imgHeight) {
//        var cW = captcha.maxWidth - 20;
//        var cH = captcha.maxHeight - 10;
//        var sx = cW / imgWidth > 1 ? 1 : cW / imgWidth;
//        var sy = cH / imgHeight > 1 ? 1 : cH / imgHeight;
//        captcha.scaleX = sx;
//        captcha.scaleY = sy;
//    }
//    private checkCaptchaSetting() {
//        if (this.currentIndex == Math.floor(this.captchaDatas.differences.length / 2) && smorball.gameState.currentLevel != 1) {
//            this.callCaptchaFromServer();
//        }
//        if (this.captchaDatas.local && smorball.loader.localCapthcaSize <= this.currentIndex) {
//            this.activateCaptchaSet();
//        }
//        if (this.currentIndex >= this.captchaDatas.differences.length) {
//            this.activateCaptchaSet();
//        }
//    }
//    compare () {
//        var me = this;
//        var output: { pass?: boolean; message?: string; cheated?: boolean; extraDamage?: boolean; laneId?:any } = {};
//        var input = (<HTMLInputElement>document.getElementById(this.captchaTextBoxId)).value;
//        if (input == '') {
//            output.pass = false;
//            output.message = "Enter text";
//            return output;
//        }
//        if (input == "completelevel") {
//            smorball.gameState.gs.gameLevelPoints[smorball.gameState.currentLevel - 1] = 3;
//            if (smorball.gameState.gs.maxLevel <= smorball.gameState.currentLevel + 1) {
//                smorball.gameState.gs.maxLevel = ++smorball.gameState.currentLevel;
//            }
//            smorball.gameState.currentState = smorball.gameState.states.GAME_OVER;
//            output.pass = false;
//            output.cheated = true;
//            output.message = "cheat code is accessed";
//            this.clearText();
//            return output;
//        }
//        if (input == "unlockall") {
//            smorball.gameState.gs.maxLevel = smorball.gameState.totalLevels;
//            smorball.gameState.currentState = smorball.gameState.states.GAME_OVER;
//            output.pass = false;
//            output.cheated = true;
//            output.message = "cheat code is accessed";
//            this.clearText();
//            return output;
//        }
//        var cw = new closestWord(input, this.captchasOnScreen);
//        if (cw.match) {
//            if (input.length > 8) {
//                output.extraDamage = true;
//            }
//            output.pass = true;
//            output.message = "correct";
//            var captcha = cw.closestOcr;
//            var index = this.captchasOnScreen.indexOf(captcha);
//            this.wordCount++;
//            this.captchasOnScreen.splice(index, 1);
//            output.laneId = captcha.id;
//            this.load(captcha);
//        } else {
//            output.pass = false;
//            output.message = "incorrect";
//            var captcha = cw.closestOcr;
//            var passDisabled = $("#captchaInputContainer #passButton").prop("disabled");
//            $("#captchaInputContainer input").prop("disabled", true);
//            setTimeout(() => {
//                $("#captchaInputContainer input").prop("disabled", false);
//                if (passDisabled)
//                    $("#captchaInputContainer #passButton").prop("disabled", true);
//                this.reset();
//                $("#inputText").focus();
//            }, smorball.gameState.gs.penalty);
//        }
//        var ob = {
//            _id : captcha._id,
//            text : input
//        };
//        if (ob._id) {
//            smorball.gameState.inputTextArr.push(ob);
//        }
//        this.clearText();
//        return output;
//    }
//    private getCaptcha(input) {
//        for (var i = 0; i < this.captchasOnScreen.length; i++) {
//            var captcha = this.captchasOnScreen[i];
//            if (input == captcha.texts[0] || input == captcha.texts[1]) {
//                return captcha;
//            }
//        }
//        return null;
//    }
//    private passText() {
//        this.clearText();
//        if (++this.currentPass >= this.maxPass) {
//            this.disablePassButton(true);
//            (<HTMLButtonElement>document.getElementById(this.captchaPassButton)).value = "PASS";
//            $("#inputText").focus();
//        }
//        this.reset();
//    }
//    private clearText() {
//        (<HTMLInputElement>document.getElementById(this.captchaTextBoxId)).value = "";
//    }
//    private disablePassButton(status) {
//        document.getElementById(this.captchaPassButton).disabled = status;
//    }
//    private getCaptchaCoordinates(cord) {
//        return {
//            sPoint: cord[3],
//            width: cord[2].x - cord[3].x,
//            height: cord[0].y - cord[3].y
//        };
//    }
//    callCaptchaFromServer() {
//        var url = "http://tiltfactor1.dartmouth.edu:8080/api/page";
//        $.ajax({
//            dataType: 'json',
//            url: url,
//            beforeSend: (xhr) => {
//                xhr.setRequestHeader('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1lIiwiaWF0IjoxNDE1MzQxNjMxMjY4LCJpc3MiOiJCSExTZXJ2ZXIifQ.bwRps5G6lAd8tGZKK7nExzhxFrZmAwud0C2RW26sdRM');
//            },
//            error: (XMLHttpRequest, textStatus, errorThrown) => {
//                console.log("error: " + textStatus);
//            },
//            success: data => {
//                if (data != null)
//                    this.processCaptchaData(data);
//            }
//        });
//    }
//    processCaptchaData(data) {
//        var myData = { "url": data.url, "differences": data.differences, "_id": data._id, "local": false };
//        smorball.loader.load([{ src: myData.url + ".jpeg", id: myData._id }], () => {
//            smorball.gameState.captchaDatasArray.push(myData);
//            if ((this.captchaDatas == undefined || this.captchaDatas.local) && smorball.gameState.currentLevel != 1) {
//                this.activateCaptchaSet();
//            }
//        });
//    }
//    private activateCaptchaSet() {
//        if (smorball.gameState.currentLevel == 1) {
//            this.captchaDatas = smorball.gameState.captchaDatasArray[0];
//        } else {
//            this.captchaDatas = smorball.gameState.captchaDatasArray[smorball.gameState.captchaDatasArray.length - 1];
//        }
//        if (!this.captchaDatas.local) {
//            smorball.gameState.captchaDatasArray.pop();
//        }
//        this.currentIndex = 0;
//    }
//    getCaptchaImageData() {
//        if (smorball.gameState.captchaDatasArray.length == 1) {
//            var data = smorball.gameState.captchaDatasArray[0];
//            var url = data.url + ".jpg";
//            return { "src": url, "id": data._id };
//        }
//        return null;
//    }
//    private assistText(laneId) {
//        for (var i = 0; i < this.captchasOnScreen.length; i++) {
//            var captcha = this.captchasOnScreen[i];
//            if (captcha.id == laneId) {
//                $("#" + this.captchaTextBoxId).val(captcha.texts[0]);
//            }
//        }
//    }
//    hideCaptchas() {
//        for (var i = 0; i < this.captchasOnScreen.length; i++) {
//            this.captchasOnScreen[i].alpha = 0;
//        }
//    }
//    showCaptchas() {
//        for (var i = 0; i < this.captchasOnScreen.length; i++) {
//            this.captchasOnScreen[i].alpha = 1;
//        }
//    }
//    getWordCount() 
//    {
//        return this.wordCount;
//    }
//}
