/// <reference path="../../typings/smorball/smorball.d.ts" />

class MapDot extends createjs.Bitmap {

	constructor(pos: MapPoint) {
		super(smorball.resources.getResource("map_dot"));
		this.x = pos.x;
		this.y = pos.y;
	}
	
}

