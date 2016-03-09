export function createDate (y, m, d, h, M, s, ms) {
    //can't just apply() to create a date:
    //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
    var date = new Date(y, m, d, h, M, s, ms);

    //the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

export function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    //the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

export function getTimestampFromLocalParts(y, m, d, h, mi, s, ms) {
    // TODO: implement directly - will need to handle time zone, ambiguous and invalid, etc.
    return createDate(y, m, d, h, mi, s, ms).valueOf();
}

export function getTimestampFromUTCParts(y, m, d, h, mi, s, ms) {
    return parts2ts(y, m, d, h, mi, s, ms);
}

var d365 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
var d366 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];

function parts2ts(year, month, day, hour, minute, second, millisecond) {
    if (month < 0 || month > 11) {
        return NaN;
    }

    var leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    var days = leap ? d366 : d365;
    if (day < 1 || day > days[month + 1] - days[month]) {
        return NaN;
    }

    var y = year - 1;
    var daysSinceEpoch = y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + days[month] + day - 719163;

    return (daysSinceEpoch * 8640 * 10000) + (hour * 3600 * 1000) + (minute * 60000) + (second * 1000) + millisecond;
}
