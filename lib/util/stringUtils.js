/**
 * Created by dd on 11/24/14.
 */

isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

strToId = function(raw) {
    return raw.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-");
};

/**
 * Set a value within a object tree
 * @param object
 * @param path
 * @param value
 */
setValuePath = function(object, path, value) {
    var a = path.split('.');
    var o = object;
    for (var i = 0; i < a.length - 1; i++) {
        var n = a[i];
        if (n in o) {
            o = o[n];
        } else {
            o[n] = {};
            o = o[n];
        }
    }
    o[a[a.length - 1]] = value;
};

/**
 * Geta  value from within an object's tree
 * @param object
 * @param path
 * @returns {*}
 */
getValuePath = function(object, path) {
    var o = object; // o is undefined here, pls fix
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    var a = path.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
            return;
        }
    }
    return o;
};

yyyymmdd = function(date) {
    if (!date) return;
      date = Date.parse(date);
    if (! date instanceof Date) {
        date = new Date(date);
    }
    if (! date instanceof Date) {
        return;
    }
    var date = new  moment(date);
   // var yyyy = date.getFullYear().toString();
   // var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
    //var dd  = date.getDate().toString();
    return date.format("YYYYMMDD HH:mm");
    return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

yyyy_mm_dd = function(date) {
    if (!date) return;
    date = Date.parse(date);
    if (! date instanceof Date) {
        date = new Date(date);
    }
    if (! date instanceof Date) {
        return;
    }
    var date = new  moment(date);
    return date.format("YYYY-MM-DD HH:mm");
    var yyyy = date.getFullYeargetFullYear().toString();
    var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();
    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};



guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};
