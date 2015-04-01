var SmorballConfig = (function () {
    function SmorballConfig() {
        this.enemySpawnPositions = [
            { x: 1650, y: 730 },
            { x: 1650, y: 900 },
            { x: 1650, y: 1080 },
        ];
        this.friendlySpawnPositions = [
            { x: 100, y: 730 },
            { x: 100, y: 900 },
            { x: 100, y: 1080 },
        ];
        this.captchaPositions = [
            { x: 250, y: 660 },
            { x: 250, y: 830 },
            { x: 250, y: 1010 },
        ];
        this.width = 1600;
        this.height = 1200;
        this.goalLine = 345;
        this.penaltyTime = 3;
        this.enemyTouchdowns = 6;
        this.passes = 2;
        this.debug = location.hostname == "localhost";
    }
    return SmorballConfig;
})();
