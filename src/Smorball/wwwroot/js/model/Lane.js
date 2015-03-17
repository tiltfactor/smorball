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
        setLeftArea(this);
    }
    /*Lane.prototype.getPlayerPosition = function(){
        var point = {};
        point.x = 10;
        point.y = this.config.y + this.config.height/2;
        return point;
    }*/
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
        me.leftArea = tileWidth *2 ;
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
    window.Lane = Lane;
}());