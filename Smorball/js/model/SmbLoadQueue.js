/**
 * Created by Nidhin C G on 1/12/14.
 */
(function () {

    var SmbLoadQueue =  function(config) {
        this.config = config;
        this.initialize();
    };
    SmbLoadQueue.prototype  = new createjs.LoadQueue(false, "", false);
    SmbLoadQueue.prototype._initialize = SmbLoadQueue.prototype.initialize;
    SmbLoadQueue.prototype.initialize = function(){
        this._initialize();
        this.events = {};
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
        }
    };

    var showLoading = function(me){
        me.preLoader = new ui.Preloader({stage : me.config.stage});
        me.config.stage.addChild(me.preLoader);
        me.events.loaderEvent =  function(e){ updateLoader(e,me)}
        me.addEventListener("progress",me.events.loaderEvent);
    }

    SmbLoadQueue.prototype.loadQueue = function(manifest, callback, ob){
        if(manifest.length != 0){
            var me = this;
            this.active = true;
            showLoading(me);
            this.loadManifest(manifest);
            this.events.click = function(){ loadComplete(callback,ob,me); }
            this.addEventListener("complete", this.events.click);
        }else{
            callback(ob);
        }

    }
    SmbLoadQueue.prototype.load = function(manifest, callback, ob){
        if(manifest.length!= 0){
            console.log("image load");
            this.loadManifest(manifest);
            var me = this;
            this.events.loadComplete = function(){
                console.log("on complete of sever image call");
                me.active = false;
                me.removeEventListener("complete", me.events.loadComplete);
                callback(ob);
            }
            this.addEventListener("complete", this.events.loadComplete);
        }else{
            callback(ob);
        }

    }
    var loadComplete = function(callback, ob, me){
        console.log("hii");
        me.active = false;
        me.removeEventListener("complete",me.events.click);
        me.removeEventListener("progress",  me.events.loaderEvent);
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
                me.loadManifest(manifest);
                me.addEventListener("complete", function(){
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