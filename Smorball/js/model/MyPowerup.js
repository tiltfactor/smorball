/**
 * Created by user on 3/2/15.
 */
(function(){
   var MyPowerup = function(config){
       this.config = config;
       this.initialize();
   }

    MyPowerup.prototype = new createjs.Container;
    MyPowerup.prototype.Container_initialize = MyPowerup.prototype.initialize;

    MyPowerup.prototype.initialize = function(){
        this.fromShop = this.config.fromShop || 0;
        this.fromField = 0;
        //get image

    }

    var setupPower = function(){

    }


    MyPowerup.prototype.getType = function(){
        return this.config.type;
    }
    MyPowerup.prototype.addToMyPowerup = function(type){

    }
    MyPowerup.prototype.removeFromMyPowerup = function(type){

    }
    window.MyPowerup = MyPowerup;


}())
