class WavesBuilder {

	waves: LevelWave[];

	waveTemplate = '<li><label>Wave {0}:</label> - <a class="wave-delete-btn" data-wave-id="{1}">delete</a><ul>{2}</ul></li>';
	actionTemplate = '<li>{0} - <a data-wave-id="{1}" data-action-id="{2}" class="action-delete-btn">delete</a></li>';

	constructor() {

		this.waves = [];

		this.updateOutput();

		$("#addBtn").click(() => this.addAction());
		$("#newWaveBtn").click(() => this.addWave());
		$("#type").change(() => this.onTypeChange());

		this.onTypeChange();
	}

	onTypeChange() {
		var type = $("#type").val();
		_.each(["time", "lane", "sameLane", "powerup", "enemy", "commentry", "noSkip", "quantity"], s => {
			$("#" + s).parent().hide();
		});

		if (type == "delay") {
			_.each(["time", "noSkip"], s => $("#" + s).parent().show());
		}
		else if (type == "spawn") {
			_.each(["lane", "powerup", "enemy", "sameLane", "quantity"], s => $("#" + s).parent().show());
		}
		else if (type == "commentate") {
			_.each(["commentry"], s => $("#" + s).parent().show());
		}
	}

	addAction() {
		if (this.waves.length == 0) this.waves.push({ actions: [] });
		var wave = this.waves[this.waves.length - 1];

		var type = $("#type").val();

		var action: WaveAction = { type: type };

		if (type == "delay") {
			if ($("#time").val() != '') action.time = parseFloat($("#time").val());
			if ($("#noSkip").is(':checked')) action.noSkip = true;
		}
		else if (type == "spawn") {
			if ($("#lane").val() != '') action.lane = parseInt($("#lane").val());
			if ($("#quantity").val() != '') action.quantity = parseInt($("#lane").val());
			if ($("#sameLane").is(':checked')) action.sameLane = true;
			if ($("#powerup").val() != '') action.powerup = $("#powerup").val();
			if ($("#enemy").val() != '') action.enemy = $("#enemy").val();
		}
		else if (type == "commentate") {
			if ($("#commentry").val() != '') action.commentry = $("#commentry").val();
		}

		wave.actions.push(action);
		this.updateOutput();
	}

	addWave() {
		this.waves.push({ actions: [] });
		this.updateOutput();
	}

	updateOutput() {
		$("#output").text(JSON.stringify(this.waves, null, 4));

		$("#wavesLst").empty();

		_.each(this.waves, w => {

			var actionsStr = "";

			_.each(w.actions, a => {
				actionsStr += Utils.format(this.actionTemplate, JSON.stringify(a), this.waves.indexOf(w), w.actions.indexOf(a));
			})

			var waveStr = Utils.format(this.waveTemplate, this.waves.indexOf(w), this.waves.indexOf(w), actionsStr);
			$("#wavesLst").append(waveStr);
		});

		$(".action-delete-btn").click(e => this.deleteAction(e));
		$(".wave-delete-btn").click(e => this.deleteWave(e));
	}

	deleteAction(e: JQueryEventObject) {
		var el = <HTMLElement>e.target;
		var actionId = parseInt(el.dataset["actionId"]);
		var waveId = parseInt(el.dataset["waveId"]);

		var wave = this.waves[this.waves.length - 1];
		wave.actions.splice(actionId, 1);

		this.updateOutput();

	}

	deleteWave(e: JQueryEventObject) {
		var el = <HTMLElement>e.target;
		var waveId = parseInt(el.dataset["waveId"]);
		this.waves.splice(waveId, 1);
		this.updateOutput();
	}
}

$(() => new WavesBuilder());
