class SocialManager {


	init() {

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
			if (d.getElementById(id)) { return; }
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		} (document, 'script', 'facebook-jssdk'));

	}

	shareProgressToFB() {
		FB.ui({
			method: 'share',
			href: 'https://developers.facebook.com/docs/',
		}, (response) => { });
	}

	shareProgressToTwitter() {
				
		var width = 575;
		var height = 400;
		var left = Math.round((screen.width / 2) - (width / 2));
		var top = Math.round((screen.height / 2) - (height / 2));
		var url = "https://twitter.com/intent/tweet?" + $.param({ text: this.getShareText() });
		var opts = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes' +
				',width=' + width +
				',height=' + height +
				',top=' + top +
				',left=' + left;

		window.open(url, "intent", opts);
	}

	getShareText() {

		// If the player has only just started then we cant do anything fancy
		if (smorball.user.lastLevelPlayed < 0)
			return "Checkout this great game! http://smorball.com";
		else {

			var level = smorball.game.levels[smorball.user.lastLevelPlayed];
			var score = smorball.user.levels[smorball.user.lastLevelPlayed].score;

			if (level.timeTrial)
				return Utils.format("I just lasted {0}s in Smorball's infinite mode. http://smorball.com", Math.round(smorball.user.lastSurvivalTime));
			else
				return Utils.format("I just defeated the {0}. They scored {1} against me! http://smorball.com", level.team.name, score);
		}
	}

	
}