const { shuffleArray } = require('./discoverUtils');

// Test shuffleArray function
const testArray = [1, 2, 3, 4, 5];

describe('shuffleArray', () => {
  it('returns an array of the same length', () => {
    const shuffledArray = shuffleArray(testArray);
    expect(shuffledArray.length).toBe(testArray.length);
  });

  it('returns an array containing the same elements', () => {
    const shuffledArray = shuffleArray(testArray);
    testArray.forEach((element) => {
      expect(shuffledArray).toContain(element);
    });
  });
});




