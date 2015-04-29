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
	fgQueue: createjs.LoadQueue;
	bgQueue: createjs.LoadQueue;

	constructor() {
		this.fgQueue = new createjs.LoadQueue(true, "", true);		// true, "", true
		this.fgQueue.setMaxConnections(10);
		this.bgQueue = new createjs.LoadQueue(false, "", false);		
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

		this.fgQueue.loadManifest({ manifest: entries }, true);
	}

	loadManifest(manifest: string, completeCallback: () => void) {
		this.fgQueue.on("complete", completeCallback, this, true);
		this.fgQueue.loadManifest(manifest, true);
	}

	getResource(resourceId: string) : any {
		return this.fgQueue.getResult(resourceId);
	}

	load(item: createjs.LoadItem, forground: boolean, callback?: (resource: any) => void) {
		var queue = forground ? this.fgQueue : this.bgQueue;
		queue.loadFile(item, true);
		queue.on("complete",(data) => {
			if (callback != null)
				callback(queue.getItem(item.id));
		}, this, true);
	}

}
