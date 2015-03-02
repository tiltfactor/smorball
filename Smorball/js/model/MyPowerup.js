/**
 * Created by user on 3/2/15.
 */
(function(){
    var MyPowerup = function(config){
        this.config = config;
        this.initialize();
    }

    MyPowerup.prototype = new createjs.Container();
    MyPowerup.prototype.Container_initialize = MyPowerup.prototype.initialize;

    MyPowerup.prototype.initialize = function(){
        var me = this;
        this.Container_initialize();
        this.shopped = this.config.shopped || 0;
        this.fromShop = this.shopped || 0;
        this.fromField = 0;
        this.selected = false;
        this.reset();
        drawPowerup(this);
        initText(this);
        loadEvents(this);
        checkCount(this,this.getSum());

    }

    var loadEvents = function(me){
        me.events = {};
        me.events.click = function(){activatePowerup(me)};
        //this.addEventListener("click", this.events.click)
    }
    var checkCount = function(me,sum){
        if(sum > 0){
            me.addEventListener("click", me.events.click);
        }else{
            me.removeEventListener("click", me.events.click);
        }
    }
    MyPowerup.prototype.reset = function(){
        this.fromField = 0;
        var sum = this.getSum()+this.shopped;
        if(sum>0){
            this.alpha =1;
        }else{
            this.alpha=0;
        }
        if(this.number){
            this.number.text = this.shopped;
        }
    }
    MyPowerup.prototype.getSum = function(){
        var sum = this.fromField + this.fromShop;
        return sum;
    }
    MyPowerup.prototype.setPosition = function(x,y){
        this.x = x;
        this.y = y;
    }
    MyPowerup.prototype.unselect = function(){
        this.selected = false;
        this.powerup.scaleY = 1;
    }
    MyPowerup.prototype.select = function(){
       if(this.getSum()>0){
           EventBus.dispatch("selectPowerUp",this);
           this.selected = true;
           this.powerup.scaleY = 1.1;
       }



    }
    MyPowerup.prototype.getId=function(){
        return this.config.type;
    }
    MyPowerup.prototype.getPower = function(){
        return PowerupsData[this.config.type].extras;
    }
    var activatePowerup = function(me){
        var flag = me.selected;
        EventBus.dispatch("unselectAllInBag");
        if(flag){
            me.unselect();
        }else{
            me.select();
        }

    }


    var setupPower = function(){

    };
    var drawPowerup = function(me){
        var image = PowerupsData[me.config.type].data.images[0];
        me.powerup = new createjs.Bitmap(me.config.loader.getResult(image));
        me.addChild(me.powerup);
    }
    var initText = function(me){
        me.number = new createjs.Text();
        me.number.text = me.shopped;
        me.number.font = "bold 40px Arial";
        me.number.color = "blue";
        me.number.x = me.powerup.getTransformedBounds().width-me.number.getMeasuredWidth();
        me.number.y = me.powerup.getTransformedBounds().height-me.number.getMeasuredHeight();
        me.addChild(me.number);

    }

    var setText = function(me,text){
        me.number.text = text;
    }
    MyPowerup.prototype.getWidth = function(){
        return this.getTransformedBounds().width;
    }


    MyPowerup.prototype.removeFromField = function(){
        if(this.fromField){
            this.fromField--
        }else{
            this.fromShop--
        }


        var sum = this.fromField + this.fromShop;
        checkCount(this,sum);
        setText(this,sum);
        if(sum==0){
            this.alpha = 0;
        }
    }
    MyPowerup.prototype.getType = function(){
        return this.config.type;
    }
    MyPowerup.prototype.addShopPowerup = function(){
        this.fromShop++;
        this.shopped++;
        var sum = this.fromField + this.fromShop;
        checkCount(this,sum);
        setText(this,sum);
        if(sum>0){
            this.alpha=1;
        }
    }
    MyPowerup.prototype.removeShopPowerup = function(){
        this.fromShop=0;
        this.shopped = 0;
    }
    MyPowerup.prototype.addFieldPowerup = function(){
        this.fromField++;
        var sum = this.fromField + this.fromShop;
        checkCount(this,sum);
        setText(this,sum);
        if(sum>0){
            this.alpha=1;
        }
    }
    MyPowerup.prototype.removeFieldPowerup = function(){
        this.fromField--;
    }

    MyPowerup.prototype.persist = function(){
        var data = {};
        data.type = this.config.type;
        //data.fromShop = this.fromShop;
        data.shopped = this.shopped;
        return data;
    }

    window.MyPowerup = MyPowerup;

}())
