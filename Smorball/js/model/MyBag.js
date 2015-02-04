/**
 * Created by user on 3/2/15.
 */
(function () {
    var MyBag = function(config){
        this.config = config;
        this.myBag = [];
        this.selectedId = -1;
        initialize(this);
    }
    var initialize = function(me){
        loadEvents(me);
        for (var key in PowerupsData) {
            if (PowerupsData.hasOwnProperty(key)){
                var config = {"type" : key,"loader":me.config.loader};
                var myPowerup = new MyPowerup(config);
                me.myBag.push(myPowerup);
            }
        }
    }
    var loadEvents = function(me){
        var st = function(){selectOnTab(me)};
        EventBus.addEventListener("selectOnTab",st);
    }

    MyBag.prototype.unselectAll = function(){
        for(var i=0;i<this.myBag.length;i++){
            var myPowerup = this.myBag[i];
            myPowerup.unselect();
        }

    };
    var selectOnTab = function(me){
        EventBus.dispatch("unselectAllInBag");
        var mp;
        selectedPowerupOnTab(me);
        if(me.myBag[me.selectedId] != undefined){
            me.myBag[me.selectedId].select();
        }else{
            me.selectedId = -1;
        }

    }
    var selectedPowerupOnTab = function(me){

        do{
            ++me.selectedId;
            if(me.selectedId >= me.myBag.length){
                me.selectedId = -1;
                return;
            }
        }while(me.myBag[me.selectedId].getSum() <= 0)
    }
    var showMyPowerup = function(){
        //show
    }
    MyBag.prototype.addToBagFromField = function(powerup){
        var myPowerup = getMyPowerupByType(powerup.getType(),this);
        myPowerup.addFieldPowerup();
    }

    MyBag.prototype.addToBagFromShop = function(powerup){
        var myPowerup = getMyPowerupByType(powerup.getType());
        myPowerup.addShopPowerup();
    }
    MyBag.prototype.removeFromBag = function(powerup){
        var myPowerup = getMyPowerupByType(powerup.getType(),this);
        myPowerup.unselect();
        myPowerup.removeFromField();
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
