/// <reference path="../../typings/smorball/smorball.d.ts" />


class MainMenuManager extends createjs.Container
{
	menu: createjs.DOMElement;

	init() {
		this.menu = new createjs.DOMElement(document.getElementById("mainMenu"));
		this.addChild(this.menu);
	}

}