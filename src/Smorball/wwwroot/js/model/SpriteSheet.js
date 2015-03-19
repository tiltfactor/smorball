/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpriteSheet = (function (_super) {
    __extends(SpriteSheet, _super);
    function SpriteSheet(config) {
        this.config = config;
        this.data = JSON.parse(JSON.stringify(this.config.data));
        this.setImages();
        _super.call(this, this.data);
    }
    SpriteSheet.prototype.setImages = function () {
        for (var i = 0; i < this.data.images.length; i++) {
            this.data.images[i] = this.config.loader.getResult(this.data.images[i]);
        }
    };
    return SpriteSheet;
})(createjs.SpriteSheet);
