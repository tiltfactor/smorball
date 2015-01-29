function SoundController(config){
    this.config = config;

    SoundController.prototype.init = function(){
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

    }

    var setMusic = function(me){
      me.config.musicInstance = me.config.loader.getResult("mario");
      me.config.musicInstance.volume = 0.5;
    }

    var playMusic = function(me){
      me.config.musicInstance.play();
    }

    var musicVolume = function(me){
        me.config.musicInstance.volume = me.config.gameState.gs.music/100;
    }
    
}
   