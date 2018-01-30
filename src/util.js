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
