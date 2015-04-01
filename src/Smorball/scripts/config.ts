
class SmorballConfig {

	enemySpawnPositions = [
		{ x: 1650, y: 730 },
		{ x: 1650, y: 900 },
		{ x: 1650, y: 1080 },
	];

	friendlySpawnPositions = [
		{ x: 100, y: 730 },
		{ x: 100, y: 900 },
		{ x: 100, y: 1080 },
	];

	captchaPositions = [
		{ x: 250, y: 660 },
		{ x: 250, y: 830 },
		{ x: 250, y: 1010 },
	];

	width = 1600;
	height = 1200;

	goalLine = 345;

	penaltyTime = 3;

	enemyTouchdowns = 6;

	passes = 2;

	debug: boolean;

	constructor() {
		this.debug = location.hostname == "localhost";
	}


}