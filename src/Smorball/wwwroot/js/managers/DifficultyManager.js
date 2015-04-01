var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["Easy"] = 0] = "Easy";
    Difficulty[Difficulty["Medium"] = 1] = "Medium";
    Difficulty[Difficulty["Hard"] = 2] = "Hard";
})(Difficulty || (Difficulty = {}));
var DifficultyManager = (function () {
    function DifficultyManager() {
        this.difficulty = 0 /* Easy */;
    }
    DifficultyManager.prototype.setDifficulty = function (difficulty, persist) {
        if (persist === void 0) { persist = true; }
        console.log("Difficulty set to", Difficulty[difficulty]);
        this.difficulty = difficulty;
        if (persist)
            smorball.persistance.persist();
    };
    return DifficultyManager;
})();
