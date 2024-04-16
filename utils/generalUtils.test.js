const generalUtils = require('./generalUtil');

test('Get a random number that is no bigger than length of array', () => {
    expect(generalUtils.getRandomElement([1, 2, 3, 4, 5])).toBeLessThanOrEqual(5);
});