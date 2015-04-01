/// <reference path="../../typings/smorball/smorball.d.ts" />



class InstructionsScreen extends ScreenBase
{
	backMenu: ScreenBase;
	background: StarBackground;

	selectedInstruction: number = -1;
	instructions: Instruction[];

	constructor() {
		super("instructionsScreen", "instructions_screen_html");
	}

	init() {
		super.init();	

		// Grab the data
		this.instructions = smorball.resources.getResource("instructions_data");

		// Create the anuimated star background
		this.background = new StarBackground();
		this.addChild(this.background);

		// Listen for some events
		$("#instructionsScreen .left-arrow").click(() => this.selectInstruction(this.selectedInstruction-1));
		$("#instructionsScreen .right-arrow").click(() => this.selectInstruction(this.selectedInstruction+1));
		$("#instructionsScreen .back").click(() => {
			smorball.screens.open(this.backMenu);
			this.dispatchEvent("back");
		});
		$("#instructionsScreen .paging img").click(e => {
			var indx = $("#instructionsScreen .paging img").index(<any>e.currentTarget);
			this.selectInstruction(indx);
		});

		// Set the first instruction
		this.selectInstruction(0);
	}

	update(delta: number) {
		// Update the stars
		this.background.update(delta);
	}	

	private selectInstruction(indx: number) {
		if (indx < 0) indx = this.instructions.length - 1;
		if (indx > this.instructions.length-1) indx = 0;

		this.selectedInstruction = indx;
		var instruction = this.instructions[this.selectedInstruction];

		// Update the image
		var img = <HTMLImageElement>$("#instructionsScreen .instruction-img").get(0);
		img.src = "images/Instructions/" + instruction.image + ".png";

		// Update the text
		$("#instructionsScreen .smorball-bordered-container span").get(0).innerText = instruction.description;

		// Update the paging elements
		$("#instructionsScreen .paging img").each((i, e: HTMLImageElement) => {
			if (i == this.selectedInstruction) e.src = "images/UI/paging_dot_full.png";
			else e.src = "images/UI/paging_dot_empty.png";
		});
	}
}