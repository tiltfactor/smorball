/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../model/sound.ts" />
var SoundController = (function () {
    function SoundController(config) {
        this.config = config;
    }
    SoundController.prototype.init = function () {
        //this.audioList = [];
        this.config.stage = new createjs.Stage("loaderCanvas");
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin, createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
        createjs.Sound.alternateExtensions = ["wav"];
        this.loadEvents();
        this.playMusic();
    };
    SoundController.prototype.loadEvents = function () {
        var _this = this;
        EventBus.addEventListener("removeAudioFromList", function (sound) { return _this.removeAudioFromList(sound.target); });
        EventBus.addEventListener("pauseAllSound", function () { return _this.pauseAllSound(); });
        EventBus.addEventListener("changeSoundVolume", function (type) { return _this.changeSoundVolume(type.target); });
        EventBus.addEventListener("setMute", function () { return _this.setMute(); });
        EventBus.addEventListener("playSound", function (sound) { return _this.playSound(sound.target); });
        EventBus.addEventListener("stopSound", function (sound) { return _this.stopSound(sound.target); });
    };
    SoundController.prototype.stopSound = function (fileId) {
        for (var i = 0; i < this.config.gameState.audioList.length; i++) {
            var sound = this.config.gameState.audioList[i];
            if (sound.config.file == fileId) {
                EventBus.dispatch("removeAudioFromList", sound);
            }
        }
    };
    SoundController.prototype.playSound = function (fileId) {
        var config = { "file": fileId, "loop": false, "type": this.config.gameState.soundType.EFFECTS, "isMain": false, "loader": this.config.loader, "gameState": this.config.gameState };
        if (config.file == "stadiumAmbience" || config.file == "crowdCheering") {
            config.loop = true;
        }
        var sound = new Sound(config);
        this.removeSoundEffects();
        this.addAudioToList(sound);
    };
    SoundController.prototype.addAudioToList = function (sound) {
        if (sound.mySound != null) {
            this.config.gameState.audioList.push(sound);
            sound.play();
        }
    };
    SoundController.prototype.removeAudioFromList = function (sound) {
        if (sound.mySound != null) {
            sound.pause();
            var index = this.config.gameState.audioList.indexOf(sound);
            this.config.gameState.audioList.splice(index, 1);
        }
    };
    SoundController.prototype.removeSoundEffects = function () {
        for (var i = 0; i < this.config.gameState.audioList.length; i++) {
            var removeSound = this.config.gameState.audioList[i];
            if (!removeSound.config.isMain) {
                if (removeSound.config.file == "stadiumAmbience" || removeSound.config.file == "crowdCheering") {
                    continue;
                }
                removeSound.mySound.pause();
                removeSound.mySound.currentTime = 0;
                this.removeAudioFromList(removeSound);
            }
        }
    };
    SoundController.prototype.pauseAllSound = function () {
        for (var i = 0; i < this.config.gameState.audioList.length; i++) {
            var sound = this.config.gameState.audioList[i];
            if (!sound.config.isMain) {
                sound.pause();
            }
        }
    };
    SoundController.prototype.setMute = function () {
        var audioList = this.config.gameState.audioList;
        for (var i = 0; i < audioList.length; i++) {
            var main = audioList[i].config.type;
            if (main == this.config.gameState.soundType.MAIN) {
                if (audioList[i].mySound.paused) {
                    audioList[i].play();
                }
                else {
                    audioList[i].pause();
                }
            }
        }
    };
    SoundController.prototype.changeSoundVolume = function (type) {
        for (var i = 0; i < this.config.gameState.audioList.length; i++) {
            var sound = this.config.gameState.audioList[i];
            if (sound.config.type == type) {
                var vol = this.config.gameState.gs.music / 100;
                if (type == this.config.gameState.soundType.EFFECTS) {
                    vol = this.config.gameState.gs.soundEffects / 100;
                }
                sound.setVolume(vol);
            }
        }
    };
    SoundController.prototype.playMusic = function () {
        var fileId = "mainTheme";
        var config = { "file": fileId, "loop": true, "type": this.config.gameState.soundType.MAIN, "isMain": true, "loader": this.config.loader, "gameState": this.config.gameState };
        var mainSound = new Sound(config);
        this.addAudioToList(mainSound);
    };
    SoundController.prototype.persist = function () {
    };
    return SoundController;
})();
