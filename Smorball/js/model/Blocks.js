/**
 * Created by Abhilash on 19/1/15.
 */
(function(){
    var Blocks = function(config){
        this.config= config;
        this.x = config.x|0;
        this.y = config.y|0;
        this.leftBlockSeats = [];
        this.rightBlockSeats = [];
        this.blockWidth = config.width/3;
    };


    Blocks.prototype.drawLeftChairBlock = function(){
        return drawChairs(this,"A");

    };
    Blocks.prototype.drawRightChairBlock = function(x){
        var rightBlock = drawChairs(this, "B");
        rightBlock.x = this.config.width-this.blockWidth;
        return rightBlock;
    };
    Blocks.prototype.getLeftBlockPosition = function(){
      return {"x":0,"y":0}
    };
    Blocks.prototype.getRightBlockPosition = function(){
        return {"x":this.config.width-this.blockWidth,"y":0}
    };
    Blocks.prototype.getFreePosition = function(){
        return {"x":this.blockWidth,"y":0}
    };
    var drawChairs = function(me,blockId){
        var container = new createjs.Container();
        var blockId = blockId;
        var leftPadding = 25;
        if(blockId == "A"){
            leftPadding = leftPadding* -1;
        }
        var topPadding = 90;
        var rows = 5;
        var columns = 5;

        var x = 0, y = 0, w;
        for(var i = 0; i< rows; i++){
            if(i%2 == 0){
                x= leftPadding;
            }else{
                x = 0;
            }
            y = topPadding + i*30;
            for(var j= 0 ; j< columns; j++){
                var seat_id = blockId+i+j;
                var config = {"id":seat_id,"x":x,"y":y,"loader":me.config.loader};
                var seat = new Chair(config);
                container.addChild(seat);
                x = x + seat.getTransformedBounds().width;
                if(blockId == "A"){
                    me.leftBlockSeats.push(seat);
                }else{
                    me.rightBlockSeats.push(seat);
                }

            }


        }

        return container;

    };

    Blocks.prototype.setPosition = function(x,y){
        this.x = x;
        this.y = y;
    }
    window.Blocks = Blocks
}());