/**
 * Created by Nidhin C G on 1/12/14.
 */
(function () {

    var SmbLoadQueue =  function(config) {
        this.config = config;
        this.initialize();
    };
    SmbLoadQueue.prototype.initialize = function(){
        this.events = {};
        this.fg_loader = new createjs.LoadQueue(true,"",false);
        this.bg_loader = new createjs.LoadQueue(false,"",false);
        this.active = false;
        this.captchaLoad = false;
        this.localCapthcaSize = Manifest.level1.length;
        var me = this;
        ld = this;
        setTimeout(function(){loadLocalImages(me)}, 10000);
    };

    var updateLoader =function(e, me){
        me.preLoader.update(e.progress);
        me.config.stage.update();
        if(e.progress == 1){
            me.config.stage.removeAllChildren();
            me.config.stage.update();
            $("#loaderDiv").hide();
        }
    };

    var showLoading = function(me, gameLevel){
        me.preLoader = new ui.Preloader({"stage" : me.config.stage, "currentLevel" : gameLevel, "loader":me});
        $("#loaderDiv").show();
        me.config.stage.addChild(me.preLoader);
        me.events.loaderEvent =  function(e){ updateLoader(e,me)}
        me.fg_loader.addEventListener("progress",me.events.loaderEvent);
    }

    SmbLoadQueue.prototype.loadQueue = function(manifest, callback, ob , gameLevel){
        if(manifest.length != 0){
            var me = this;
            this.active = true;
            showLoading(me, gameLevel);
            this.fg_loader.loadManifest(manifest);
            this.events.click = function(){ loadComplete(callback,ob,me); }
            this.fg_loader.addEventListener("complete", this.events.click);
            this.events.error = function(e){console.log(e)};
            this.fg_loader.addEventListener("error",this.events.error);
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
            console.log("image load");
            this.bg_loader.loadManifest(manifest);
            //this.loadManifest(manifest);
            var me = this;
            this.events.loadComplete = function(){
                console.log("on complete of sever image call");
                me.active = false;
                me.bg_loader.removeEventListener("complete", me.events.loadComplete);
                callback(ob);
            }
            this.bg_loader.addEventListener("complete", this.events.loadComplete);
        }else{
            callback(ob);
        }

    }
    var loadComplete = function(callback, ob, me){
        console.log("hii");
        me.active = false;
        me.fg_loader.removeEventListener("complete",me.events.click);
        me.fg_loader.removeEventListener("progress",  me.events.loaderEvent);
        callback(ob);
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
                    console.log("-------------> loaded "+me.localCapthcaSize )
                });
            }


            setTimeout(function(){loadLocalImages(me)}, 10000);
            console.log("local images loading"+ me.localCapthcaSize);
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