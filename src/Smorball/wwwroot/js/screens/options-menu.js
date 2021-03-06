/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OptionsMenu = (function (_super) {
    __extends(OptionsMenu, _super);
    function OptionsMenu() {
        _super.call(this, "optionsMenu", "options_menu_html");
    }
    OptionsMenu.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        // Create the animated star background
        this.background = new StarBackground();
        this.addChild(this.background);
        // Listen for a few things
        $("#optionsMenu button.back").click(function () { return _this.onBackClicked(); });
        // Setup the music slider and listen for changes to it
        this.musicSlider = new RangeSlider("#musicSlider", smorball.audio.musicVolume, function (value) { return smorball.audio.setMusicVolume(value); });
        this.soundSlider = new RangeSlider("#soundSlider", smorball.audio.soundVolume, function (value) { return smorball.audio.setSoundVolume(value); });
        // Set the persisted difficulty
        $("#difficultyDropdown button").text(smorball.difficulty.current.name.toUpperCase());
        // Populate the difficulties
        var dropdown = $("#difficultyDropdown .dropdown-menu").empty();
        _.each(smorball.config.difficulties, function (d) {
            dropdown.append('<li role="presentation"><a role="menuitem" tabindex="- 1">' + d.name + '</a></li>');
        });
        // Listen for clicks on the difficulty dropdown
        $("#difficultyDropdown a").click(function (e) { return _this.onDifficultyOptionClicked(e.currentTarget); });
    };
    OptionsMenu.prototype.show = function () {
        _super.prototype.show.call(this);
        this.musicSlider.value = smorball.audio.musicVolume;
        this.soundSlider.value = smorball.audio.soundVolume;
        $("#difficultyDropdown button").text(smorball.difficulty.current.name.toUpperCase());
    };
    OptionsMenu.prototype.onDifficultyOptionClicked = function (element) {
        var difficulty = smorball.difficulty.getDifficulty(element.textContent);
        smorball.difficulty.setDifficulty(difficulty);
        $("#difficultyDropdown button").text(difficulty.name.toUpperCase());
    };
    OptionsMenu.prototype.update = function (delta) {
        this.background.update(delta);
    };
    OptionsMenu.prototype.onBackClicked = function () {
        smorball.screens.open(smorball.screens.main);
    };
    return OptionsMenu;
})(ScreenBase);
