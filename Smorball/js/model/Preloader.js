/**
 * Created by Abhilash on 27/11/14.
 */
(function () {

    window.ui = window.ui || {};

    var Preloader = function (config) {
        this.config = config;
        this.fillColor = "#AFA";
        this.strokeColor = "#000";
        this.width = 800;
        this.height = 80;
        this.fillColor;
        this.initialize();
    };
    Preloader.prototype = new createjs.Container();

    Preloader.prototype.Container_initialize = Preloader.prototype.initialize;
    Preloader.prototype.initialize = function () {
        this.Container_initialize();
        drawPreloader(this);
        //if(this.config.type==0){
        //    setBackground(this);
        //}

        setMessage(this,"LOADING...");
        //setPosition(this);
    };

    var drawPreloader = function (me) {
        var outline = new createjs.Bitmap(me.config.loader.getResult("loading_bar_bottom"));
        var inline = new createjs.Bitmap(me.config.loader.getResult("loading_bar_top"));
        var bar = new createjs.Bitmap(me.config.loader.getResult("loading_bar"));

        //outline.graphics.beginBitmapFill("shapes/loading_bar_bottom.png");
        //outline.graphics.drawRect(0, 0, me.width, me.height);

        me.bar = new createjs.Shape();
        me.bar.graphics.beginBitmapFill(bar.image).drawRect(5, 5, 570, 44).endFill();

        me.bar.scaleX = 0;
        me.addChild(outline,me.bar,inline);
    };



    Preloader.prototype.update = function (perc) {
        perc = perc > 1 ? 1 : perc;
        this.bar.scaleX = perc;
    }
    
    var setPosition=function(me){
        //me.x = (me.config.stage.canvas.width / 2) - (me.width / 2);
        //me.y =(me.config.stage.canvas.height / 2) - (me.height / 2);
    };
    
    var setMessage=function(me, text){
        var msgField = new createjs.Text(text,"Bold 60px Boogaloo","#ffffff");
        msgField.y = me.y - 80;
        msgField.x = me.x + 200;
        //msgField.scaleX = me.config.stage.canvas.width/800;
        //msgField.scaleY = me.config.stage.canvas.height/600;
        me.addChild(msgField);
    };
    
    var setBackground=function(me){
        var loaderData = LoaderData[me.config.currentLevel];
        var loaderMessage = new createjs.Text("LOADING...", "40px Boogaloo","#ff770");
        loaderMessage.x = -loaderMessage.getMeasuredHeight();
        var logo = new createjs.Bitmap();
        var img = me.config.loader.getResult("loader_default_bg");
           
        if(loaderData !=  undefined){
            var img = me.config.loader.getResult(loaderData.id);
            if(loaderData.message != undefined){
                loaderMessage.text = loaderData.message;
                loaderMessage.x = me.width/2 - loaderMessage.getBounds().width/2;
                loaderMessage.y = me.height/2 - loaderMessage.getBounds().height/2;
                me.addChild(loaderMessage);
            }
        }
        
        if(img != null){
            logo.image = img;
            logo.x = me.width/2 - logo.getBounds().width/2;
            logo.y = me.height/2 - logo.getBounds().height/2;
            me.addChildAt(logo,0);
        }           
    };

    window.ui.Preloader = Preloader;

}());