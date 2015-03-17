/**
 * Created by user on 3/2/15.
 */
(function () {
    var MyBag = function(config){
        this.config = config;
        this.myBag = [];
        this.selectedId = -1;
        initialize(this);
        mybg = this;
    }
    var initialize = function(me){
        loadEvents(me);
        loadBag(me);
    }
    var loadBag = function(me){
        var store = new LocalStorage();
        var data = store.getFromStore();
        var inbag = data.myBag||loadInitBag(me);
        createMyPowerup(me, inbag);
    }
    var createMyPowerup = function(me, inbag){
        for(var i = 0 ; i< inbag.length; i++){
            var p = inbag[i];
            var config = {"type" : p.type, "shopped" : p.shopped, "loader" : me.config.loader};
            var myPowerup = new MyPowerup(config);
            me.myBag.push(myPowerup);
        }
    }
    var loadInitBag = function(me){
        var arr = [];
        for (var key in PowerupsData) {
            if (PowerupsData.hasOwnProperty(key)){
                var data = {"type" : key};
                arr.push(data);
            }
        }
        return arr;
    }
    var loadEvents = function(me){
        var st = function(){selectOnTab(me)};
        EventBus.addEventListener("selectOnTab",st);
    }

    MyBag.prototype.unselectAll = function(){
        var myPowerup= _.findWhere(this.myBag,{selected:true});
        if(myPowerup)
            myPowerup.unselect();

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
    MyBag.prototype.addToBagFromField = function(powerup){
        var myPowerup = getMyPowerupByType(powerup.getType(),this);
        myPowerup.addFieldPowerup();
    }

    MyBag.prototype.addToBagFromShop = function(powerupId){
        var myPowerup = getMyPowerupByType(powerupId,this);
        myPowerup.addShopPowerup();
    }
    MyBag.prototype.removeFromBag = function(powerup){
        var myPowerup = getMyPowerupByType(powerup.getType(),this);
        myPowerup.unselect();
        myPowerup.removeFromField();
    }
    MyBag.prototype.removeFromBagToShop = function(powerupId){
        var myPowerup = getMyPowerupByType(powerupId,this);
        myPowerup.removeShopPowerup();
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

   MyBag.prototype.persist = function(){
        var myBag= [];
        for(var i= 0; i< this.myBag.length; i++){
            var mp = this.myBag[i];
             myBag.push(mp.persist());
        }
       return myBag;
    }

    MyBag.prototype.reset = function(){
        this.myBag = [];
        var inbag = loadInitBag(this);
        createMyPowerup(this, inbag);
    };
    MyBag.prototype.newGame = function(){
        this.selectedId = -1;
        this.myBag = [];
        loadBag(this);
    }
    window.MyBag = MyBag;

}());
