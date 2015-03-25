class Utils {

	static deparam(qs: string): any {

		// remove any preceding url and split
		var parts = qs.substring(qs.indexOf('?') + 1).split('&');
		var params = {}, pair, d = decodeURIComponent, i;

		// march and parse
		for (i = parts.length; i > 0;) {
			pair = parts[--i].split('=');
			params[d(pair[0])] = d(pair[1]);
		}

		return params;
	}

	static format(format: string, ...args: any[]): string {		
		return format.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match
				;
		});
	}

	static zeroPad(num: number, places: number) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}

	static randomOne<T>(array: T[]) : T
	{
		return array[Math.floor(Math.random() * array.length)];
	}

}