/**
 * Created by Abhilash on 20/1/15.
 */
(function(){
    var AdBoard = function(config){
        this.config = config;
        this.boards = []
        this.initialize();

    };

    AdBoard.prototype = new createjs.Container();
    AdBoard.prototype.Container_initialize = AdBoard.prototype.initialize;

    AdBoard.prototype.initialize = function(){
        this.Container_initialize();
        drawAdBoards(this);
    };
    var drawAdBoards = function(me){
        var x = 0, y = 0;
        for(var i = 0 ; i< 3 ; i++){
            var ad = new createjs.Bitmap(me.config.loader.getResult("ad"));
            ad.setTransform(x,y, 1,1);
            x = x + ad.getTransformedBounds().width;
            me.boards.push(ad);
            me.addChild(ad);
        }

    };

    window.AdBoard = AdBoard;
}());