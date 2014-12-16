/**
 * Created by user on 1/12/14.
 */
(function () {

    window.sprites = window.sprites || {};
    //var me = this;
    var Product = function (config) {
        this.config = config || {};
        this.config.status = "Buy";
        this.height = 125;
        this.width = 100;
        this.textHeight = 25;
        this.initialize();
    }

    var p = Product.prototype = new createjs.Container;
    p.Sprite_initialize = p.initialize;
    p.initialize = function () {
        var me = this;
        this.Sprite_initialize();

        addOuterRectangle(this);
        addImage(this);
        addLabel(this);
        addPriceTag(this);

        var handle = function(){me.handleClick(me)};
        this.addEventListener("click", handle);
    }

    Product.prototype.setPosition = function(x,y){
        this.x = x;
        this.y = y;
    };
    Product.prototype.handleClick = function(ob){
        if (ob.config.status == "Buy"){
            ob.config.status = "InBag";
            updatePriceTag(ob);
            EventBus.dispatch("addToBag", ob);

        } else {
            ob.config.status = "Buy";
            updatePriceTag(ob);
            EventBus.dispatch("removeFromBag", ob);

        }

    };

    var addImage = function(me){
        var bitmap = new createjs.Bitmap(me.config.image);
        bitmap.setTransform(0,0,0.5,0.5);
        me.addChild(bitmap);
        bitmap.x =  (me.width/2) -((bitmap.image.width * bitmap.scaleX)/2);
        bitmap.y =  ((me.height) /2)- ((bitmap.image.height*bitmap.scaleY)/2)-me.textHeight/2;


    }
    var addOuterRectangle = function(me){
        var rect= new createjs.Shape();
        rect.alpha = 0.5;
        rect.graphics.beginStroke("#000").setStrokeStyle(2).beginFill("#757575")
            .drawRoundRect(me.x+1,me.y+1,me.width,me.height,10).endStroke();
        rect.graphics.beginStroke("#000").moveTo(0,me.height-me.textHeight).lineTo(me.width,me.height-me.textHeight);

        me.addChild(rect);
    }
    var addPriceTag = function(me){
        me.price = new createjs.Text(me.config.status+" $"+me.config.price,"15px px Arial","##1A0000");
        me.price.textAlign = 'center';
        me.price.textBaseline = 'top';
        me.price.x = me.width/2;
        me.price.y = me.height- me.price.getMeasuredHeight()-5;
        me.addChild(me.price);


    }

    var updatePriceTag = function(me){
        me.price.text = me.config.status+" $"+me.config.price;
    }

    var addLabel = function(me){
        var name = new createjs.Text(me.config.name,"15px px Arial","#007C29");
        name.textAlign = 'center';
        name.textBaseline = 'top';
        name.x = me.width/2;
        name.y = 5;
        me.addChild(name)
    }

    Product.prototype.persist = function(){
        var data = [];
        data.model = {};
        data.model.status = this.config.status;
        data.model.image = this.config.image

    }

    window.sprites.Product = Product;
}());
