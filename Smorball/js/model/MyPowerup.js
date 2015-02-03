/**
 * Created by user on 3/2/15.
 */
(function(){
    var MyPowerup = function(config){
        this.config = config;
    }

    MyPowerup.prototype = new createjs.Container;
    MyPowerup.prototype.Container_initialize = MyPowerup.prototype.initialize;

    MyPowerup.prototype.initialize = function(){
        this.fromShop = this.config.fromShop || 0;
        this.fromField = 0;
        drawPowerup(this);
        initText(this);
        //get image

    }

    var setupPower = function(){

    };
    var drawPowerup = function(me){
        var config = {"id" : me.config.id, "loader" : me.config.loader};
        me.powerup = new sprites.Powerup(config);
        me.addChild(me.powerup);
    }
    var initText = function(me){
        me.number = new createjs.Text();
        me.number.text = me.fromShop;
        me.number.font = "bold 10px Arial";
        me.number.color = "white";
        me.addChild(me.number);

    }

    var setText = function(me,text){
        me.number.text = text;
    }
    MyPowerup.prototype.addToFromField = function(){
        this.fromField++;
        var sum = this.fromField+this.fromShop;
        setText(this,sum);
    }
    MyPowerup.prototype.removeFromField = function(){
        if(this.fromField){
            this.fromField--
        }else{
            this.fromShop--
        }

        var sum = this.fromField+this.fromShop;
        setText(this,sum);
    }
    MyPowerup.prototype.getType = function(){
        return this.config.type;
    }
    MyPowerup.prototype.addShopPowerup = function(){
        this.fromShop++;
    }
    MyPowerup.prototype.removeShopPowerup = function(){
        this.fromShop--;
    }
    MyPowerup.prototype.addFieldPowerup = function(){
        this.fromField++;
    }
    MyPowerup.prototype.removeFieldPowerup = function(){
        this.fromField--;
    }

    window.MyPowerup = MyPowerup;

}())
