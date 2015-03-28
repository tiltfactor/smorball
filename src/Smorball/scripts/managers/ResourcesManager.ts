/// <reference path="../../typings/smorball/smorball.d.ts" />

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

	loadManifest(manifest: string, completeCallback: () => void) {
		this.queue.on("complete", completeCallback, this, true);
		this.queue.loadManifest(manifest, true);
	}

	getResource(resourceId: string) : any {
		return this.queue.getResult(resourceId);
	}

}
