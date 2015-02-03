function SoundController(config){
    this.config = config;

    SoundController.prototype.init = function(){
        this.audioList = [];

        this.config.stage = new createjs.Stage("loaderCanvas");
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin, createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
        createjs.Sound.alternateExtensions = ["mp3"];
        loadEvents(this);
        setMusic(this);
        playMusic(this);
    }

    var loadEvents = function(me){



        var pm = function(){playMusic(me)};
        EventBus.addEventListener("playMusic", pm);

        var mv = function(){musicVolume(me)};
        EventBus.addEventListener("musicVolume",mv);

        var ra = function(sound){removeAudioFromList(me,sound.target)};
        EventBus.addEventListener("removeAudioFromList",ra);

        var pa = function(){pauseAllSound(me)};
        EventBus.addEventListener("pauseAllSound");

    }

    var addAudioToList = function(me,sound){
        sound.play();
        me.audioList.push(sound);
    }
    var removeAudioFromList = function(me,sound){
        sound.pause();
        var index = me.audioList.indexOf(sound);
        me.audioList.splice(index,1)
    }


    var pauseAllSound = function(me){
        for(var i= 0; i< me.audioList.length; i++){
            var sound = me.audioList[i];
            sound.pause();
        }
    }

    var changeSound = function(me, type){
        for(var i= 0; i< me.audioList.length; i++){
            var sound = me.audioList[i];
            sound.setVolume(vol);
        }
    }




    var setMusic = function(me){
      me.config.musicInstance = new Sound({"loop":false,"loader":me.config.loader,"file":"hit","loop":false});
      me.config.musicInstance.volume = 0.5;
        addAudioToList(me,me.config.musicInstance);
    }

    var playMusic = function(me){
      me.config.musicInstance.play();
    }

    var musicVolume = function(me){
        me.config.musicInstance.volume = me.config.gameState.gs.music/100;
    }
    
}
   