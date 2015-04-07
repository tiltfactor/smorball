/// <reference path="../../typings/smorball/smorball.d.ts" />

interface ManifestEntry {
	src: string;
	id: string;
}

interface Manifest {
	manifest: ManifestEntry[];
}

class ResourcesManager
{
	queue: createjs.LoadQueue;

	constructor() {
		this.queue = new createjs.LoadQueue();		
	}

	loadInitialResources(completeCallback: () => void) {
		this.loadManifest("data/initial manifest.json", completeCallback);
	}

	loadMainGameResources(completeCallback: () => void) {
		this.loadManifest("data/main game resources manifest.json", completeCallback);
	}

	loadCaptchas() {

	}

	loadLevelResources(levelIndx: number) {

		var level = smorball.game.levels[levelIndx];

		// We need to dynamically construct the manifest to load here
		var entries: ManifestEntry[] = []

		// Add the required enemy variation
		_.each(smorball.game.enemyTypes, enemy => {
			var path = Utils.format(enemy.spritesPathTemplate, Utils.zeroPad(level.team.outfit, 2));
			entries.push({ src: path + ".json", id: enemy.id + "_" + Utils.zeroPad(levelIndx, 2) + "_json" } );
			entries.push({ src: path + ".png", id: enemy.id + "_" + Utils.zeroPad(levelIndx, 2) + "_png" });
		});

		this.queue.loadManifest({ manifest: entries }, true);
	}

	loadManifest(manifest: string, completeCallback: () => void) {
		this.queue.on("complete", completeCallback, this, true);
		this.queue.loadManifest(manifest, true);
	}

	getResource(resourceId: string) : any {
		return this.queue.getResult(resourceId);
	}

	load(url: string, id: string, callback?: (resource: any) => void) {
		this.queue.loadFile({ src: url, id: id }, true);
		this.queue.on("complete",() => {
			if (callback != null)
				callback(this.getResource(id));
		}, this, true);
	}

}
