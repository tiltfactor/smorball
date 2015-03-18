/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../model/sound.ts" />

class SoundController {

    config: any;

    constructor(config: any) {
        this.config = config;
    }

    init() {
        //this.audioList = [];
        this.config.stage = new createjs.Stage("loaderCanvas");
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin, createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
        createjs.Sound.alternateExtensions = ["wav"];
        this.loadEvents();
        this.playMusic();
    }

    private loadEvents() {
        EventBus.addEventListener("removeAudioFromList", sound => this.removeAudioFromList(sound.target));
        EventBus.addEventListener("pauseAllSound", () => this.pauseAllSound());
        EventBus.addEventListener("changeSoundVolume", type => this.changeSoundVolume(type.target));
        EventBus.addEventListener("setMute", () => this.setMute());
        EventBus.addEventListener("playSound", sound => this.playSound(sound.target));
        EventBus.addEventListener("stopSound", sound => this.stopSound(sound.target));
    }

    private stopSound(fileId) {
        for (var i = 0; i < this.config.gameState.audioList.length; i++) {
            var sound = this.config.gameState.audioList[i];
            if (sound.config.file == fileId) {
                EventBus.dispatch("removeAudioFromList", sound);
            }
        }
    }

    private playSound(fileId) {
        var config = { "file": fileId, "loop": false, "type": this.config.gameState.soundType.EFFECTS, "isMain": false, "loader": this.config.loader, "gameState": this.config.gameState };
        if (config.file == "stadiumAmbience" || config.file == "crowdCheering") {
            config.loop = true;
        }
        var sound = new Sound(config);
        this.removeSoundEffects();
        this.addAudioToList(sound);
    }

    private addAudioToList(sound : Sound) {
        if (sound.mySound != null) {
            this.config.gameState.audioList.push(sound);
            sound.play();
        }
    } 

    private removeAudioFromList(sound : Sound) {
        if (sound.mySound != null) {
            sound.pause();
            var index = this.config.gameState.audioList.indexOf(sound);
            this.config.gameState.audioList.splice(index, 1);
        }
    }

    private removeSoundEffects() {
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
    }

    private pauseAllSound() {
        for (var i = 0; i < this.config.gameState.audioList.length; i++) {
            var sound = this.config.gameState.audioList[i];
            if (!sound.config.isMain) {
                sound.pause();
            }
        }
    }

    private setMute() {
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
    }

    private changeSoundVolume(type) {
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
    }

    private playMusic() {
        var fileId = "mainTheme";
        var config = { "file": fileId, "loop": true, "type": this.config.gameState.soundType.MAIN, "isMain": true, "loader": this.config.loader, "gameState": this.config.gameState };
        var mainSound = new Sound(config);
        this.addAudioToList(mainSound);
    }

    private persist(){
    }
}