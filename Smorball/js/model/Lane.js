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
       // addPlayer(this);
    };
//    var initCaptchaImage = function(me){
//        me.captcha = new createjs.Bitmap();
//        me.captcha.x = me.leftArea/2;
//        me.captcha.y = me.config.height/2;
//        me.addChild(me.captcha);
//    }

    Lane.prototype.getPlayerPosition = function(){
        var point = {};
        point.x = 10;
        point.y = this.config.y + this.config.height/2;
        return point;
    }
    Lane.prototype.setPlayer = function(player){
        this.player = player;
        this.player.x = 0;
        if(player.type == "football"){
            this.player.x =20;
        }
        this.player.y = (this.config.y - this.config.height*0.75);
        this.player.setEndPoint(this.config.x + this.config.width);
    }


    Lane.prototype.getPowerupPosition = function(me){

        var point = {};
        var limit = (this.config.width-this.leftArea) *3/4;
        point.x = (Math.random()*limit)+this.leftArea+ this.config.x;
        point.y = this.config.y + this.config.height/2;//this.config.y + (this.config.height/7);
        return point;

    }
    Lane.prototype.getCaptchaX = function(){
        return this.leftArea/2;
    }
    Lane.prototype.getMaxCaptchaWidth = function(){
        return this.leftArea;
    }
    Lane.prototype.getLaneHeight = function(){
        return this.config.height;
    }

    Lane.prototype.setCaptcha = function(captcha){
        this.captcha.image = this.config.loader.getResult(captcha.id);
        this.captcha.x = 100;
        this.captcha.regY = this.captcha.image.height/2 ;
        this.captcha.text = captcha.ocr2;//id.value
    }
    Lane.prototype.getStartPoint = function(){
        var point = {};
        point.x = this.config.x +10;
        point.y = this.config.y + this.config.height*0.75 ///2;//this.config.y + (this.config.height/7);
        return point;
    }
    Lane.prototype.getEnemyEndPoint = function(){
        var point = {};
        point.x = this.leftArea+this.config.x;
        point.y = this.config.y + this.config.height*0.75///2;//this.config.y + (this.config.height/7);
        return point;
    }
    Lane.prototype.getEndPoint = function(){
        var point = {};
        point.x = this.config.x + this.config.width;
        point.y = this.config.y + this.config.height*0.75;//this.config.y + (this.config.height/7);
        return point;
    }
    Lane.prototype.getHeight = function(){
        return this.config.height;
    }
    Lane.prototype.getLaneId = function(){
        return this.config.id;
    }

    var drawLayout = function(me){
        var totalTiles = 9;
        var tileWidth = 178;
        var tileHeight = 192;
        var padding = 10;
        //var reqTileWidth = Math.ceil(me.config.width/totalTiles);
        me.leftArea = tileWidth *2 ;
      //  var sX = reqTileWidth/tileWidth;
       // var sY = (me.config.height+padding)/tileHeight;
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
           // bitmap.scaleX =sX; bitmap.scaleY = sY;
            bitmap.x = w;
            bitmap.y = 0;
            w = w+ tileWidth;
            me.addChild(bitmap);
        }


    }

    var setLeftArea = function(me){
        var shape = new createjs.Shape();
        shape.graphics
            .beginFill("#ffffff")
            .drawRect(0,0,me.leftArea, me.config.height);
       shape.alpha = 0.5;
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