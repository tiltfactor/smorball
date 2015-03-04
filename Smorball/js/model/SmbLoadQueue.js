/**
 * Created by Nidhin C G on 1/12/14.
 */
(function () {

    var SmbLoadQueue =  function(config) {
        this.config = config;
        this.initialize();
        ldr = this;
    };


    SmbLoadQueue.prototype._initialize = SmbLoadQueue.prototype.initialize;
    SmbLoadQueue.prototype.initialize = function(){
        this.events = {};
        this.fg_loader = new createjs.LoadQueue(true,"",false);
        this.bg_loader = new createjs.LoadQueue(false,"",false);
        this.active = false;
        this.captchaLoad = false;
        this.localCapthcaSize = 8;
        var me = this;
        ld = this;
        setTimeout(function(){loadLocalImages(me)}, 10000);
    };

    var updateLoader =function(e, me){
        me.loaderClass.updateLoader(e.progress);
        me.config.stage.update();
    };

    var addEventsonLoad = function(me, manifest,callback, ob){
        me.events.loaderEvent =  function(e){ updateLoader(e,me)};
        me.fg_loader.addEventListener("progress",me.events.loaderEvent);
        me.fg_loader.loadManifest(manifest);
        me.events.click = function(){ loadComplete(me,callback,ob); }
        me.fg_loader.addEventListener("complete", me.events.click);
        me.events.error = function(e){console.log(e)};
        me.fg_loader.addEventListener("error",me.events.error);
    }

    SmbLoadQueue.prototype.loadLevelQueue = function(manifest,level){
        $("#loaderDiv").show();
        this.active = true;
        var config = {"stage" : this.config.stage, "gameState" : this.config.gameState,"currentLevel":level, "loader":this.fg_loader,"type":1};
        this.loaderClass = new ui.LoaderClass(config);
        this.config.stage.addChild(this.loaderClass);
        if(manifest.length != 0){
           addEventsonLoad(this,manifest);
        }else{
           loadComplete(this);
        }


    }
    SmbLoadQueue.prototype.initialLoad = function(manifest,callback,ob){
        var me  =this;
        $("#loaderDiv").show();
        var text = new createjs.Text("LOADING...","Bold 60px Boogaloo","#ffffff");
        text.setTransform(800,600);
        this.config.stage.addChild(text);
        this.fg_loader.loadManifest(manifest);
        this.fg_loader.addEventListener("complete", function(){
            //
            me.config.stage.removeAllChildren();
            me.fg_loader.removeAllEventListeners();
            callback(ob);
        });
    }


    SmbLoadQueue.prototype.loadQueue = function(manifest, callback, ob ,level){
        $("#loaderDiv").show();
        if(manifest.length != 0){
            var me = this;
            this.active = true;
            var config = {"stage" : this.config.stage, "gameState" : this.config.gameState,"currentLevel":level, "loader":this.fg_loader,"type":0};
            this.loaderClass = new ui.LoaderClass(config);
            this.config.stage.addChild(this.loaderClass);
            addEventsonLoad(this,manifest,callback,ob);
        }else{
            callback(ob);
        }

    }
    SmbLoadQueue.prototype.getbgloader = function(){
        return this.bg_loader;
    }
    SmbLoadQueue.prototype.getfgloader = function(){
        return this.fg_loader;
    }
    SmbLoadQueue.prototype.getResult = function(imgID){
        var url  =  this.fg_loader.getResult(imgID);
        if(!url){
            url = this.bg_loader.getResult(imgID);
        }
        return url;
    }

    SmbLoadQueue.prototype.load = function(manifest, callback, ob){
        if(manifest.length!= 0){
           // console.log("image load");

            //this.loadManifest(manifest);
            var me = this;
            this.events.loadComplete = function(){
                //console.log("on complete of sever image call");
                me.active = false;
                me.bg_loader.removeEventListener("complete", me.events.loadComplete);
                callback(ob);
            };
            this.bg_loader.addEventListener("complete", this.events.loadComplete);
            this.bg_loader.loadManifest(manifest);
        }else{
            callback(ob);
        }

    }
    var loadComplete = function(me,callback, ob){
        //console.log("hii");
        me.active = false;
        me.fg_loader.removeEventListener("complete",me.events.click);
        me.fg_loader.removeEventListener("progress",  me.events.loaderEvent);
        if(callback){
            me.config.stage.removeAllChildren();
            me.config.stage.update();
            $("#loaderDiv").hide();
            callback(ob);
        }else{
            me.loaderClass.drawPlayButton();
            me.config.stage.update();
        }

    }

    var loadLocalImages = function(me){
        var manifest = [];
        if(me.localCapthcaSize + 10 <= localData.differences.length){

            if(!me.active && !me.captchaLoad){
                me.captchaLoad = true;
                for(var i = me.localCapthcaSize ; i<= me.localCapthcaSize+10 ; i++){
                    var img = {};
                    var name = zeroFill(i,3);
                    img.src = "shapes/captcha/"+name+".png";
                    img.id = name;
                    manifest.push(img);
                }
                me.localCapthcaSize += 10;
                me.fg_loader.loadManifest(manifest);
                me.fg_loader.addEventListener("complete", function(){
                    me.captchaLoad = false;
                    //console.log("-------------> loaded "+me.localCapthcaSize )
                });
            }


            setTimeout(function(){loadLocalImages(me)}, 10000);
           // console.log("local images loading"+ me.localCapthcaSize);
        }
    }
    // creates number in format 000
    var zeroFill= function( number, width){
        width -= number.toString().length;
        if ( width > 0 )
        { return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number; }

        return number + "";
    }

    window.SmbLoadQueue = SmbLoadQueue;

}());