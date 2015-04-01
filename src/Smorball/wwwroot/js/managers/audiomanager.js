var AudioManager = (function () {
    function AudioManager() {
        this.musicVolume = 1;
        this.soundVolume = 1;
    }
    AudioManager.prototype.setMusicVolume = function (volume) {
        this.musicVolume = volume;
        smorball.persistance.persist();
    };
    AudioManager.prototype.setSoundVolume = function (volume) {
        this.soundVolume = volume;
        smorball.persistance.persist();
    };
    return AudioManager;
})();
