(function (){
    var Lane = function(config){
        this.config = config;
        this.laneId = config.id;
        this.leftArea = config.width/6; //300;
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
    };
    var initCaptchaImage = function(me){
        me.captcha = new createjs.Bitmap();
        me.captcha.x = 10;
        me.captcha.y = me.config.height/2;
        me.addChild(me.captcha);
    }
    Lane.prototype.getPowerupPosition = function(me){

        var point = {};
        point.x = this.leftArea+this.config.x;
        point.y = this.config.y + this.config.height/2;//this.config.y + (this.config.height/7);
        return point;

    }
    Lane.prototype.getCaptchaPosition = function(){
        var point = {};
        point.x = 10;
        point.y = this.config.height/2;
        return point;
    }
    Lane.prototype.getMaxCaptchaWidth = function(){
        return this.leftArea;
    }
    Lane.prototype.getLaneHeight = function(){
        return this.config.height;
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

    var drawLayout = function(me){
        var totalTiles = 9;
        var tileWidth = 178;
        var tileHeight = 192;
        var padding = 10;
        var reqTileWidth = Math.floor(me.config.width/totalTiles);
        var sX = reqTileWidth/tileWidth;
        var sY = (me.config.height+padding)/tileHeight;
        var tileImage = "grassTile";
        var w = 0;

        for(var i = 0; i< totalTiles; i++){
            var ide = 0;
            if(me.laneId % 2 == 0 ){
                ide = 3;
            }else{
                ide = 1;
            }
            if(i% 2 != 0){
                ide++;
            }

            var bitmap = new createjs.Bitmap(me.config.loader.getResult(tileImage+ide));
            bitmap.scaleX =sX; bitmap.scaleY = sY;
            bitmap.x = w;
            bitmap.y = 0;
            w = w+ reqTileWidth;
            me.addChild(bitmap);
        }


    }

    var setLeftArea = function(me){
        var shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(me.config.loader.getResult("left"))
            .drawRect(me.leftArea,0,3, me.config.height);
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