/**
 * Get a random int between min (inclusive) and max (exclusive).
 *
 * @param min
 * @param max
 * @returns int
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Round a float with to given precision
 *
 * @param number
 * @param precision
 * @returns {number}
 */
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}
