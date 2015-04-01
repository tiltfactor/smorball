class AudioManager {

	musicVolume: number = 1;
	soundVolume: number = 1;

	setMusicVolume(volume: number) {
		this.musicVolume = volume;
		smorball.persistance.persist();
	}

	setSoundVolume(volume: number) {
		this.soundVolume = volume;
		smorball.persistance.persist();
	}
}