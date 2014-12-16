/**
 * Created by Nidhin C G on 1/12/14.
 */
(function () {

    var SpriteSheet =  function(config) {
        this.config = config;
        this.initialize();
    };
    SpriteSheet.prototype  = new createjs.SpriteSheet;
    SpriteSheet.prototype._initialize = SpriteSheet.prototype.initialize;
    SpriteSheet.prototype.initialize = function(){
        this.data = JSON.parse(JSON.stringify(this.config.data));
        setImages(this);
        this._initialize(this.data);
    };

    var setImages = function(me){
        for(var i = 0 ; i< me.data.images.length; i++){
            me.data.images[i] = me.config.loader.getResult(me.data.images[i]);
        }
    }

    SpriteSheet.prototype.getFrameWidth = function(){
        return this._frameWidth;
    }
    SpriteSheet.prototype.getFrameHeight = function(){
        return this._frameHeight;
    }

    window.SpriteSheet = SpriteSheet;

}());