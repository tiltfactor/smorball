﻿class AudioManager {

	musicVolume: number = 1;
	soundVolume: number = 1;

	musicVolumeMultiplier = 0.6;

	private music: createjs.AbstractSoundInstance;
    private soundsPlaying: createjs.AbstractSoundInstance[];
    private capsOutputted: boolean;

	constructor() {
        this.soundsPlaying = [];
        this.capsOutputted = false;
		//createjs.Sound.initializeDefaultPlugins();
		//createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]);
		//createjs.Sound.alternateExtensions = ["mp3"];
		createjs.Sound.defaultInterruptBehavior = createjs.Sound.INTERRUPT_NONE;
		//smorball.resources.fgQueue.installPlugin(<any>createjs.Sound);
        this.outputCaps();
    }

    private outputCaps() {
        if (this.capsOutputted) return;
        if (createjs.Sound.getCapabilities() == null) return;        
        this.capsOutputted = true;
        console.log("AUDIO CAPABILITIES: ", createjs.Sound.getCapabilities());
        console.log("Active Plugin", createjs.Sound.activePlugin);
    }

    init() {        
		createjs.Sound.on("fileload",(e: any) => this.onSoundLoaded(e.id));
		var manifest = smorball.resources.getResource("audio_manifest");
        createjs.Sound.registerSounds(manifest);
        this.outputCaps();
	}

    private onSoundLoaded(id: string) {
        
        if (id == "main_theme_sound" && smorball.screens.current != null && smorball.screens.current != smorball.screens.game) {
            this.playMusic();
            this.outputCaps();
        }
	}

	setMusicVolume(volume: number) {
		this.musicVolume = volume;
		if (this.music) this.music.volume = volume * this.musicVolumeMultiplier;
		smorball.persistance.persist();
	}

	setSoundVolume(volume: number) {
		var change = volume - this.soundVolume;
		_.each(this.soundsPlaying, s=> s.volume += change);
		this.soundVolume = volume;
		smorball.persistance.persist();
	}

	playMusic() {
		if (this.music != null) return;
		this.music = createjs.Sound.play("main_theme_sound");		
		this.music.loop = -1;
		this.music.volume = this.musicVolume * this.musicVolumeMultiplier;
        this.outputCaps();
		if (this.music.playState == "playFailed")
			this.music = null;
	}

	playSound(id: string, volumeMultipler: number = 1): createjs.AbstractSoundInstance {
		var sound = createjs.Sound.play(id);
        sound.volume = this.soundVolume * volumeMultipler;
        this.soundsPlaying.push(sound);

        console.log("sounds: ", this.soundsPlaying.length);

		return sound;
	}

	playAudioSprite(id: string, options: any, volumeMultipler: number = 1): createjs.AbstractSoundInstance {
		var sound = createjs.Sound.play(id, options);
		sound.volume = this.soundVolume * volumeMultipler;
		this.soundsPlaying.push(sound);
		return sound;
	}

	stopMusic() {
		if (this.music == null) return;
		this.fadeOutAndStop(this.music, 1000);
		this.music = null;
	}

	fadeOutAndStop(sound: createjs.AbstractSoundInstance, duration:number) {
		createjs.Tween.get(sound).to({ volume: 0 }, duration).call(() => { sound.stop(); })
	}

	update(delta: number) {
		for (var i = 0; i < this.soundsPlaying.length; i++) {
			var s = this.soundsPlaying[i];
            if (s.playState == "playFinished") {
                s.destroy();
				this.soundsPlaying.splice(i, 1);
				i--;
			}				
		}
	}
}