/**
 * Created by user on 3/2/15.
 */
(function () {
    var MyBag = function(config){
        this.config = config;
        this.myBag = [];
        initialize(this);
    }
    var initialize = function(me){
        for (var key in PowerupsData) {
            if (PowerupsData.hasOwnProperty(key)){
                var config = {"type" : key};
                var myPowerup = new MyPowerup(config);
                me.myBag.push(myPowerup);
            }
        }
    }


    var showMyPowerup = function(){
        //show
    }
    var addToBagFromField = function(powerup){
        var myPowerup = getMyPowerupByType(powerup.getType());
        myPowerup.addFieldPowerup();
    }

    var addToBagFromShop = function(powerup){
        var myPowerup = getMyPowerupByType(powerup.getType());
        myPowerup.addShopPowerup();
    }

    var getMyPowerupByType = function(type,me){
        for(var i= 0 ; i< me.myBag.length; i++){
            var myPowerup = me.myBag[i];
            if(myPowerup.getType() == type){
                return myPowerup;
            }
        }
        return null;
    }


    window.MyBag = MyBag;

}());
