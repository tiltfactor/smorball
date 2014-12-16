/**
 * Created by user on 12/12/14.
 */
(function () {
    var Wave = function(config){
       // var config = {"level": 2, "waves": 5, "enemyPerWave" : 2, "lanes" : 2, "life" : 1, "types" : ["boss"]}
        this.config = config;
        this.enemies = [];
        this.initialize();
    }

    Wave.prototype.initialize = function(){
        generateEnemies(this);
    }

    Wave.prototype.getLaneNumber = function(){
        var randomLaneNum = Math.floor( Math.random() * this.config.lanes);
        return randomLaneNum;
    }

    var generateEnemies = function(me){

        for(var i = 0; i< me.config.enemyPerWave; i++){
            var enemyType = me.config.types[0]; // todo : get a type from types and change images too, random types
            var life = me.config.life; //random
            var config = {"id": enemyType, "life": life, "loader" : me.config.loader};
            var enemy = new sprites.Enemy(config);
            me.enemies.push(enemy);
        }
    }


    window.Wave = Wave;

}());
