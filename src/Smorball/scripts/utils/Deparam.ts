function deparam(qs: string): any {

    // remove any preceding url and split
    var parts = qs.substring(qs.indexOf('?') + 1).split('&');
    var params = {}, pair, d = decodeURIComponent, i;

    // march and parse
    for (i = parts.length; i > 0;) {
        pair = parts[--i].split('=');
        params[d(pair[0])] = d(pair[1]);
    }

    return params;
};