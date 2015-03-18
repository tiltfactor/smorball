var Sound = (function () {
    function Sound(config) {
        this.config = config;
        this.initialize();
    }
    Sound.prototype.initialize = function () {
        var _this = this;
        this.mySound = this.config.loader.getResult(this.config.file);
        if (this.mySound != null) {
            this.mySound.loop = this.config.loop;
            var vol = this.setVolumeValue();
            this.setVolume(vol);
            if (!this.config.loop) {
                this.mySound.onended = function () {
                    EventBus.dispatch("removeAudioFromList", _this.mySound);
                };
            }
            else {
                this.mySound.onended = function () {
                    _this.play();
                };
            }
        }
    };
    Sound.prototype.setVolumeValue = function () {
        if (this.config.type == this.config.gameState.soundType.EFFECTS) {
            var vol = this.config.gameState.config.store.soundEffects / 100;
            if (!vol) {
                vol = this.config.gameState.gs.soundEffects / 100;
            }
        }
        else if (this.config.type == this.config.gameState.soundType.MAIN) {
            var vol = this.config.gameState.config.store.music / 100;
            if (!vol) {
                vol = this.config.gameState.gs.music / 100;
            }
        }
        return vol;
    };
    Sound.prototype.play = function () {
        /*if(this.loop){
            this.mySound.loop = true;
        }*/
        this.mySound.play();
    };
    Sound.prototype.pause = function () {
        this.mySound.pause();
    };
    Sound.prototype.setVolume = function (volume) {
        this.mySound.volume = volume;
    };
    return Sound;
})();
