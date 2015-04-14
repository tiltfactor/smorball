var PersistanceManager = (function () {
    function PersistanceManager() {
    }
    PersistanceManager.prototype.persist = function () {
        var obj = {
            musicVolume: smorball.audio.musicVolume,
            soundVolume: smorball.audio.soundVolume,
            difficulty: smorball.difficulty.current.name,
            levels: smorball.user.levels,
            cash: smorball.user.cash,
            upgrades: smorball.upgrades.upgradesOwned,
            bestSurvivalTime: smorball.user.bestSurvivalTime,
            lastLevelPlayed: smorball.user.lastLevelPlayed,
            lastSurvivalTime: smorball.user.lastSurvivalTime,
            hasSaveGame: smorball.user.hasSaveGame
        };
        localStorage.setItem("smorball", JSON.stringify(obj));
    };
    PersistanceManager.prototype.depersist = function () {
        // Grab the persisted data, if there is none then dont go any further
        var s = localStorage.getItem("smorball");
        if (s == undefined)
            return;
        // Convert it to our data object
        var obj = JSON.parse(s);
        // Depersist the bits
        if (obj.musicVolume != undefined)
            smorball.audio.musicVolume = obj.musicVolume;
        if (obj.soundVolume != undefined)
            smorball.audio.soundVolume = obj.soundVolume;
        if (obj.difficulty != undefined)
            smorball.difficulty.current = smorball.difficulty.getDifficulty(obj.difficulty);
        if (obj.levels != undefined)
            smorball.user.levels = obj.levels;
        if (obj.cash != undefined)
            smorball.user.cash = obj.cash;
        if (obj.upgrades != undefined)
            smorball.upgrades.upgradesOwned = obj.upgrades;
        if (obj.bestSurvivalTime != undefined)
            smorball.user.bestSurvivalTime = obj.bestSurvivalTime;
        if (obj.lastLevelPlayed != undefined)
            smorball.user.lastLevelPlayed = obj.lastLevelPlayed;
        if (obj.lastSurvivalTime != undefined)
            smorball.user.lastSurvivalTime = obj.lastSurvivalTime;
        if (obj.hasSaveGame != undefined)
            smorball.user.hasSaveGame = obj.hasSaveGame;
    };
    return PersistanceManager;
})();
