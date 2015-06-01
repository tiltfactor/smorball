class RangeSlider  {

	dragging: boolean;
	range: JQuery;
	handle: JQuery;
	beforeBar: JQuery;
	afterBar: JQuery;
	onValueChanged: (value: number) => void;

	downOffset: number;
	private _value: number;

	constructor(selector : string, value:number, onValueChanged: (value:number) => void) {

		this.dragging = false;

		this.range = $(selector);
		this.handle = this.range.find(".handle");
		this.beforeBar = this.range.find(".before-bar");
		this.afterBar = this.range.find(".after-bar");

		this.handle.mousedown(event => {
			this.dragging = true;
			this.downOffset = event.offsetX;
			return false;
		});


		$(document).mouseup(event => { this.dragging = false; return true; } );

		$(document).mousemove(event => this.onMouseMove(event));

		this.value = value;		
		this.onValueChanged = onValueChanged;
	}

	private onMouseMove(event: JQueryMouseEventObject) {
		if (!this.dragging) return;

		this.range.position();

		var rangeOffset = this.range.offset();
		var rangeWidth = this.range.width();

		var left = (event.pageX - rangeOffset.left) / smorball.stage.scaleX;
		if (left < 0) left = 0;
		if (left > rangeWidth) left = rangeWidth;

		this.value = left / rangeWidth;

		return true;
	}

	get value(): number {
		return this._value;
	}

	set value(v: number) {
		this._value = v;
		this.updateBar();
		if (this.onValueChanged != null)
			this.onValueChanged(v);
	}

	updateBar() {
		this.range.position();

		var rangeWidth = this.range.width();

		var left = ((rangeWidth * this.value) - this.handle.width() / 2);

		this.afterBar.get(0).style.left = (left + 10) + "px"
		this.afterBar.get(0).style.width = (rangeWidth - left - 10) + "px";
		this.handle.get(0).style.left = left + "px";
		this.handle.get(0).style.top = (-this.handle.height() / 2) + "px";
	}
}