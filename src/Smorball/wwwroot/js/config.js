var SmorballConfig = (function () {
    function SmorballConfig() {
        this.enemySpawnPositions = [
            { x: 1750, y: 740 },
            { x: 1750, y: 910 },
            { x: 1750, y: 1090 },
        ];
        this.friendlySpawnPositions = [
            { x: 100, y: 740 },
            { x: 100, y: 910 },
            { x: 100, y: 1090 },
        ];
        this.captchaPositions = [
            { x: 300, y: 700 },
            { x: 300, y: 870 },
            { x: 300, y: 1050 },
        ];
        this.width = 1600;
        this.height = 1200;
    }
    return SmorballConfig;
})();
