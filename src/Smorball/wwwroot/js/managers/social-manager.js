var SocialManager = (function () {
    function SocialManager() {
    }
    SocialManager.prototype.init = function () {
        window.fbAsyncInit = function () {
            FB.init({
                appId: smorball.config.fbAppId,
                xfbml: true,
                version: 'v2.3'
            });
        };
        // Setup the facebook SDK
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };
    SocialManager.prototype.shareProgressToFB = function () {
        console.log("Sharing to FB: " + this.getShareText());
        FB.ui({
            method: 'feed',
            caption: this.getShareText(),
            //description: this.getShareText(),
            link: 'http://smorballgame.org',
        }, function (response) {
            console.log("FB Feed response", response);
        });
    };
    SocialManager.prototype.shareProgressToTwitter = function () {
        var width = 575;
        var height = 400;
        var left = Math.round((screen.width / 2) - (width / 2));
        var top = Math.round((screen.height / 2) - (height / 2));
        var url = "https://twitter.com/intent/tweet?" + $.param({ text: this.getShareText() });
        var opts = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
        window.open(url, "intent", opts);
    };
    SocialManager.prototype.getShareText = function () {
        // If the player has only just started then we cant do anything fancy
        if (smorball.user.lastLevelPlayed < 0)
            return "Play Smorball! http://smorballgame.org";
        else {
            var level = smorball.game.levels[smorball.user.lastLevelPlayed];
            var score = 600 - smorball.user.levels[smorball.user.lastLevelPlayed].score;
            if (level.timeTrial)
                return Utils.format("I just lasted {0}s in Smorball's Time Challenge! http://smorballgame.org", Math.round(smorball.user.lastSurvivalTime));
            else
                return Utils.format("I just defeated the {0}. I scored {1} against them! http://smorballgame.org", level.team.name, score);
        }
    };
    return SocialManager;
})();
