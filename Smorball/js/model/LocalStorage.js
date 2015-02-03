/**
 * Created by user on 2/2/15.
 */
(function () {
    var LocalStorage = function(config){
        this.config = config;
        loadMyPowerup(this);
    }

    var loadMyPowerup = function(me){
        //has to check the localstorge is null
        for (var key in PowerupsData) {
            if (PowerupsData.hasOwnProperty(key)){
                var config = {"type" : key};
                var myPowerup = new MyPowerup(config);
                me.config.gameState.gs.inBag.push(myPowerup);
            }
        }
    }

    window.LocalStorage = LocalStorage;

}());
