/**
 * Created by nidhincg on 27/12/14.
 */
(function(){

    var CaptchaProcessor = function(config){
        this.config = config;
        this.wordCount = 0;
        this.currentPass = 0;
        this.maxPass = 1;
        this.captchasOnScreen=[];
        this.captchaTextBoxId = "inputText";
        this.captchaPassButton = "passButton";
        this.init();
        cp = this;
    }
    CaptchaProcessor.prototype.init = function(){
        this.currentIndex = 0;
        if(this.config.gameState.captchaDatasArray.length == 1){
            this.callCaptchaFromServer();
        }

        activateCaptchaSet(this);
        loadEvents(this);
    }
    var activateUI = function(me){
        $("#canvasHolder").parent().css({position: 'relative'});
        document.getElementById('canvasHolder').style.display = "block";
        document.getElementById(me.captchaPassButton).value = 'Pass('+ me.maxPass + ')';
        disablePassButton(me,false);
        window.onload = prevent;
        $('#inputText').focus();
    }
    var prevent = function(e){
        e.defaultPrevented = true;
    }
    var loadEvents = function(me){
        var pt = function(e){passText(me,e)};
        EventBus.addEventListener("passText", pt);

        var at = function(e){assistText(me, e.target)};
        EventBus.addEventListener("assistText",at);

        EventBus.addEventListener("callCaptchaFromServer",this.callCaptchaFromServer);
    }

    CaptchaProcessor.prototype.getCaptchaPlaceHolder = function(maxWidth,height,laneId){
        activateUI(this);
        var captchaHolder = new createjs.Bitmap();
        captchaHolder.maxHeight = height;
        captchaHolder.maxWidth = maxWidth;
        captchaHolder.id = laneId;
        this.load(captchaHolder);
        return captchaHolder;
    }

    CaptchaProcessor.prototype.load = function(captcha){
        var captchaData = getCaptchaData(this);
        var message = "";
        captcha.image = captchaData.url;
        if(this.captchaDatas.local){
            setScale(captcha,captcha.image.width, captcha.image.height);
            captcha.texts = [captchaData.ocr1, captchaData.ocr2];
            if(this.config.gameState.currentLevel==1){
                EventBus.dispatch("showCommentary", captchaData.message);
            }


        }else{
            var myCords = getCaptchaCoordinates(captchaData.coords);
            captcha.sourceRect = new createjs.Rectangle(myCords.sPoint.x,myCords.sPoint.y,myCords.width,myCords.height);
            setScale(captcha, myCords.width, myCords.height);
            captcha.texts  =captchaData.texts;
            captcha._id = captchaData._id;
        }

        captcha.scaleX =captcha.scaleY = 0;
        createjs.Tween.get(captcha).to({scaleX:1,scaleY:1},1000,createjs.Ease.backOut);
        this.captchasOnScreen.push(captcha);
        ++this.currentIndex;

    };


    var getCaptchaData = function(me){
        checkCaptchaSetting(me);
        var captchaData = me.captchaDatas.differences[me.currentIndex];
        var imageId = null;
        var myText = null;
        if(me.captchaDatas.local){
            imageId = captchaData.image.split(".")[0];
            myText = captchaData.ocr1;
        }else{
            imageId = me.captchaDatas._id;
            myText = captchaData.texts[0];
        }
        captchaData.url  =  me.config.loader.getResult(imageId);
        if(captchaData.url == null){
            me.currentIndex++;
            captchaData = getCaptchaData(me);
        }
        if(getCaptcha(me,myText) != null){
            me.currentIndex++;
            captchaData = getCaptchaData(me);
        }

        return captchaData;
    }

    CaptchaProcessor.prototype.reset = function(){
        for(var i= this.captchasOnScreen.length-1 ; i >= 0; i--) {
            var captcha = this.captchasOnScreen[i];
            var index = this.captchasOnScreen.indexOf(captcha);
            this.captchasOnScreen.splice(index,1);
            this.load(captcha);
        }
    }

    var setScale = function(captcha, imgWidth, imgHeight){
        var cW = captcha.maxWidth-20;
        var cH = captcha.maxHeight - 10;
        var sx = cW/imgWidth  > 1 ? 1: cW/imgWidth ;
        var sy = cH/imgHeight > 1 ? 1 : cH/imgHeight ;
        captcha.scaleX = sx;
        captcha.scaleY = sy;
    }



    var checkCaptchaSetting = function(me){
        if(me.currentIndex == Math.floor(me.captchaDatas.differences.length/2) && me.config.gameState.currentLevel != 1){
            me.callCaptchaFromServer();
        }
        if(me.captchaDatas.local && me.config.loader.localCapthcaSize <= me.currentIndex){
            activateCaptchaSet(me);
        }
        if(me.currentIndex >= me.captchaDatas.differences.length){
            activateCaptchaSet(me);
        }
    }
    CaptchaProcessor.prototype.compare = function(){
        var me = this;
        var output = {};
        var input = document.getElementById(this.captchaTextBoxId).value;
        if(input == ''){
            output.pass = false;
            output.message = "Enter text";
            return output;
        }
        if(input == "completelevel"){
            this.config.gameState.gs.gameLevelPoints[this.config.gameState.currentLevel-1] = 3;
            if(this.config.gameState.gs.maxLevel<=this.config.gameState.currentLevel+1){
                this.config.gameState.gs.maxLevel = ++this.config.gameState.currentLevel;
            }
            this.config.gameState.currentState = this.config.gameState.states.GAME_OVER;
            output.pass = false;
            output.cheated = true;
            output.message = "cheat code is accessed";
            clearText(this);
            return output;
        }
        if(input=="unlockall"){
           this.config.gameState.gs.maxLevel = this.config.gameState.totalLevels;
           this.config.gameState.currentState = this.config.gameState.states.GAME_OVER;
            output.pass = false;
            output.cheated = true;
            output.message = "cheat code is accessed";
            clearText(this);

            return output;
        }
        var cw = new closestWord(input,this.captchasOnScreen);
        if(cw.match){
            if(input.length>8){
                output.extraDamage = true;
            }
            output.pass = true;
            output.message = "correct";
            var captcha = cw.closestOcr;
            var index = this.captchasOnScreen.indexOf(captcha);
            this.wordCount++;
            this.captchasOnScreen.splice(index,1);
            output.laneId = captcha.id;
            this.load(captcha);
        }else{
            output.pass = false;
            output.message = "incorrect";
            var captcha = cw.closestOcr;
            var passDisabled = $("#canvasHolder #passButton").prop("disabled");
            $("#canvasHolder input").prop("disabled",true);
            setTimeout(function(){
                $("#canvasHolder input").prop("disabled",false);
                if(passDisabled)
                    $("#canvasHolder #passButton").prop("disabled",true);
                me.reset();
                $("#inputText").focus();
            },me.config.gameState.gs.penalty);

        }
        var ob = {};
        ob._id = captcha._id;
        ob.text = input;
        if(ob._id){
            me.config.gameState.inputTextArr.push(ob);
        }
        clearText(this);
        return output;
    }


    var getCaptcha = function(me,input){
        for(var i = 0 ; i< me.captchasOnScreen.length; i++){
            var captcha = me.captchasOnScreen[i];
            if(input == captcha.texts[0]||input==captcha.texts[1]){
                return captcha;
            }
        }
        return null;
    }

    var passText = function(me){
        clearText(me);
        if(++me.currentPass >= me.maxPass){
            disablePassButton(me,true);
            document.getElementById(me.captchaPassButton).value = "PASS";
            $("#inputText").focus();
        }
        me.reset();
    }

    var clearText = function(me){
        document.getElementById(me.captchaTextBoxId).value = "";
    }
    var disablePassButton = function(me,status){
        document.getElementById(me.captchaPassButton).disabled = status;
    }

    var getCaptchaCoordinates = function(cord){
        var myCords = {};
        myCords.sPoint  = cord[3];
        myCords.width = cord[2].x - cord[3].x;
        myCords.height = cord[0].y - cord[3].y;
        return myCords;
    }

    CaptchaProcessor.prototype.callCaptchaFromServer = function(){
        var me = this;
        var url = "http://tiltfactor1.dartmouth.edu:8080/api/page";
        // setTimeout(function(){
        $.ajax({
            dataType: 'json',
            url: url,
            beforeSend : function(xhr){
                xhr.setRequestHeader('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1lIiwiaWF0IjoxNDE1MzQxNjMxMjY4LCJpc3MiOiJCSExTZXJ2ZXIifQ.bwRps5G6lAd8tGZKK7nExzhxFrZmAwud0C2RW26sdRM');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("error: "+ textStatus);
            },
            success: function(data){
                if(data != null)
                    processCaptchaData(data, me);
            }
        });
        //  }, 1);
    }

    var processCaptchaData = function(data, me){
        var myData = {"url" : data.url, "differences" : data.differences, "_id": data._id, "local": false };
        var _onImageLoad = function(me){
            me.config.gameState.captchaDatasArray.push(myData);
            if((me.captchaDatas == undefined ||  me.captchaDatas.local) && me.config.gameState.currentLevel != 1 ){
                activateCaptchaSet(me);
            }
        }
        me.config.loader.load([{src: myData.url + ".jpeg", id: myData._id}], _onImageLoad, me);

    }
    var activateCaptchaSet = function(me){
        if(me.config.gameState.currentLevel == 1){
            me.captchaDatas = me.config.gameState.captchaDatasArray[0];
        }else{
            me.captchaDatas = me.config.gameState.captchaDatasArray[me.config.gameState.captchaDatasArray.length-1];
        }

        if(!me.captchaDatas.local){
            me.config.gameState.captchaDatasArray.pop();
        }
        me.currentIndex = 0;
    }
    CaptchaProcessor.prototype.getCaptchaImageData = function(){
        if(this.config.gameState.captchaDatasArray.length == 1){
            var data = this.config.gameState.captchaDatasArray[0];
            var url = data.url + ".jpg";
            return {"src" : url, "id": data._id };
        }
        return null;
    }

    var assistText = function(me,laneId){
        for(var i=0;i<me.captchasOnScreen.length;i++){
            var captcha = me.captchasOnScreen[i];
            if(captcha.id == laneId){
                $("#"+me.captchaTextBoxId).val(captcha.texts[0]);
            }
        }
    }
    CaptchaProcessor.prototype.hideCaptchas = function(){
        for(var i =0;i<this.captchasOnScreen.length;i++){
            this.captchasOnScreen[i].alpha=0;
        }
    }
    CaptchaProcessor.prototype.showCaptchas = function(){
        for(var i =0;i<this.captchasOnScreen.length;i++){
            this.captchasOnScreen[i].alpha=1;
        }
    };
    CaptchaProcessor.prototype.getWordCount = function(){
      return this.wordCount;
    };


    window.CaptchaProcessor = CaptchaProcessor;

}());