(function (){
    var Lane = function(config){
        this.config = config;
        this.id = config.id;
        this.leftArea = config.width/4; //300;
        this.initialize();
    };
    Lane.prototype = new createjs.Container();
    Lane.prototype.Container_initialize = Lane.prototype.initialize;
    Lane.prototype.initialize = function(){
        this.Container_initialize();
        this.x = this.config.x;
        this.y = this.config.y;
        drawLayout(this);
        //setBackgroundText(this);
        setLeftArea(this);
        initCaptchaImage(this);
        //this.laneNumber = num;
    };
    var initCaptchaImage = function(me){
        me.captcha = new createjs.Bitmap();
        me.captcha.x = 10;
        me.captcha.y = me.config.height/2;
        me.addChild(me.captcha);
    }

    Lane.prototype.setCaptcha = function(captcha){
        this.captcha.image = this.config.loader.getResult(captcha.id);
        this.captcha.regY = this.captcha.image.height/2;
        this.captcha.text = captcha.ocr2;//id.value
    }
    Lane.prototype.getStartPoint = function(){
        var point = {};
        point.x = this.config.x +10;
        point.y = this.config.y + this.config.height/2;//this.config.y + (this.config.height/7);
        return point;
    }
    Lane.prototype.getEnemyEndPoint = function(){
        var point = {};
        point.x = this.leftArea+this.config.x;
        point.y = this.config.y + this.config.height/2;//this.config.y + (this.config.height/7);
        return point;
    }
    Lane.prototype.getEndPoint = function(){
        var point = {};
        point.x = this.config.x + this.config.width;
        point.y = this.config.y + this.config.height/2;//this.config.y + (this.config.height/7);
        return point;
    }
    Lane.prototype.getHeight = function(){
        return this.config.height;
    }
    var drawLayout=function(me){
        var shape = new createjs.Shape();
        shape.graphics.beginStroke('#000').setStrokeStyle(2)
            .beginBitmapFill(me.config.loader.getResult("playarea"))
            .drawRect(0,0,me.config.width,me.config.height);

        me.addChild(shape);
    };
    var setLeftArea = function(me){
        var shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(me.config.loader.getResult("left"))
            .drawRect(0,0,me.leftArea, me.config.height);
        me.addChild(shape);
    }
    var setBackgroundText=function(me){
        var msg = new createjs.Text("Lane "+me.config.id,"italic 100px Arial", "#FFF");
        msg.x = me.config.width/2- msg.getMeasuredWidth()/2;
        msg.y = me.config.height/2 - 50;
        msg.alpha = 0.2;
        me.addChild(msg);

    };

    window.Lane = Lane;
}());