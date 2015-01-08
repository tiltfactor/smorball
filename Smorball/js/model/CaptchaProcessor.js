/**
 * Created by nidhincg on 27/12/14.
 */
(function(){

    var CaptchaProcessor = function(config){
        this.config = config;
        this.currentIndex =0;
        this.maxIndex = 6;
        this.currentPass = 0;
        this.maxPass = 1;
        this.captchas = [];
        this.captchaTextBoxId = "inputText";
        this.captchaPassButton = "passButton";
        initialize(this);
    }
    var initialize = function(me){
        loadEvents(me);
        $("#canvasHolder").css({top: me.config.canvasHeight, left: me.config.canvasWidth/2- $("#canvasHolder").width()/2, position:'absolute'});
        document.getElementById('canvasHolder').style.display = "block";
        document.getElementById(me.captchaPassButton).value = 'Pass('+ me.maxPass + ')';
        disablePassButton(me, false);
    }
    var loadEvents = function(me){
        var pt = function(e){passText(me)};
        EventBus.addEventListener("passText", pt);
    }
    CaptchaProcessor.prototype.getCaptchaPlaceHolder = function(position,laneId){
        var captcha = {};
        var captchaHolder = new createjs.Bitmap();
        captchaHolder.x = position.x;
        captchaHolder.y = position.y;
        captcha.holder = captchaHolder;
        captcha.id = laneId;

        this.load(captcha);
        this.captchas.push(captcha);
        return captchaHolder;
    }
    CaptchaProcessor.prototype.load = function(captcha){
        var json = captchaJson[this.currentIndex];
        json = tempGetCaptcha(this);//TO DO - remove this function
        captcha.holder.image = this.config.loader.getResult(json.id);
        captcha.json = json;
        //this.captchaHolder.x = this.captchaHolder.ox - this.captchaHolder.getTransformedBounds().width/2;
        if(++this.currentIndex > this.maxIndex){
            this.currentIndex = 0;
        }
    }

    var tempGetCaptcha = function(me){
        var json = captchaJson[me.currentIndex];
        if(getCaptcha(me, json.ocr2) != null){
            if(++me.currentIndex > me.maxIndex){
                me.currentIndex = 0;
            }
            json = tempGetCaptcha(me);
        }
        return json;
    }
    CaptchaProcessor.prototype.compare = function(){
        var output = {}
        var input = document.getElementById(this.captchaTextBoxId).value;
        if(input == ''){
            output.pass = false;
            output.message = "Enter text";
            return output;
        }
        var captcha = getCaptcha(this, input)
        if(captcha != null){
            output.pass = true;
            output.message = "Correct";
            output.laneId = captcha.id;
            this.load(captcha);
        }else{
            output.pass = false;
            output.message = "Incorrect";
        }
        clearText(this);
        return output;
    }


    var getCaptcha = function(me,input){
        for(var i = 0 ; i< me.captchas.length; i++){
            var captcha = me.captchas[i];
            if(input == captcha.json.ocr2){
                return captcha;
            }
        }
        return null;
    }
    var passText = function(me){
        clearText(me);
        if(++me.currentPass >= me.maxPass){
            disablePassButton(me,true);
        }
        for(var i= 0 ; i< me.captchas.length; i++) {
            var captcha = me.captchas[i];
            me.load(captcha);
        }
    }

    var clearText = function(me){
        document.getElementById(me.captchaTextBoxId).value = "";
    }
    var disablePassButton = function(me,status){
        document.getElementById(me.captchaPassButton).disabled = status;
    }


    window.CaptchaProcessor = CaptchaProcessor;

}());