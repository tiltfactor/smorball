/// <reference path="../../scripts/managers/smorballmanager.ts" />
/// <reference path="../../scripts/managers/splashscreensmanager.ts" />
/// <reference path="../../scripts/managers/resourcesmanager.ts" />
/// <reference path="../tsd.d.ts" />
/// <reference path="../../scripts/main.ts" />
/// <reference path="../../scripts/config.ts" />
/// <reference path="../../scripts/managers/loadingscreenmanager.ts" />
/// <reference path="../../scripts/actors/backgroundstar.ts" />
/// <reference path="../../scripts/utils/utils.ts" />
/// <reference path="../../scripts/managers/mainmenumanager.ts" />

interface CapatchaDifference {
	texts: string[];
	captcha: any;
}

declare class closestWord {
    match: any;
    closestOcr: CapatchaDifference;
    constructor(intput: any, differences: CapatchaDifference[]);
}

interface JQuery {
    selectmenu(options: any);
    leanSlider(options: any);
	mCustomScrollbar(options: any);
}