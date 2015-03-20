// Borrowed from: http://stackoverflow.com/questions/18405736/is-there-a-c-sharp-string-format-equivalent-in-javascript

interface StringConstructor {
    format(format: string): void;
}

String.format = function (format: string) {
	var args = Array.prototype.slice.call(arguments, 1);
	return format.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != 'undefined'
			? args[number]
			: match
			;
	});
};