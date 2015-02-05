/**
 * Created by user on 2/2/15.
 */
(function () {
    var LocalStorage = function(config){
        this.config = config;
        this.key = "Smorball";
        //loadMyPowerup(this);
    }
    LocalStorage.prototype.saveToStore = function(data){
        localStorage.setItem(this.key, data);
    }
    LocalStorage.prototype.getFromStore = function(){
        return localStorage.getItem(this.key);
    }


    window.LocalStorage = LocalStorage;

}());
