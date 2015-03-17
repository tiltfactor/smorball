/**
 * Created by Abhilash on 17/2/15.
 */
(function(){
  var Spawning = function(config){
      this.config = config;
      this.cleatsConst = 20;
      this.helmetConst = 20;
      this.bullhornConst = 20;
      this.hpSinceLastPowerupSpawn = 0;
      this.init();
  };
  Spawning.prototype.init=function(){
      checkSponserShips(this);
  };
  Spawning.prototype.onPowerupSpawned = function(){
      this.hpSinceLastPowerupSpawn = 0;
  }
  Spawning.prototype.onEnemyKilled = function(life){
      this.hpSinceLastPowerupSpawn += life;
      var cleatsChance = this.hpSinceLastPowerupSpawn / (3 * this.cleatsConst);
      var helmetChance = this.hpSinceLastPowerupSpawn / (3 * this.helmetConst);
      var bullhornChance = this.hpSinceLastPowerupSpawn / (3 * this.bullhornConst);

      var r = Math.random();
      if (r < cleatsChance){
          if(this.config.gameState.currentLevel>=this.config.gameState.cleatsUnlockLevel){
              EventBus.dispatch("pushExtraPowerup","cleats");
          }else{
              this.onPowerupSpawned();
          }
      }

      else if (r < cleatsChance + helmetChance){
          if(this.config.gameState.currentLevel>=this.config.gameState.helmetUnlockLevel){
              EventBus.dispatch("pushExtraPowerup","helmet");
          }else{
              this.onPowerupSpawned();
          }
      }

      else if (r < cleatsChance + bullhornChance){
          if(this.config.gameState.currentLevel>=this.config.gameState.bullhornUnlockLevel){
              EventBus.dispatch("pushExtraPowerup","bullhorn");
          }else{
              this.onPowerupSpawned();
          }

      }


  }
  var checkSponserShips = function(me){
      for(var i=0;i<me.config.gameState.gs.sponserShips.length;i++){
          var type = me.config.gameState.gs.sponserShips[i];
          if(type == "snike"){
              me.cleatsConst = 10
          }else if(type == "bawling"){
              me.helmetConst = 10;
          }else if(type == "loudmouth"){
              me.bullhornConst = 10;
          }
      }
  } ;

    window.Spawning = Spawning;
}());