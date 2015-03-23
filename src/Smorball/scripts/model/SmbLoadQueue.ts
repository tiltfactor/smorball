/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />

class SmbLoadQueue {


	config: any;

	events: any;
	fg_loader: createjs.LoadQueue;
	bg_loader: createjs.LoadQueue;
	active: boolean;
	captchaLoad: boolean;
	localCapthcaSize: number;
	loaderClass: LoaderClass;

	constructor(config: any) {
		this.config = config;
		this.initialize();
	}

	initialize() {
		this.events = {};
		this.fg_loader = new createjs.LoadQueue(true, "", false);
		this.bg_loader = new createjs.LoadQueue(false, "", false);
		this.active = false;
		this.captchaLoad = false;
		this.localCapthcaSize = 8;
		var me = this;
		setTimeout(() => { this.loadLocalImages() }, 10000);
	}

	private updateLoader(e) {
		this.loaderClass.updateLoader(e.progress);
		this.config.stage.update();
	}

	private addEventsonLoad(manifest, callback?, ob?) {
		this.events.loaderEvent = (e) => { this.updateLoader(e) };
		this.fg_loader.addEventListener("progress", this.events.loaderEvent);
		this.fg_loader.loadManifest(manifest);
		this.events.click = () => { this.loadComplete(callback, ob); }
		this.fg_loader.addEventListener("complete", this.events.click);
		this.events.error = (e) => { console.log(e) };
		this.fg_loader.addEventListener("error", this.events.error);
	}

	loadLevelQueue(manifest, level) {
		$("#loaderDiv").show();
		this.active = true;
		var config = { "stage": this.config.stage, "gameState": this.config.gameState, "currentLevel": level, "loader": this.fg_loader, "type": 1 };
		this.loaderClass = new LoaderClass(config);
		this.config.stage.addChild(this.loaderClass);
		if (manifest.length != 0) {
			this.addEventsonLoad(manifest);
		} else {
			this.loadComplete();
		}


	}

	initialLoad(manifest, callback : (ob?) => void, ob?) {
		var me = this;
		$("#loaderDiv").show();
		var text = new createjs.Text("LOADING...", "Bold 60px Boogaloo", "#ffffff");
		text.setTransform(800, 600);
		this.config.stage.addChild(text);
		this.fg_loader.loadManifest(manifest);
		this.fg_loader.addEventListener("complete", () => {
			//
			this.config.stage.removeAllChildren();
			this.fg_loader.removeAllEventListeners();
			callback(ob);
		});
	}

	loadQueue(manifest, callback: (ob?) => void, ob?, level?) {
		$("#loaderDiv").show();
		if (manifest.length != 0) {
			var me = this;
			this.active = true;
			var config = { "stage": this.config.stage, "gameState": this.config.gameState, "currentLevel": level, "loader": this.fg_loader, "type": 0 };
			this.loaderClass = new LoaderClass(config);
			this.config.stage.addChild(this.loaderClass);
			this.addEventsonLoad(manifest, callback, ob);
		} else {
			callback(ob);
		}

	}

	getbgloader() {
		return this.bg_loader;
	}

	getfgloader() {
		return this.fg_loader;
	}

	getResult(imgID) {
		var url = this.fg_loader.getResult(imgID);
		if (!url) {
			url = this.bg_loader.getResult(imgID);
		}
		return url;
	}

	load(manifest, callback, ob) {
		if (manifest.length != 0) {
			var me = this;
			this.events.loadComplete = () => {
				this.active = false;
				this.bg_loader.removeEventListener("complete", this.events.loadComplete);
				callback(ob);
			};
			this.bg_loader.addEventListener("complete", this.events.loadComplete);
			this.bg_loader.loadManifest(manifest);
		} else {
			callback(ob);
		}

	}

	private loadComplete(callback?, ob?) {
		this.active = false;
		this.fg_loader.removeEventListener("complete", this.events.click);
		this.fg_loader.removeEventListener("progress", this.events.loaderEvent);
		if (callback) {
			this.config.stage.removeAllChildren();
			this.config.stage.update();
			$("#loaderDiv").hide();
			callback(ob);
		} else {
			this.loaderClass.drawPlayButton();
			this.config.stage.update();
		}

	}

	private loadLocalImages() {
		var manifest = [];
		if (this.localCapthcaSize + 10 <= localData.differences.length) {

			if (!this.active && !this.captchaLoad) {
				this.captchaLoad = true;
				for (var i = this.localCapthcaSize; i <= this.localCapthcaSize + 10; i++) {
					var img : any = {};
					var name = this.zeroFill(i, 3);
					img.src = "shapes/captcha/" + name + ".png";
					img.id = name;
					manifest.push(img);
				}
				this.localCapthcaSize += 10;
				this.fg_loader.loadManifest(manifest);
				this.fg_loader.addEventListener("complete", () => {
					this.captchaLoad = false;
				});
			}


			setTimeout(() => { this.loadLocalImages() }, 10000);
		}
	}

	// creates number in format 000
	private zeroFill(number, width) {
		width -= number.toString().length;
		if (width > 0)
		{ return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number; }

		return number + "";
	}

}

