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
        window.onresize = function(){onResize(me)};
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
            this.preloader.y = 800;
            drawText(this,gameLevel);
            drawTeams(this,gameLevel);

        }
    };
    LoaderClass.prototype.updateLoader = function(perc){
        this.preloader.update(perc)
    };
    var drawText = function(me,gameLevel){
        var team = LevelData[gameLevel].levelName;
        var text = new createjs.Text(team,"bold 120px Boogaloo","#ffffff");
        text.lineWidth = 630;
        text.textAlign = "center";
        text.lineHeight = text.getMeasuredHeight()/2 + 20;
        text.shadow = new createjs.Shadow("#000000", 3, 3, 1);
        text.x = 800;
        text.y = -50;
        me.addChild(text);
    };
    var drawTeams = function(me,gameLevel){
        drawHomeTeam(me,gameLevel);
        drawVSText(me);
        drawEnemyTeam(me,gameLevel);

    };
    var drawVSText = function(me){
        var vs = new createjs.Text("VS","bold 140px Boogaloo","#ffffff");
        vs.shadow = new createjs.Shadow("#000000", 3, 3, 1);
        vs.textAlign = "center";
        vs.setTransform(790,410);
        me.addChild(vs);
    };
    var drawHomeTeam = function(me){
        var team = new createjs.Bitmap(me.config.loader.getResult("hometeam"));
        team.setTransform(140,210);
        me.addChild(team);
    };
    var drawEnemyTeam = function(me,gameLevel){
        var team = new createjs.Bitmap(me.config.loader.getResult("splash"+gameLevel));
        team.setTransform(960,210);
        me.addChild(team);
    };
    LoaderClass.prototype.drawPlayButton = function(){
        var me = this;
        this.config.stage.enableMouseOver(10);
        var btnContainer = new createjs.Container();
        var btn = new createjs.Bitmap(me.config.loader.getResult("btn_bg"));
        btnContainer.x = this.preloader.x + btn.getTransformedBounds().width/2-40;
        btnContainer.y = this.preloader.y;
        btnContainer.addEventListener("mousedown",function(e){
            window.onresize = "";
            e.target.cursor = "pointer";
            btn.image = me.config.loader.getResult("btn_down");
            me.config.stage.removeAllChildren();
            me.config.stage.update();
            $("#loaderDiv").hide();
            EventBus.dispatch("onImagesLoad");
            EventBus.dispatch("playSound","stadiumAmbience");
            $("#inputText").focus();
        });

        btnContainer.addEventListener("mouseout",function(e){
            e.target.cursor = "pointer";
            btn.image = me.config.loader.getResult("btn_bg");
            me.config.stage.update();
        });
        btnContainer.addEventListener("mouseover",function(e){
            e.target.cursor = "pointer";
            btn.image = me.config.loader.getResult("btn_over");
            me.config.stage.update();
        });
        btnContainer.addEventListener("pressup",function(e){
            e.target.cursor = "pointer";
            btn.image = me.config.loader.getResult("btn_bg");
            me.config.stage.update();
        });
        var btnText = new createjs.Text("PLAY","bold 60px Boogaloo","#ffffff");
        btnText.textBaseline='middle';
        btnText.x =  btn.getTransformedBounds().width/2 - btnText.getMeasuredWidth()/2;
        btnText.y =  btn.getTransformedBounds().height/2 -  btnText.getMeasuredHeight()/2;
        btnContainer.addChild(btn,btnText);
        this.addChild(btnContainer);
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
        me.addChild(sb);
    }
    window.ui.LoaderClass = LoaderClass
}());