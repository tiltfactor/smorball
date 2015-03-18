declare var EventBus: any;

declare class LocalStorage { 
    constructor(config?:any);
    getFromStore(): any;
    saveToStore(obj: any);
}

declare class GameState {
    constructor(config?: any);
}

declare class SmbLoadQueue {
    constructor(config?: any);
}

declare class StageController {
    constructor(config?: any);
}

declare class ShopController {
    constructor(config?: any);
}

declare class GameLevelController {
    constructor(config?: any);
}

declare class MyBag {
    constructor(config?: any);
    persist();
}

declare class closestWord {
    match: any;
    closestOcr: any;
    constructor(a: any, b: any);
}

interface JQuery {
    selectmenu(options: any);
    leanSlider(options: any);
}