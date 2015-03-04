/**
 * Created by Abhilash on 19/2/15.
 */
(function(){
    window.ui = window.ui||{};
    var LoaderClass = function(config){
        var me = this;
        this.config = config;
        onResize(this);
        this.initialize();
        //this.y = 600 - this.getTransformedBounds().height;
        window.onresize = function(){onResize(me)}
        this.y = 600 - this.getTransformedBounds().height/2;
        onResize(this);

    };

    LoaderClass.prototype = new createjs.Container();

    LoaderClass.prototype.Container_initialize = LoaderClass.prototype.initialize;

    LoaderClass.prototype.initialize = function(){
        this.Container_initialize();
        var gameLevel = this.config.currentLevel;
        var config = { "currentLevel" : gameLevel, "loader":this.config.loader,"type":this.config.type};
        this.preloader = new ui.Preloader(config);
        this.addChild(this.preloader);
        if(this.config.type == 0){
            var sb = new createjs.Bitmap(this.config.loader.getResult("smorball_logo"));
            if(sb.image != null){
                this.addChild(sb);
                sb.setTransform(500,0,1,1);
                this.preloader.x = 500;
                this.preloader.y = 800;
            }else{
                this.preloader.x = 500;
                this.preloader.y = 0;
            }



        }
        if(this.config.type == 1){
            this.preloader.x = 500;
            this.preloader.y = 400;
            drawText(this,gameLevel);
            drawTeams(this,gameLevel);

        }

        //this.regX = this.getTransformedBounds().width/2;
    };
    LoaderClass.prototype.updateLoader = function(perc){
        this.preloader.update(perc)
    };
    var drawText = function(me,gameLevel){
        var team = LevelData[gameLevel].levelName;
        var text = new createjs.Text(team,"60px Boogaloo","#ff770");
        text.x = 800-text.getMeasuredWidth()/2 + 20;
        me.addChild(text);
    };
    var drawTeams = function(me,gameLevel){
        drawHomeTeam(me,gameLevel);
        drawVSImage(me);
        drawEnemyTeam(me,gameLevel);

    };
    var drawVSImage = function(me){
        var vs = new createjs.Bitmap("shapes/vs.jpg");
        vs.setTransform(800,160,0.5,0.5);
        me.addChild(vs);
    };
    var drawHomeTeam = function(me){
        var container = new createjs.Container();
        var circle_one = new createjs.Shape();
        circle_one.graphics.beginStroke("black").drawCircle(0, 0, 120);

        var team = new createjs.Bitmap(me.config.loader.getResult("hometeam"));
        team.scaleX = team.scaleY = 0.5;
        team.x = -team.getTransformedBounds().width/2;
        team.y = -120;



        var teamtext =  "Chargers";
        var teamname = new createjs.Text(teamtext,"30px Boogaloo","#ff770");
        teamname.y = team.y + team.getTransformedBounds().height ;
        container.addChild(circle_one,team,teamname);
        container.setTransform(500,160);
        me.addChild(container);
    };
    var drawEnemyTeam = function(me,gameLevel){
        var container = new createjs.Container();
        var circle_one = new createjs.Shape();
        circle_one.graphics.beginStroke("black").drawCircle(0, 0, 120);

        var team = new createjs.Bitmap(me.config.loader.getResult("splash"+gameLevel));
        team.scaleX = team.scaleY = 0.5;
        team.x = -team.getTransformedBounds().width/2;
        team.y = -120;



        var teamtext = _.pick(MapData[gameLevel-1],"team").team;
        var teamname = new createjs.Text(teamtext,"30px Boogaloo","#ff770");
        teamname.y = team.y + team.getTransformedBounds().height ;
        container.addChild(circle_one,team,teamname);
        container.setTransform(1200,160);
        me.addChild(container);
    };
    LoaderClass.prototype.drawPlayButton = function(){
        var me = this;
        var btn = new createjs.Bitmap(me.config.loader.getResult("btn_bg"));
        btn.x = this.preloader.x + btn.getTransformedBounds().width/2;
        btn.y = this.preloader.y;
        btn.addEventListener("click",function(){
            window.onresize = "";
            me.config.stage.removeAllChildren();
            me.config.stage.update();
            $("#loaderDiv").hide();
            EventBus.dispatch("onImagesLoad");

        });
        this.addChild(btn);
        this.removeLoader();
    };
    var onResize = function(me){
        var canvas = me.config.stage.canvas;
        me.canvasWidth = canvas.width = window.innerHeight *4/3>window.innerWidth ? window.innerWidth : window.innerHeight*4/3;
        me.canvasHeight = canvas.height = me.canvasWidth *3/4>window.innerHeight?window.innerHeight:me.canvasWidth *3/4;

        me.config.stage.scaleX = me.canvasWidth/1600;
        me.config.stage.scaleY = me.canvasHeight/1200;
        me.config.stage.update();

        var paddingTop = (window.innerHeight - me.canvasHeight)/2;
        var paddingLeft = (window.innerWidth - me.canvasWidth)/2;
        $("#loaderCanvas").css({top: paddingTop, left : 0 });


    };
    LoaderClass.prototype.removeLoader = function(){
        this.removeChild(this.preloader);

    };
    var drawSBlogo = function(me){
        var sb = new createjs.Bitmap(me.config.loader.getResult("smorball_logo"));

        //if(sb.getBounds()){
        //    me.preloader.y = 1300;
        //    sb.setTransform(359,370);
        //}
        me.addChild(sb);
    }
    window.ui.LoaderClass = LoaderClass
}());