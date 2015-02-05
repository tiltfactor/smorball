/**
 * Created by user on 30/1/15.
 */
(function () {
  var Score = function(config){
      this.config = config;
      this.initialize();
  }

  Score.prototype = new createjs.Container;
  Score.prototype.Container_initialize = Score.prototype.initialize;

  Score.prototype.initialize=function(){
      this.Container_initialize();
  };
 
  Score.prototype.getTotalScore = function(){
    var gameLevelPoints = this.config.gameState.gs.gameLevelPoints;
    var currentLevelScore = this.config.gameState.gs.gameLevelPoints[this.config.gameState.currentLevel-1];
    if(!currentLevelScore){
      currentLevelScore = 0;
    }
    var total = arraySum(gameLevelPoints) - currentLevelScore;
    var dollars = this.getMyMoney();
    return total;
  }
  Score.prototype.getLevelScore = function(){
    var total = this.getTotalScore();
    var currentLevelScore = this.config.gameState.gs.gameLevelPoints[this.config.gameState.currentLevel-1];
    var levelTotal = total - currentLevelScore;
    return levelTotal;
  }
  Score.prototype.addGameLevelPoints = function(){
    this.config.gameState.gs.gameLevelPoints[this.config.gameState.currentLevel-1] = this.config.gameState.life;
  }

  Score.prototype.getMyMoney = function(){
    var dollars = 0;
    var bonus = 0;
    var gameLevelPoints = this.config.gameState.gs.gameLevelPoints;
    var currentLevel = this.config.gameState.currentLevel -1;

    for(var i= 0; i< gameLevelPoints.length; i++){
      if(i==currentLevel)continue;
      var point = gameLevelPoints[i];
      if(point == this.config.gameState.maxLife){
        bonus++;
      }
      dollars+= point;
    }
    dollars = dollars*1000 + bonus*2000-this.config.gameState.gs.dollorSpend;
    return dollars;


  }
  var arraySum = function(gameLevelPoints){
    var total = 0;
    for(var i=0; i<gameLevelPoints.length; i++){
      total += gameLevelPoints[i] ;
    }
    return total;
  }
  window.Score = Score;
}());