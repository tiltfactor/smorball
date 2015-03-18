class Sound {

    config: any;
    mySound: any;

    constructor(config: any) {
        this.config = config;
        this.initialize();
    }

    private initialize() {
        this.mySound = this.config.loader.getResult(this.config.file);
        if (this.mySound != null) {
            this.mySound.loop = this.config.loop;
            var vol = this.setVolumeValue();
            this.setVolume(vol);
            if (!this.config.loop) {
                this.mySound.onended = () => { EventBus.dispatch("removeAudioFromList", this.mySound) };
            }
            else {
                this.mySound.onended = () => { this.play() };
            }
        }
    }
    private setVolumeValue() {
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
    }

    play() {
        /*if(this.loop){
            this.mySound.loop = true;
        }*/
        this.mySound.play();
    }

    pause() {
        this.mySound.pause();
    }

    setVolume(volume: number) {
        this.mySound.volume = volume;
    }   
}

