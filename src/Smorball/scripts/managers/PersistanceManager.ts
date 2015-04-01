interface SmorballPersistanceData {
	musicVolume?: number;
	soundVolume?: number;
	difficulty?: Difficulty;
	levels?: LevelPersistanceData[];
	cash?: number;
	upgrades?: boolean[]
}

class PersistanceManager {

	persist() {
		var obj = <SmorballPersistanceData>{
			musicVolume: smorball.audio.musicVolume,
			soundVolume: smorball.audio.soundVolume,
			difficulty: smorball.difficulty.difficulty,
			levels: smorball.user.levels,
			cash: smorball.user.cash,
			upgrades: smorball.upgrades.upgradesOwned
		};

		localStorage.setItem("smorball", JSON.stringify(obj));
	}

	depersist() {

		// Grab the persisted data, if there is none then dont go any further
		var s = localStorage.getItem("smorball");
		if (s == undefined) return;

		// Convert it to our data object
		var obj = <SmorballPersistanceData>JSON.parse(s);

		// Depersist the bits
		if (obj.musicVolume != undefined) smorball.audio.musicVolume = obj.musicVolume;
		if (obj.soundVolume != undefined) smorball.audio.soundVolume = obj.soundVolume;
		if (obj.difficulty != undefined) smorball.difficulty.difficulty = obj.difficulty;
		if (obj.levels != undefined) smorball.user.levels = obj.levels;
		if (obj.cash != undefined) smorball.user.cash = obj.cash;
		if (obj.upgrades != undefined) smorball.upgrades.upgradesOwned = obj.upgrades;
	}


}