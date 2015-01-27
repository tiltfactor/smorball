/**
 * Created by Abhilash on 23/1/15.
 */
(function(){
    var LevelMap = function(config){
        this.config = config;
        this.labels=[];
        this.initialize()
    };
    LevelMap.prototype = new createjs.Container();
    LevelMap.prototype.Container_initialize = LevelMap.prototype.initialize;
    LevelMap.prototype.initialize = function(){
        this.Container_initialize();
        createObjects(this)

    };
    var createObjects = function(me){
        for(var i=0;i<MapData.length;i++){
            var level = MapData[i];
            var label = new createjs.Text();
            label.text = level.levelId;
            label.id =level.levelId;
            label.font = "bold 30px Arial";
            label.color = "black";
            label.alpha = 0.5;
            label.played = false;
            label.x = level.x;
            label.y = level.y;
            me.labels.push(label);
            me.addChild(label);
        }
    }
    LevelMap.prototype.activate =function(level){
        for(var i=0;i<level;i++){
            if(!this.labels[i].played){
                this.labels[i].played = true;
                this.labels[i].alpha=1;
                var id = this.labels[i].id ;
                var evt = function(e){EventBus.dispatch("setLevel", e.target)};
                this.labels[i].addEventListener("click",evt);
            }

        }

    };



    window.LevelMap = LevelMap


}());