/// <reference path="../../typings/smorball/smorball.d.ts" />



class Stadium extends createjs.Container {

	logo: createjs.Bitmap;

	init() {			

		this.addParts();
		this.addAudience();

		this.logo = new createjs.Bitmap(null);
		this.logo.alpha = 0.2;
		this.logo.x = smorball.config.width / 2 - 256;
		this.logo.y = smorball.config.height / 2 + 40;
		this.addChild(this.logo);
	}

	setTeam(team: Team) {
		this.logo.image = smorball.resources.getResource(team.id + "_logo"); 
	}

	private addParts() {

		var data = <StadiumData>smorball.resources.getResource("stadium_data");

		var scale = 1600 / 800;


		_.each(data.parts, part => {

			var obj: createjs.DisplayObject;

			if (part.type == "stadium_wall")
				obj = new createjs.Bitmap(smorball.resources.getResource("stadium_wall"));
			if (part.type == "stadium_grass")
				obj = new createjs.Bitmap(smorball.resources.getResource("stadium_grass"));
			else if (part.type == "seat") 
				obj = new createjs.Bitmap(smorball.resources.getResource("stadium_seat"));
			else if (part.type == "scoreboard")
				obj = new createjs.Bitmap(smorball.resources.getResource("stadium_scoreboard"));
			else if (part.type == "speaker")
				obj = new createjs.Bitmap(smorball.resources.getResource("stadium_speaker"));
			else if (part.type == "speaker_pole")
				obj = new createjs.Bitmap(smorball.resources.getResource("stadium_speaker_pole"));
			else if (part.type == "advertisement_board")
				obj = new createjs.Bitmap(smorball.resources.getResource("stadium_ad_board"));
			else if (part.type == "commentators")
				obj = new createjs.Bitmap(smorball.resources.getResource("stadium_commentators"));
			else if (part.type == "crowd_glass")
				obj = new createjs.Bitmap(smorball.resources.getResource("crowd_glass"));

			if (obj != null) {
				obj.x = part.x * scale;
				obj.y = part.y * scale;

				if (part.flipped == true)
					obj.scaleX = -1;

				this.addChild(obj);
			}

		});
	}

	private addAudience() {

		var seatImg = smorball.resources.getResource("stadium_seat");
		var audienceTypes = <AudienceMemberType[]>smorball.resources.getResource("audience_data");


		// Find all seats
		_.chain(this.children)
			.filter(obj => obj instanceof createjs.Bitmap && obj.image == seatImg)
			.each(seat => {

			// Lets put an audience member on that seat.
			var member = new AudienceMember(Utils.randomOne(audienceTypes));
			member.x = seat.x;
			member.y = seat.y;
			this.addChildAt(member, this.getChildIndex(seat) + 1);

		});

	}


}