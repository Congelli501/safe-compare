/**
 * @author Michael Raith
 * @date   24.02.2016 12:04
 */

'use strict';

var crypto = require('crypto');

/**
 * Do a constant time string comparison. Always compare the complete strings against each other to get a constant time.
 * This method does not short-cut if the two string's length differs.
 *
 * @param {string} a
 * @param {string} b
 */
var safeCompare = function safeCompare(a, b) {
    var strA = String(a);
    var strB = String(b);
    var lenA = strA.length;
    var result = 0;

    if (lenA !== strB.length) {
        strB = strA;
        result = 1;
    }

    for (var i = 0; i < lenA; i++) {
        result |= (strA.charCodeAt(i) ^ strB.charCodeAt(i));
    }

    return result === 0;
};

// Node.JS v7 now implements a timing safe compare method. Return that if the user is running the latest Node.js version.
module.exports = (crypto.timingSafeEqual !== 'undefined' ? crypto.timingSafeEqual : safeCompare);
module.exports = function (a, b) {
    if (crypto.timingSafeEqual !== 'undefined') {
        var strA = String(a);
        var strB = String(b);
        
        var key = crypto.pseudoRandomBytes(32);
        var bufA = crypto.createHmac('sha256', key).update(strA).digest();
        var bufB = crypto.createHmac('sha256', key).update(strB).digest();
        
        return crypto.timingSafeEqual.call(crypto.timingSafeEqual, bufA, bufB);
    } else {
        return safeCompare;
    }
};
