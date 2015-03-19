/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AdBoard = (function (_super) {
    __extends(AdBoard, _super);
    function AdBoard(config) {
        _super.call(this);
        this.config = config;
        this.boards = [];
        this.drawAdBoards();
    }
    AdBoard.prototype.drawAdBoards = function () {
        var x = 0, y = 0;
        for (var i = 0; i < 3; i++) {
            var ad = new createjs.Bitmap(this.config.loader.getResult("ad"));
            ad.setTransform(x, y, 1, 1);
            x = x + ad.getTransformedBounds().width;
            this.boards.push(ad);
            this.addChild(ad);
        }
    };
    return AdBoard;
})(createjs.Container);
