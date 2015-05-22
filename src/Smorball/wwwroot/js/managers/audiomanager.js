var AudioManager = (function () {
    function AudioManager() {
        this.musicVolume = 1;
        this.soundVolume = 1;
        this.musicVolumeMultiplier = 0.6;
        this.soundsPlaying = [];
        this.capsOutputted = false;
        //createjs.Sound.initializeDefaultPlugins();
        //createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]);
        //createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.defaultInterruptBehavior = createjs.Sound.INTERRUPT_NONE;
        //smorball.resources.fgQueue.installPlugin(<any>createjs.Sound);
        this.outputCaps();
    }
    AudioManager.prototype.outputCaps = function () {
        if (this.capsOutputted)
            return;
        if (createjs.Sound.getCapabilities() == null)
            return;
        this.capsOutputted = true;
        console.log("AUDIO CAPABILITIES: ", createjs.Sound.getCapabilities());
        console.log("Active Plugin", createjs.Sound.activePlugin);
    };
    AudioManager.prototype.init = function () {
        var _this = this;
        createjs.Sound.on("fileload", function (e) { return _this.onSoundLoaded(e.id); });
        var manifest = smorball.resources.getResource("audio_manifest");
        createjs.Sound.registerSounds(manifest);
        this.outputCaps();
    };
    AudioManager.prototype.onSoundLoaded = function (id) {
        if (id == "main_theme_sound" && smorball.screens.current != null && smorball.screens.current != smorball.screens.game) {
            this.playMusic();
            this.outputCaps();
        }
    };
    AudioManager.prototype.setMusicVolume = function (volume) {
        this.musicVolume = volume;
        if (this.music)
            this.music.volume = volume * this.musicVolumeMultiplier;
        smorball.persistance.persist();
    };
    AudioManager.prototype.setSoundVolume = function (volume) {
        var change = volume - this.soundVolume;
        _.each(this.soundsPlaying, function (s) { return s.volume += change; });
        this.soundVolume = volume;
        smorball.persistance.persist();
    };
    AudioManager.prototype.playMusic = function () {
        if (this.music != null)
            return;
        this.music = createjs.Sound.play("main_theme_sound");
        this.music.loop = -1;
        this.music.volume = this.musicVolume * this.musicVolumeMultiplier;
        this.outputCaps();
        if (this.music.playState == "playFailed")
            this.music = null;
    };
    AudioManager.prototype.playSound = function (id, volumeMultipler) {
        if (volumeMultipler === void 0) { volumeMultipler = 1; }
        var sound = createjs.Sound.play(id);
        sound.volume = this.soundVolume * volumeMultipler;
        this.soundsPlaying.push(sound);
        return sound;
    };
    AudioManager.prototype.playAudioSprite = function (id, options, volumeMultipler) {
        if (volumeMultipler === void 0) { volumeMultipler = 1; }
        var sound = createjs.Sound.play(id, options);
        sound.volume = this.soundVolume * volumeMultipler;
        this.soundsPlaying.push(sound);
        return sound;
    };
    AudioManager.prototype.stopMusic = function () {
        if (this.music == null)
            return;
        this.fadeOutAndStop(this.music, 1000);
        this.music = null;
    };
    AudioManager.prototype.fadeOutAndStop = function (sound, duration) {
        createjs.Tween.get(sound).to({ volume: 0 }, duration).call(function () {
            sound.stop();
        });
    };
    AudioManager.prototype.update = function (delta) {
        for (var i = 0; i < this.soundsPlaying.length; i++) {
            var s = this.soundsPlaying[i];
            if (s.playState == "playFinished") {
                this.soundsPlaying.splice(i, 1);
                i--;
            }
        }
    };
    return AudioManager;
})();
