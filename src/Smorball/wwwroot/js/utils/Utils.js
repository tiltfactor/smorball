var Utils = (function () {
    function Utils() {
    }
    Utils.deparam = function (qs) {
        // remove any preceding url and split
        var parts = qs.substring(qs.indexOf('?') + 1).split('&');
        var params = {}, pair, d = decodeURIComponent, i;
        for (i = parts.length; i > 0;) {
            pair = parts[--i].split('=');
            params[d(pair[0])] = d(pair[1]);
        }
        return params;
    };
    Utils.format = function (format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    Utils.zeroPad = function (num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    };
    Utils.randomOne = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };
    return Utils;
})();
