
/**
 * Created by Abhilash on 19/1/15.
 */
(function(){
    var CommentaryBox = function(config){
        this.config = config;
        this.timer=0;
        loadEvents(this);
        this.initialize()
    };
    CommentaryBox.prototype = new createjs.Container();

    CommentaryBox.prototype.Container_initialize = CommentaryBox.prototype.initialize;

    CommentaryBox.prototype.initialize=function(){
        this.Container_initialize();
        drawScoreBoard(this);
        initShowCommentary(this,this.speech);
        startCommentaryTimer(this);
        this.x = this.config.width/2;

    };
    CommentaryBox.prototype.kill = function(){
        clearInterval(this.timer);
    };
    var loadEvents = function(me){
        var si = function(object){showCommentary(me,object.target)};
        EventBus.addEventListener("showCommentary",si);
    };
    var drawScoreBoard = function(me){

        //me.config.stage.addChild(me.scoreContainer);
        var score = new createjs.Bitmap(me.config.loader.getResult("score"));
        score.regX = score.getTransformedBounds().width/2;
        score.y = 5;
        score.scaleX = 0.5;
        score.scaleY = 0.5;
        me.addChild(score);
        var cmtBox = new createjs.Bitmap(me.config.loader.getResult("cmt"));
        cmtBox.regX = cmtBox.getTransformedBounds().width/2;
        cmtBox.scaleX = 0.5;
        cmtBox.scaleY = 0.5;
        cmtBox.y = score.getTransformedBounds().height-5;

        drawSpeakers(me,cmtBox,score);

        me.speech = new createjs.Bitmap(me.config.loader.getResult("speech"));
        me.speech.regX = me.speech.getTransformedBounds().width/2;
        me.speech.y = cmtBox.getTransformedBounds().height/2+me.speech.getTransformedBounds().height/5;

        me.speech.scaleX = 0.5;
        me.speech.scaleY = 0.5;
        me.addChild(cmtBox,me.speech);
    };
    var drawSpeakers = function(me,cmtBox,score){

        for(var i=0;i<2;i++){
            var speakerContainer = new createjs.Container();
            var speaker = new createjs.Bitmap(me.config.loader.getResult("speaker"));
            var pole = new createjs.Bitmap(me.config.loader.getResult("pole"));
            pole.scaleX = 0.5;
            pole.scaleY = 0.5;
            speaker.regX = speaker.getTransformedBounds().width/2;
            speaker.scaleX = -0.5*(Math.pow(-1,i));
            speaker.scaleY = 0.5;
            speaker.x = me.x+(Math.pow(-1,i))*((cmtBox.getTransformedBounds().width/2)+(speaker.getTransformedBounds().width/2));
            speaker.y = score.getTransformedBounds().height+(score.getTransformedBounds().height/2);
            pole.x = speaker.x-speaker.getTransformedBounds().width/2+20;
            pole.y = speaker.y+speaker.getTransformedBounds().height/2;
            speakerContainer.addChild(pole,speaker);
            speakerContainer.y=-10;
            me.addChild(speakerContainer);
        }

    };

    var showCommentary = function(me, text){
        if(text) {
            me.infoAry.push(text);
        }
    };

    var initShowCommentary = function(me) {
        me.info = new createjs.Text();
        me.info.text = "Jujubees, is coming!";
        me.info.font = "bold 10px Arial";
        me.info.color = "black";
        me.info.alpha = 1;
        me.info.x = me.speech.x-me.speech.getTransformedBounds().width/2+10 ;
        me.info.y = me.speech.y+10 ;
        me.info.lineWidth = me.speech.getTransformedBounds().width - 15;
        me.addChild(me.info);
        //createjs.Tween.get(me.info).wait(5000);
        me.infoAry = [];
    };

    var startCommentaryTimer = function(me) {
        me.timer = setInterval(function() {
            var txt = me.infoAry.pop();
            console.log(txt);
            if (txt){
                me.info.text = txt;
                createjs.Tween.get(me.info).wait(5000);
            }else{
                me.info.text = "";
            }
        }, 5000);
    };

    window.CommentaryBox = CommentaryBox;
}());