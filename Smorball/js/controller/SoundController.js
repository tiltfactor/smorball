function SoundController(config){
    this.config = config;

    SoundController.prototype.init = function(){
        this.audioList = [];
        this.config.stage = new createjs.Stage("loaderCanvas");
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin, createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
        createjs.Sound.alternateExtensions = ["wav"];
        loadEvents(this);
        playMusic(this);

    }

    var loadEvents = function(me){

        var ra = function(sound){removeAudioFromList(me,sound.target)};
        EventBus.addEventListener("removeAudioFromList",ra);

        var pa = function(){pauseAllSound(me)};
        EventBus.addEventListener("pauseAllSound", pa);

        var al = function(sound){addAudioToList(me,sound.target)};
        EventBus.addEventListener("addAudioToList", al);

        var cs = function(type){changeSoundVolume(me,type.target)};
        EventBus.addEventListener("changeSoundVolume", cs);

    }

    var addAudioToList = function(me,sound){
        if(sound.mySound != null){
            sound.play();
            me.audioList.push(sound);
        }
    }
    var removeAudioFromList = function(me,sound){
        if(sound.mySound != null){
            sound.pause();
            var index = me.audioList.indexOf(sound);
            me.audioList.splice(index,1);
        }
    }
    var pauseAllSound = function(me){
        for(var i= 0; i< me.audioList.length; i++){
            var sound = me.audioList[i];
            sound.pause();
        }
    }
    var pauseAllSound = function(me){
        for(var i= 0; i< me.audioList.length; i++){
            var sound = me.audioList[i];
            if(!sound.config.isMain){
                sound.pause();
            }
        }
    }

    var changeSoundVolume = function(me,type){
        for(var i= 0; i< me.audioList.length; i++){
            var sound = me.audioList[i];
            if(sound.config.type == type){
                var vol = me.config.gameState.gs.music/100;
                if(type == me.config.gameState.soundType.EFFECTS){
                    vol = me.config.gameState.gs.soundEffects/100;
                }
                sound.setVolume(vol);
            }
            
        }
    }

    var playMusic = function(me){
        var fileId = "mario";
        var config = {"file": fileId , "loop": true, "type": me.config.gameState.soundType.MAIN, "isMain": true,"loader":me.config.loader, "gameState":me.config.gameState};
        var mainSound = new Sound(config);
        EventBus.dispatch("addAudioToList",mainSound);
    }

    var persist = function(me){

    }

}
   