//class AudioManager {
//	musicVolume: number = 1;
//	soundVolume: number = 1;
//	musicVolumeMultiplier = 0.6;
//	private music: HTMLAudioElement;
//	private soundsPlaying: createjs.AbstractSoundInstance[];
//	private audioTags: HTMLAudioElement[];
//	constructor() {
//		this.soundsPlaying = [];
//		this.audioTags = [];
//		//createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]);
//		//createjs.Sound.initializeDefaultPlugins();
//		//createjs.Sound.alternateExtensions = ["mp3"];
//		////createjs.Sound.defaultInterruptBehavior = createjs.Sound.INTERRUPT_NONE;
//		//smorball.resources.fgQueue.installPlugin(<any>createjs.Sound);
//		console.log("AUDIO CAPABILITIES: ", createjs.Sound.getCapabilities());		
//	}
//	init() {
//		var manifest = <{ src: string; id: string }[]>smorball.resources.getResource("audio_manifest");
//		_.each(manifest, item => this.loadAudioTag(item.src, item.id));
//	}
//	loadAudioTag(src: string, id: string) {
//		var tag = document.createElement("audio");
//		tag.tagName = tag.id = id;
//		tag.oncanplay = () => console.log("Audio tag loaded: ", id);
//		tag.preload = "auto";
//		tag.src = src;
//		tag.load();
//		this.audioTags.push(tag);
//	}
//	//private onSoundLoaded(id: string) {
//	//	if (id == "main_theme_sound" && smorball.screens.current != null && smorball.screens.current != smorball.screens.game)
//	//		this.playMusic();
//	//}
//	setMusicVolume(volume: number) {
//		this.musicVolume = volume;
//		if (this.music) this.music.volume = volume * this.musicVolumeMultiplier;
//		smorball.persistance.persist();
//	}
//	setSoundVolume(volume: number) {
//		var change = volume - this.soundVolume;
//		_.each(this.soundsPlaying, s=> s.volume += change);
//		this.soundVolume = volume;
//		smorball.persistance.persist();
//	}
//	playMusic() {
//		if (this.music != null) return;
//		this.music = this.getTag("main_theme_sound");
//		this.music.volume = this.musicVolume * this.musicVolumeMultiplier;
//		this.music.loop = true;
//		this.music.play();
//	}
//	getTag(id: string): HTMLAudioElement {
//		return _.find(this.audioTags, t => t.id == id);
//	}
//	playSound(id: string, volumeMultipler: number = 1): HTMLAudioElement {
//		var tag = this.getTag(id);
//		tag.volume = this.soundVolume * volumeMultipler;
//		tag.play();
//		return tag;
//		//var sound = createjs.Sound.play(id);
//		//sound.volume = this.soundVolume * volumeMultipler;
//		//this.soundsPlaying.push(sound);
//		//return sound;
//	}
//	playAudioSprite(id: string, options: any, volumeMultipler: number = 1): HTMLAudioElement {
//		var sound = createjs.Sound.play(id, options);
//		sound.volume = this.soundVolume * volumeMultipler;
//		this.soundsPlaying.push(sound);
//		return sound;
//	}
//	stopMusic() {
//		if (this.music == null) return;
//		this.fadeOutAndStop(this.music, 1000);
//		this.music = null;
//	}
//	fadeOutAndStop(sound: HTMLAudioElement, duration: number) {
//		createjs.Tween.get(sound).to({ volume: 0 }, duration).call(() => { sound.pause(); })
//	}
//	update(delta: number) {
//		for (var i = 0; i < this.soundsPlaying.length; i++) {
//			var s = this.soundsPlaying[i];
//			if (s.playState == "playFinished") {
//				this.soundsPlaying.splice(i, 1);
//				i--;
//			}				
//		}
//	}
//} 
